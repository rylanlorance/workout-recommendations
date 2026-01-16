'use client'

import { User, WorkoutPreferences } from "@/types/types";
import { useQuery, useMutation, gql } from "@apollo/client";
import { ToggleGroup } from "radix-ui";
import { useState, useEffect } from "react";
import DifficultyToggleGroup from "./form/difficulty-toggle-group";
import MuscleGroupSelect from "./form/muscle-group-select";
import GoalsToggleGroup from "./form/goals-toggle-group";

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      preferences {
        difficulty
        duration
        muscleGroups
        equipment
        goals
      }
    }
  }
`;

const UPDATE_PREFERENCES = gql`
  mutation UpdatePreferences($input: UpdatePreferencesInput!) {
    updatePreferences(input: $input) {
      difficulty
      duration
      muscleGroups
      equipment
      goals
    }
  }
`;


interface MeResponse {
  me: User;
}

export default function PreferencesPanel() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, loading, error } = useQuery<MeResponse>(GET_ME);

  const [updatePreferences, { loading: updating, error: updateError }] = useMutation(UPDATE_PREFERENCES, {
    refetchQueries: [{ query: GET_ME }],
    onCompleted: () => {
      console.log('Preferences updated successfully');
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
    }
  });


  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading preferences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading preferences</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const user = data?.me;
  const preferences = user?.preferences;

  const handleDifficultyChange = async (value: string) => {
    if (preferences) {
      try {
        await updatePreferences({
          variables: {
            input: {
              difficulty: value,
              duration: preferences.duration,
              muscleGroups: preferences.muscleGroups || [],
              equipment: preferences.equipment || [],
              goals: preferences.goals || []
            }
          }
        });
      } catch (err) {
        console.error('Failed to update difficulty:', err);
      }
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Your Workout Preferences</h2>
        {updating && (
          <p className="text-sm text-blue-600 mt-1">Saving changes...</p>
        )}
        {updateError && (
          <p className="text-sm text-red-600 mt-1">Failed to save: {updateError.message}</p>
        )}
      </div>

      {preferences ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <DifficultyToggleGroup
              value={preferences.difficulty}
              onValueChange={handleDifficultyChange}
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Target Muscle Groups
            </label>
            <div className="flex flex-wrap gap-2">
              <MuscleGroupSelect
                value={preferences.muscleGroups}
                onValueChange={(newGroups) => {
                  updatePreferences({
                    variables: {
                      input: {
                        difficulty: preferences.difficulty,
                        duration: preferences.duration,
                        muscleGroups: newGroups,
                        equipment: preferences.equipment || [],
                        goals: preferences.goals || []
                      }
                    }
                  })
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goals
            </label>
          <GoalsToggleGroup 
            value={preferences.goals}
            onValueChange={(newGoals) => {
              updatePreferences({
                variables: {
                  input: {
                    difficulty: preferences.difficulty,
                    duration: preferences.duration,
                    muscleGroups: preferences.muscleGroups || [],
                    equipment: preferences.equipment || [],
                    goals: newGoals
                  }
                }
              })
            }}
          />
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No preferences found</p>
          <p className="text-sm text-gray-400 mt-1">Set up your workout preferences to get started</p>
        </div>
      )}
    </div>
  );
}
