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
    workout: Workout!
    confidence: Float
    reasoning: String
    aiGenerated: Boolean!
    createdAt: Date!
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

  input WorkoutPreferencesInput {
    difficulty: String
    duration: Int
    muscleGroups: [String!]
    equipment: [String!]
    goals: [String!]
  }

  input UpdatePreferencesInput {
    difficulty: String
    duration: Int
    muscleGroups: [String!]
    equipment: [String!]
    goals: [String!]
  }

  input WorkoutFiltersInput {
    search: String
    difficulty: String
    minDuration: Int
    maxDuration: Int
    muscleGroups: [String!]
    equipment: [String!]
  }

  type Query {
    me: User!
    getWorkouts(filters: WorkoutFiltersInput): [Workout!]!
    testOpenAI: String!
    getWorkoutRecommendations: [WorkoutRecommendation!]!
  }

  type Mutation {
    updatePreferences(input: UpdatePreferencesInput!): WorkoutPreferences!
    updateMe(input: WorkoutPreferencesInput!): User!
  }
`;
