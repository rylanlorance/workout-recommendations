'use client';

import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface DifficultyToggleGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export default function DifficultyToggleGroup({ 
  value, 
  onValueChange, 
  defaultValue = "beginner" 
}: DifficultyToggleGroupProps) {
  return (
    <ToggleGroup.Root
      className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"
      type="single"
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      aria-label="Difficulty Level"
    >
      <ToggleGroup.Item
        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent rounded-md hover:bg-white dark:hover:bg-gray-700 data-[state=on]:bg-white dark:data-[state=on]:bg-gray-600 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400 data-[state=on]:shadow-sm transition-all"
        value="beginner"
        aria-label="Beginner"
      >
        Beginner
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent rounded-md hover:bg-white dark:hover:bg-gray-700 data-[state=on]:bg-white dark:data-[state=on]:bg-gray-600 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400 data-[state=on]:shadow-sm transition-all"
        value="intermediate"
        aria-label="Intermediate"
      >
        Intermediate
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent rounded-md hover:bg-white dark:hover:bg-gray-700 data-[state=on]:bg-white dark:data-[state=on]:bg-gray-600 data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400 data-[state=on]:shadow-sm transition-all"
        value="advanced"
        aria-label="Advanced"
      >
        Advanced
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
