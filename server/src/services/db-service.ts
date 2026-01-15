import Database from "better-sqlite3";
import {
  User,
  Workout,
  UserRow,
  WorkoutRow,
  DatabaseService as IDatabaseService,
  WorkoutRecommendation,
} from "@/types";

export class DatabaseService implements IDatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = process.env["DATABASE_PATH"] || "./data/workouts.db";
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
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

  async getWorkoutRecommendations(): Promise<WorkoutRecommendation[]> {
    // do it stupid, create a dummy workout recommendation for all workouts
    const stmt = this.db.prepare("SELECT * FROM workouts");
    const rows = stmt.all() as WorkoutRow[];

    const reccomendation: WorkoutRecommendation[] = [
      {
        id: "rec-1",
        workouts: rows.map((row) => this.mapWorkoutRow(row)),
      },
    ];

    return reccomendation;
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
