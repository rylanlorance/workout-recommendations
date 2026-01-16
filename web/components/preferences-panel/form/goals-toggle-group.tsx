'use client';

import * as React from "react";

interface GoalsSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
}

const fitnessGoals = [
  { value: "strength", label: "Strength Training" },
  { value: "endurance", label: "Endurance & Cardio" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "flexibility", label: "Flexibility & Mobility" },
  { value: "general-fitness", label: "General Fitness" }
];

export default function GoalsSelect({ 
  value = [], 
  onValueChange, 
  defaultValue = [] 
}: GoalsSelectProps) {
  const handleToggle = (goalValue: string) => {
    const newValue = value.includes(goalValue)
      ? value.filter(item => item !== goalValue)
      : [...value, goalValue];
    
    onValueChange?.(newValue);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Select your fitness goals
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fitnessGoals.map((goal) => {
          const isSelected = value.includes(goal.value);
          
          return (
            <label
              key={goal.value}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(goal.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-sm font-medium">{goal.label}</span>
            </label>
          );
        })}
      </div>
      
    </div>
  );
}