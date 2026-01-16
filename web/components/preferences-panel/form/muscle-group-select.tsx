'use client';

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

interface MuscleGroupSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const muscleGroups = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "forearms", label: "Forearms" },
  { value: "legs", label: "Legs" },
  { value: "quadriceps", label: "Quadriceps" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "calves", label: "Calves" },
  { value: "glutes", label: "Glutes" },
  { value: "abs", label: "Abs" },
  { value: "core", label: "Core" },
  { value: "full-body", label: "Full Body" }
];

export default function MuscleGroupSelect({ 
  value = [], 
  onValueChange, 
  placeholder = "Select muscle groups",
  disabled = false 
}: MuscleGroupSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSelect = (muscleGroup: string) => {
    const newValue = value.includes(muscleGroup)
      ? value.filter(item => item !== muscleGroup)
      : [...value, muscleGroup];
    
    onValueChange?.(newValue);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const selected = muscleGroups.find(group => group.value === value[0]);
      return selected ? selected.label : value[0];
    }
    return `${value.length} muscle groups selected`;
  };

  return (
    <Select.Root open={isOpen} onOpenChange={setIsOpen}>
      <Select.Trigger
        className={`
          inline-flex items-center justify-between w-full px-3 py-2 
          text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg
          hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1
          disabled:opacity-50 disabled:cursor-not-allowed
          ${value.length > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}
        `}
        disabled={disabled}
        aria-label="Select muscle groups"
      >
        <Select.Value>
          <span className="truncate">{getDisplayText()}</span>
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon 
            className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="relative z-50 w-full min-w-[8rem] overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1 max-h-60 overflow-auto">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">
              Select Multiple Muscle Groups
            </div>
            
            {muscleGroups.map((group) => {
              const isSelected = value.includes(group.value);
              
              return (
                <div
                  key={group.value}
                  className={`
                    relative flex items-center px-3 py-2 text-sm cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md mx-1 my-0.5
                    ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
                  `}
                  onClick={() => handleSelect(group.value)}
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <span className="font-medium">{group.label}</span>
                  </div>
                  
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              );
            })}
            
            {value.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => onValueChange?.([])}
                  className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md mx-1"
                >
                  Clear All ({value.length})
                </button>
              </div>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// Selected items display component (optional - for showing selected items outside the select)
export function SelectedMuscleGroups({ 
  value = [], 
  onRemove 
}: { 
  value?: string[]; 
  onRemove?: (muscleGroup: string) => void; 
}) {
  if (value.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {value.map((muscleGroup) => {
        const group = muscleGroups.find(g => g.value === muscleGroup);
        return (
          <span
            key={muscleGroup}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
          >
            <span>{group?.label || muscleGroup}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(muscleGroup)}
                className="ml-1 hover:text-blue-900 dark:hover:text-blue-200"
                aria-label={`Remove ${group?.label || muscleGroup}`}
              >
                ×
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
