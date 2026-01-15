import Database from "better-sqlite3";
import {
  User,
  Workout,
  UserRow,
  WorkoutRow,
  DatabaseService as IDatabaseService,
  WorkoutRecommendation,
  RecommendationRequest,
} from "@/types";
import { AIRecommendationService } from "./ai-service";

export class DatabaseService implements IDatabaseService {
  private db: Database.Database;
  private aiService: AIRecommendationService;

  constructor() {
    const dbPath = process.env["DATABASE_PATH"] || "./data/workouts.db";
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.aiService = new AIRecommendationService();
  }

  async getUser(id: string): Promise<User | null> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id) as UserRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapUserRow(row);
  }

  async getWorkouts(): Promise<Workout[]> {
    const stmt = this.db.prepare("SELECT * FROM workouts");
    const rows = stmt.all() as WorkoutRow[];
    return rows.map(this.mapWorkoutRow);
  }

  async getWorkoutRecommendations(userId?: string): Promise<WorkoutRecommendation[]> {
    try {
      // Get all available workouts
      const allWorkouts = await this.getWorkouts();
      
      // Get user preferences if userId is provided
      let userPreferences = undefined;
      if (userId) {
        const user = await this.getUser(userId);
        userPreferences = user?.preferences;
      }
      
      // Use AI to analyze and recommend workouts
      const request: RecommendationRequest = {
        workouts: allWorkouts,
        maxRecommendations: 10
      };
      
      // Add optional properties only if they exist
      if (userId) {
        request.userId = userId;
      }
      if (userPreferences) {
        request.preferences = userPreferences;
      }
      
      const analyses = await this.aiService.analyzeAndRecommendWorkouts(request);
      
      // Map analyses to workout recommendations
      const recommendedWorkouts = analyses
        .map(analysis => {
          const workout = allWorkouts.find(w => w.id === analysis.workoutId);
          return workout ? { ...workout, recommendationScore: analysis.score, reasoning: analysis.reasoning } : null;
        })
        .filter(Boolean) as (Workout & { recommendationScore: number; reasoning: string })[];
      
      const recommendation: WorkoutRecommendation[] = [
        {
          id: `rec-${userId || 'general'}-${Date.now()}`,
          workouts: recommendedWorkouts.map(({ recommendationScore, reasoning, ...workout }) => workout),
        },
      ];
      
      return recommendation;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Fallback to returning all workouts
      const stmt = this.db.prepare("SELECT * FROM workouts");
      const rows = stmt.all() as WorkoutRow[];
      
      const fallbackRecommendation: WorkoutRecommendation[] = [
        {
          id: "rec-fallback",
          workouts: rows.map((row) => this.mapWorkoutRow(row)),
        },
      ];
      
      return fallbackRecommendation;
    }
  }


  private mapUserRow(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      fitnessLevel: row.fitness_level as
        | "beginner"
        | "intermediate"
        | "advanced",
      preferences: JSON.parse(row.preferences),
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000),
    };
  }

  private mapWorkoutRow(row: WorkoutRow): Workout {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      difficulty: row.difficulty as "beginner" | "intermediate" | "advanced",
      duration: row.duration_minutes,
      muscleGroups: JSON.parse(row.muscle_groups),
      equipment: JSON.parse(row.equipment),
      instructions: JSON.parse(row.instructions),
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000),
    };
  }
}
