'use client';

import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useState } from "react";
import { WorkoutRecommendation, Workout } from "types/types";
import { WorkoutCard } from "./workout-card";
import WorkoutModal from "./workout-modal";

export const GET_WORKOUT_RECOMMENDATIONS = gql`
  query GetWorkoutRecommendations {
    getWorkoutRecommendations {
      id
      workout {
        id
        name
        description
        difficulty
        duration
        muscleGroups
        equipment
        instructions
        createdAt
        updatedAt
      }
      confidence
      reasoning
      aiGenerated
      createdAt
    }
  }
`;


interface QueryResponse {
  getWorkoutRecommendations: WorkoutRecommendation[];
}

export default function WorkoutsPanel() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<QueryResponse>(GET_WORKOUT_RECOMMENDATIONS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const handleOpenWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-red-hat-display font-bold text-2xl mb-6 text-gray-900 dark:text-white">
          AI-Powered Recommendations
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-red-hat-display font-bold text-2xl mb-6 text-gray-900 dark:text-white">
          Lifty Recommends
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            Error loading workout recommendations: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const recommendations = data?.getWorkoutRecommendations || [];

  return (
    <div className="space-y-6">
      <div className=" pl-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="inline-flex items-center justify-center text-white w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512">
              <path d="M352 0c0-17.7-14.3-32-32-32S288-17.7 288 0l0 64-96 0c-53 0-96 43-96 96l0 224c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-224c0-53-43-96-96-96l-96 0 0-64zM160 368c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zm120 0c0-13.3 10.7-24 24-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24zM224 176a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm144 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM64 224c0-17.7-14.3-32-32-32S0 206.3 0 224l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96zm544-32c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32z" />
            </svg>
          </div>
          <div>
            <h3 className="font-red-hat-display font-bold text-2xl text-gray-900 dark:text-white">
              AI-Powered Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Custom workouts generated just for you
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Preparing custom workouts...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <WorkoutCard
                key={recommendation.workout.id}
                workout={recommendation.workout}
                onOpenWorkout={handleOpenWorkout}
              />
            ))}
          </div>
        )}
      </div>

      {/* Workout Modal */}
      <WorkoutModal
        isOpen={isModalOpen}
        workout={selectedWorkout}
        onClose={handleCloseModal}
      />
    </div>
  );
}