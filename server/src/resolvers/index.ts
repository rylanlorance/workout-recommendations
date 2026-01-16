import { DatabaseService } from "../services/db-service";
import { AIRecommendationService } from "../services/ai-service";
import { User, Workout, WorkoutRecommendation, WorkoutPreferences } from "@/types";

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

    getWorkoutRecommendations: async (_: any, args: { userId?: string }): Promise<WorkoutRecommendation[]> => {
      return await dbService.getWorkoutRecommendations(args.userId);
    },

    testOpenAI: async (): Promise<string> => {
      return await aiService.testOpenAI();
    },
  },

  Mutation: {
    updatePreferences: async (_: any, args: { input: WorkoutPreferences }): Promise<WorkoutPreferences> => {
      try {
        // For demo purposes, using hardcoded user-1
        // In a real app, get userId from authentication context
        const userId = "user-1";
        
        const updatedUser = await dbService.updateUser(userId, args.input);
        
        if (!updatedUser) {
          throw new Error("Failed to update user preferences");
        }

        return updatedUser.preferences;
      } catch (error) {
        console.error('Error in updatePreferences resolver:', error);
        throw new Error('Failed to update preferences');
      }
    },

    updateMe: async (_: any, args: { input: Partial<WorkoutPreferences> }): Promise<User> => {
      try {
        const userId = "user-1";
        
        // Get current user to merge with new preferences
        const currentUser = await dbService.getUser(userId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        // Merge existing preferences with new ones
        const updatedPreferences = {
          ...currentUser.preferences,
          ...args.input
        };

        // Update in database
        const updatedUser = await dbService.updateUser(userId, updatedPreferences);
        
        if (!updatedUser) {
          throw new Error("Failed to update user");
        }

        return updatedUser;
      } catch (error) {
        console.error('Error in updateMe resolver:', error);
        throw new Error('Failed to update user');
      }
    }
  },
};
