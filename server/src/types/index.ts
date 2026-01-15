// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  preferences: WorkoutPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutRecommendation {
  id: string;
  workouts: Workout[];
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Input Types
export interface WorkoutPreferences {
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: number;
  muscleGroups?: string[];
  equipment?: string[];
  goals?: string[];
}

// Database Row Types
export interface UserRow {
  id: string;
  email: string;
  name: string;
  fitness_level: string;
  preferences: string; // JSON string
  created_at: number;
  updated_at: number;
}

export interface WorkoutRow {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration_minutes: number;
  muscle_groups: string; // JSON string
  equipment: string; // JSON string
  instructions: string; // JSON string
  created_at: number;
  updated_at: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Service Types
export interface DatabaseService {
  getUser(id: string): Promise<User | null>;
}

export interface AIRecommendationService {
  testOpenAI(): Promise<string | null>;
}
