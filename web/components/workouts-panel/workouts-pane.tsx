'use client';

import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { WorkoutRecommendation } from "types/types";

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
  // const { data, loading, error } = useQuery<QueryResponse>(GET_WORKOUT_RECOMMENDATIONS);

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <h3 className="font-red-hat-display font-bold text-2xl mb-6 text-gray-900 dark:text-white">
  //           Lifty Recommends
  //       </h3>
  //       <div className="space-y-4">
  //         {[1, 2, 3].map((item) => (
  //           <div key={item} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
  //             <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
  //             <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
  //             <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="space-y-4">
  //       <h3 className="font-red-hat-display font-bold text-2xl mb-6 text-gray-900 dark:text-white">
  //         Lifting Recommends
  //       </h3>
  //       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
  //         <p className="text-red-600 dark:text-red-400">
  //           Error loading workout recommendations: {error.message}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // const recommendations = data?.getWorkoutRecommendations || [];

  // return (
  //   <div className="space-y-6">
  //     <div className="border-l-4 border-gradient-to-b from-teal-500 to-purple-500 pl-6">
  //       <div className="flex items-center space-x-3 mb-2">
  //         <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg">
  //           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //             <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
  //           </svg>
  //         </div>
  //         <div>
  //           <h3 className="font-red-hat-display font-bold text-2xl text-gray-900 dark:text-white">
  //             AI-Powered Recommendations
  //           </h3>
  //           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
  //             Custom workouts generated just for you
  //           </p>
  //         </div>
  //       </div>
        
  //       {recommendations.length === 0 ? (
  //         <div className="text-center py-8">
  //           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full mb-4 opacity-50">
  //             <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //               <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
  //             </svg>
  //           </div>
  //           <p className="text-gray-600 dark:text-gray-400 mb-2">
  //             Your AI trainer is preparing custom workouts...
  //           </p>
  //           <p className="text-sm text-gray-500 dark:text-gray-500">
  //             Check back soon for personalized recommendations!
  //           </p>
  //         </div>
  //       ) : (
  //         <div className="space-y-4">
  //           {recommendations.map((recommendation) => 
  //             recommendation.workouts.map((workout) => {
  //               const difficultyColors = {
  //                 'Beginner': 'text-green-600 dark:text-green-400',
  //                 'Intermediate': 'text-yellow-600 dark:text-yellow-400',
  //                 'Advanced': 'text-red-600 dark:text-red-400'
  //               };

  //               return (
  //                 <div key={workout.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors relative">
  //                   {/* AI Generated Badge */}
  //                   <div className="absolute top-2 right-2 inline-flex items-center space-x-1 bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
  //                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
  //                       <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
  //                     </svg>
  //                     <span>AI Custom</span>
  //                   </div>
                    
  //                   <div className="flex items-center justify-between mb-2 pr-20">{/* Added padding-right to avoid overlap with badge */}
  //                     <h4 className="font-medium text-gray-900 dark:text-white">{workout.name}</h4>
  //                     <div className="flex items-center space-x-2">
  //                       <span className={`text-sm font-medium ${difficultyColors[workout.difficulty as keyof typeof difficultyColors] || 'text-gray-600 dark:text-gray-400'}`}>
  //                         {workout.difficulty}
  //                       </span>
  //                       <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
  //                         {workout.duration} min
  //                       </span>
  //                     </div>
  //                   </div>
                    
  //                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
  //                     {workout.description}
  //                   </p>
                    
  //                   <div className="space-y-2">
  //                     <div className="flex flex-wrap gap-1">
  //                       <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">Muscle Groups:</span>
  //                       {workout.muscleGroups.map((muscle, index) => (
  //                         <span key={index} className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded">
  //                           {muscle}
  //                         </span>
  //                       ))}
  //                     </div>
                      
  //                     {workout.equipment.length > 0 && (
  //                       <div className="flex flex-wrap gap-1">
  //                         <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">Equipment:</span>
  //                         {workout.equipment.map((item, index) => (
  //                           <span key={index} className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded">
  //                             {item}
  //                           </span>
  //                         ))}
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //               );
  //             })
  //           )}
  //         </div>
  //       )}
        
  //       <div className="mt-6">
  //         <a 
  //           className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition duration-150"
  //           href="#0"
  //         >
  //           <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
  //             <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H14V7C14 7.55 14.45 8 15 8H19V9H21ZM7 12V10H5V12H7ZM19 12V10H17V12H19ZM19 16V14H17V16H19ZM7 16V14H5V16H7ZM16 20H8C7.45 20 7 19.55 7 19V18H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V18H17V19C17 19.55 16.55 20 16 20Z"/>
  //           </svg>
  //           Generate More AI Recommendations
  //           <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
  //             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  //           </svg>
  //         </a>
  //       </div>
  //     </div>
  //   </div>
  // );
}