import { Workout } from "@/types/types";

interface WorkoutCardProps {
  workout: Workout;
  onOpenWorkout?: (workout: Workout) => void;
}

export function WorkoutCard({ workout, onOpenWorkout }: WorkoutCardProps) {
  const difficultyColors = {
    'Beginner': 'text-green-600 dark:text-green-400',
    'Intermediate': 'text-yellow-600 dark:text-yellow-400',
    'Advanced': 'text-red-600 dark:text-red-400'
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors">
      
      <div className="flex items-center gap-6">
        {/* Left Side - View Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onOpenWorkout?.(workout)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            view
          </button>
        </div>

        {/* Right Side - Header and Description */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-3">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{workout.name}</h4>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium px-2 py-1 rounded ${difficultyColors[workout.difficulty as keyof typeof difficultyColors] || 'text-gray-600 dark:text-gray-400'}`}>
                {workout.difficulty}
              </span>
              <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                {workout.duration} min
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {workout.description}
          </p>
        </div>
      </div>
    </div>
  )
}