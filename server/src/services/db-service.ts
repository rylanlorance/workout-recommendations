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

  async getWorkouts(filters?: {
    search?: string;
    difficulty?: string;
    minDuration?: number;
    maxDuration?: number;
    muscleGroups?: string[];
    equipment?: string[];
  }): Promise<Workout[]> {
    let sql = "SELECT * FROM workouts WHERE 1=1";
    const params: any[] = [];

    if (filters) {
      if (filters.search) {
        sql += " AND (name LIKE ? OR description LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      if (filters.difficulty) {
        sql += " AND difficulty = ?";
        params.push(filters.difficulty);
      }

      if (filters.minDuration) {
        sql += " AND duration_minutes >= ?";
        params.push(filters.minDuration);
      }
      if (filters.maxDuration) {
        sql += " AND duration_minutes <= ?";
        params.push(filters.maxDuration);
      }

      if (filters.muscleGroups && filters.muscleGroups.length > 0) {
        const muscleGroupConditions = filters.muscleGroups.map(() => "muscle_groups LIKE ?").join(" OR ");
        sql += ` AND (${muscleGroupConditions})`;
        filters.muscleGroups.forEach(group => {
          params.push(`%"${group}"%`);
        });
      }

      if (filters.equipment && filters.equipment.length > 0) {
        const equipmentConditions = filters.equipment.map(() => "equipment LIKE ?").join(" OR ");
        sql += ` AND (${equipmentConditions})`;
        filters.equipment.forEach(equip => {
          params.push(`%"${equip}"%`);
        });
      }
    }

    sql += " ORDER BY name";
    
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as WorkoutRow[];
    return rows.map(this.mapWorkoutRow);
  }

  async storeRecommendations(recommendations: WorkoutRecommendation[], userId?: string): Promise<void> {
    const insertStmt = this.db.prepare(`
      INSERT OR REPLACE INTO workout_recommendations 
      (id, user_id, workout_id, confidence, reasoning, ai_generated, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = this.db.transaction((recs: WorkoutRecommendation[]) => {
      for (const rec of recs) {
        // Extract userId from recommendation id (format: rec-workoutId-userId)
        const extractedUserId = userId || rec.id.split('-').pop() || 'anon';
        
        // Verify user exists
        const userCheck = this.db.prepare("SELECT id FROM users WHERE id = ?").get(extractedUserId);
        if (!userCheck) {
          continue; // Skip this recommendation
        }
        
        // Verify workout exists  
        const workoutCheck = this.db.prepare("SELECT id FROM workouts WHERE id = ?").get(rec.workout.id);
        if (!workoutCheck) {
          continue; // Skip this recommendation
        }
        
        insertStmt.run(
          rec.id,
          extractedUserId,
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

      analyses.forEach(analysis => {
        const recommendation: WorkoutRecommendation = {
          id: `rec-${analysis.workoutId}-${userId || 'anon'}`,
          workout: allWorkouts.find(w => w.id === analysis.workoutId)!,
          confidence: analysis.score / 100,
          reasoning: analysis.reasoning,
          aiGenerated: true,
          createdAt: new Date()
        };
        recommendations.push(recommendation);
      });

      // Store recommendations after they're populated
      this.storeRecommendations(recommendations, userId);
      
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
