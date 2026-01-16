import Database from "better-sqlite3";
import {
  User,
  Workout,
  UserRow,
  WorkoutRow,
  DatabaseService as IDatabaseService,
  WorkoutRecommendation,
  RecommendationRequest,
  WorkoutPreferences,
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

  async updateUser(userId: string, preferences: WorkoutPreferences): Promise<User | null> {
    try {
      const stmt = this.db.prepare(`
        UPDATE users 
        SET preferences = ?, updated_at = ? 
        WHERE id = ?
      `); 
      const result = stmt.run(
        JSON.stringify(preferences),
        Math.floor(Date.now() / 1000),
        userId
      );
      
      if (result.changes === 0) {
        return null;
      }

      return await this.getUser(userId);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  } 

  async getWorkouts(): Promise<Workout[]> {
    const stmt = this.db.prepare("SELECT * FROM workouts");
    const rows = stmt.all() as WorkoutRow[];
    return rows.map(this.mapWorkoutRow);
  }

  async storeRecommendations(recommendations: WorkoutRecommendation[]): Promise<void> {
    const insertStmt = this.db.prepare(`
      INSERT OR REPLACE INTO workout_recommendations 
      (id, user_id, workout_id, confidence, reasoning, ai_generated, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = this.db.transaction((recs: WorkoutRecommendation[]) => {
      for (const rec of recs) {
        insertStmt.run(
          rec.id,
          rec.workout.id.split('-')[1], // Extract userId from recommendation id
          rec.workout.id,
          rec.confidence,
          rec.reasoning || null,
          rec.aiGenerated ? 1 : 0,
          Math.floor(rec.createdAt.getTime() / 1000)
        );
      }
    });
    insertMany(recommendations);
  }

  async getWorkoutRecommendations(userId?: string): Promise<WorkoutRecommendation[]> {
    try {
      const allWorkouts = await this.getWorkouts();
      
      let userPreferences = undefined;
      if (userId) {
        const user = await this.getUser(userId);
        userPreferences = user?.preferences;
      }
      
      const request: RecommendationRequest = {
        workouts: allWorkouts,
        maxRecommendations: 10
      };
      
      if (userId) {
        request.userId = userId;
      }
      if (userPreferences) {
        request.preferences = userPreferences;
      }
      
      const analyses = await this.aiService.analyzeAndRecommendWorkouts(request);
      if (analyses === undefined || analyses.length === 0) {
        throw new Error('No analyses returned from AI service');
      }

      const recommendations: WorkoutRecommendation[] = [];

      this.storeRecommendations(recommendations);

      analyses.map(analysis => {
        const recomendation: WorkoutRecommendation = {
          id: `rec-${analysis.workoutId}-${userId || 'anon'}`,
          workout: allWorkouts.find(w => w.id === analysis.workoutId)!,
          confidence: analysis.score / 100,
          reasoning: analysis.reasoning,
          aiGenerated: true,
          createdAt: new Date()
        };
        recommendations.push(recomendation);
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      
      // Fallback to returning all workouts
      const stmt = this.db.prepare("SELECT * FROM workouts");
      const rows = stmt.all() as WorkoutRow[];

      const fallbackRecommendations: WorkoutRecommendation[] = rows.map(row => {
        const workout = this.mapWorkoutRow(row);
        return {
          id: `fallback-${workout.id}-${userId || 'anon'}`,
          workout,
          confidence: 1.0,
          aiGenerated: false,
          createdAt: new Date()
        };
      });

      return fallbackRecommendations;
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
