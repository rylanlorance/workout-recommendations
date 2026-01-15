import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    email: String!
    name: String!
    fitnessLevel: String!
    preferences: WorkoutPreferences!
    createdAt: Date!
    updatedAt: Date!
  }

  
  type WorkoutRecommendation {
    id: ID!
    workouts: [Workout!]!
  }

  type Workout {
    id: ID!
    name: String!
    description: String!
    difficulty: String!
    duration: Int!
    muscleGroups: [String!]!
    equipment: [String!]!
    instructions: [String!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type WorkoutPreferences {
    difficulty: String
    duration: Int
    muscleGroups: [String!]
    equipment: [String!]
    goals: [String!]
  }

  type Query {
    me: User!
    getWorkouts: [Workout!]!
    testOpenAI: String!
    getWorkoutRecommendations: [WorkoutRecommendation!]!
  }
`;
