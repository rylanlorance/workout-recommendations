'use client';

import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useState } from "react";
import { WorkoutRecommendation, Workout } from "types/types";
import { WorkoutCard } from "./workout-card";

const GET_WORKOUT_RECOMMENDATIONS = gql`
  query GetWorkoutRecommendations {
    getWorkoutRecommendations {
      id
      workouts {
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
    }
  }
`;


interface QueryResponse {
  getWorkoutRecommendations: WorkoutRecommendation[];
}

export default function WorkoutsPanel() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, loading, error } = useQuery<QueryResponse>(GET_WORKOUT_RECOMMENDATIONS);

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
            Lifty Recommends
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
          Lifting Recommends
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
      <div className="border-l-4 border-gradient-to-b from-teal-500 to-purple-500 pl-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full mb-4 opacity-50">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your AI trainer is preparing custom workouts...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Check back soon for personalized recommendations!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => 
              recommendation.workouts.map((workout) => {
                return (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onOpenWorkout={handleOpenWorkout}
                  />
                );
              })
            )}
          </div>
        )}
        
        <div className="mt-6">
          <a 
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition duration-150"
            href="#0"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
            </svg>
            Generate More AI Recommendations
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Workout Modal */}
      {isModalOpen && selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedWorkout.name}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Workout Details */}
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {selectedWorkout.difficulty}
                </span>
                <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                  {selectedWorkout.duration} minutes
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedWorkout.description}
                </p>
              </div>

              {/* Muscle Groups */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Target Muscle Groups
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkout.muscleGroups.map((muscle, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              {selectedWorkout.equipment.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Required Equipment
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkout.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Instructions
                </h3>
                <ol className="space-y-2">
                  {selectedWorkout.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">
                Start Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}