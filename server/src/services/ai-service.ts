import OpenAI from "openai";
import { 
  AIRecommendationService as IAIRecommendationService,
  WorkoutAnalysis,
  RecommendationRequest
} from "../types";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root directory
const envPath = path.resolve(__dirname, "../../../.env");

dotenv.config({ path: envPath });

export class AIRecommendationService implements IAIRecommendationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });
  }

  async testOpenAI(): Promise<string> {
    try {
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that can answer questions and help with tasks.`,
          },
          {
            role: "user",
            content:
              "Did this call work? Please respond with a single word answer.",
          },
        ],
      });

      return response.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("Error testing OpenAI:", error);
      throw new Error("Failed to test OpenAI");
    }
  }

  async analyzeAndRecommendWorkouts(request: RecommendationRequest): Promise<WorkoutAnalysis[]> {
    try {
      const { workouts, preferences, maxRecommendations = 5 } = request;
      
      if (workouts.length === 0) {
        return [];
      }

      const systemPrompt = `You are a professional fitness trainer and workout expert. 
      Your job is to analyze a list of workouts and provide recommendations based on user preferences.
      
      You should consider:
      - User's fitness level (beginner, intermediate, advanced)
      - Preferred duration
      - Muscle groups they want to target
      - Available equipment
      - Workout goals
      - Exercise difficulty matching user's level
      - Variety and balance in recommendations
      
      Return your analysis as a JSON array where each object has:
      - workoutId: the ID of the workout
      - score: a number from 0-100 indicating how well this workout matches the user's needs
      - reasoning: a brief explanation of why this workout is good or not good for the user
      
      Only recommend workouts with a score of 60 or higher, and limit to the most relevant ones.`;

      const workoutData = workouts.map(w => ({
        id: w.id,
        name: w.name,
        description: w.description,
        difficulty: w.difficulty,
        duration: w.duration,
        muscleGroups: w.muscleGroups,
        equipment: w.equipment
      }));

      const userPrompt = `Analyze these workouts and provide recommendations:

` +
        `User Preferences: ${JSON.stringify(preferences, null, 2)}\n\n` +
        `Available Workouts: ${JSON.stringify(workoutData, null, 2)}\n\n` +
        `Please recommend up to ${maxRecommendations} workouts that best match the user's preferences.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      const parsed = JSON.parse(content);
      
      // Handle both array and object responses
      const analyses = Array.isArray(parsed) ? parsed : (parsed.recommendations || parsed.workouts || []);
      
      return analyses
        .filter((analysis: any) => analysis.score >= 60)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, maxRecommendations)
        .map((analysis: any) => ({
          workoutId: analysis.workoutId,
          score: analysis.score,
          reasoning: analysis.reasoning
        }));

    } catch (error) {
      console.error("Error analyzing workouts:", error);
      // Return fallback recommendations based on simple matching
      return this.getFallbackRecommendations(request);
    }
  }

  private getFallbackRecommendations(request: RecommendationRequest): WorkoutAnalysis[] {
    const { workouts, preferences, maxRecommendations = 5 } = request;
    
    return workouts
      .map(workout => {
        let score = 50; // Base score
        let reasoning = "Basic recommendation";

        // Match difficulty level
        if (preferences?.difficulty && workout.difficulty === preferences.difficulty) {
          score += 20;
          reasoning += ` - matches ${preferences.difficulty} difficulty level`;
        }

        // Match duration preference
        if (preferences?.duration) {
          const durationDiff = Math.abs(workout.duration - preferences.duration);
          if (durationDiff <= 10) {
            score += 15;
            reasoning += ` - duration close to preferred ${preferences.duration} minutes`;
          }
        }

        // Match muscle groups
        if (preferences?.muscleGroups && preferences.muscleGroups.length > 0) {
          const matchingMuscles = workout.muscleGroups.filter(mg => 
            preferences.muscleGroups!.includes(mg)
          );
          if (matchingMuscles.length > 0) {
            score += matchingMuscles.length * 10;
            reasoning += ` - targets preferred muscle groups: ${matchingMuscles.join(', ')}`;
          }
        }

        return {
          workoutId: workout.id,
          score: Math.min(score, 100),
          reasoning
        };
      })
      .filter(analysis => analysis.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations);
  }
}
