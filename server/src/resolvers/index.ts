import { DatabaseService } from "../services/db-service";
import { AIRecommendationService } from "../services/ai-service";
import { User, Workout, WorkoutRecommendation } from "../types";

// Initialize services
const dbService = new DatabaseService();
const aiService = new AIRecommendationService();

export const resolvers = {
  Date: {
    serialize: (date: Date) => date.toISOString(),
    parseValue: (value: string) => new Date(value),
    parseLiteral: (ast: any) => new Date(ast.value as string),
  },

  Query: {
    me: async (): Promise<User> => {
      // For demo purposes, return the first user
      // In a real app, this would come from authentication
      const user = await dbService.getUser("user-1");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },

    getWorkouts: async (): Promise<Workout[]> => {
      return await dbService.getWorkouts();
    },

    getWorkoutRecommendations: async (): Promise<WorkoutRecommendation[]> => {
      return await dbService.getWorkoutRecommendations();
    },

    testOpenAI: async (): Promise<string> => {
      return await aiService.testOpenAI();
    },
  },
};
