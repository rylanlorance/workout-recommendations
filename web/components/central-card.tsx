export default function CentralCard() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Central card */}
          <div className="relative max-w-6xl mx-auto">
            {/* Background gradient blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl" aria-hidden="true"></div>
            
            {/* Main card */}
            <div className="relative bg-white dark:bg-gray-900 p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="200">
              
              {/* Two panel layout */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                
                {/* Left Panel */}
                <div className="space-y-6" data-aos="fade-right" data-aos-delay="400">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mb-6">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                  </div>
                  
                  <h2 className="h2 font-red-hat-display font-black mb-4">
                    Welcome to the Future
                  </h2>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      className="btn text-white bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 font-medium px-8 py-3 rounded-lg shadow-lg transform transition duration-150 hover:scale-105" 
                      href="#0"
                    >
                      Get Started
                    </a>
                    <a 
                      className="btn text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 font-medium px-8 py-3 rounded-lg shadow-lg transform transition duration-150 hover:scale-105" 
                      href="#0"
                    >
                      Learn More
                    </a>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6" data-aos="fade-left" data-aos-delay="600">
                  <div className="border-l-4 border-gradient-to-b from-teal-500 to-purple-500 pl-6">
                    <h3 className="font-red-hat-display font-bold text-2xl mb-6 text-gray-900 dark:text-white">
                      Workout Recommendations
                    </h3>
                    
                    {/* Placeholder content for workout recommendations */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Morning Cardio</span>
                          <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">30 min</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Start your day with an energizing cardio routine to boost metabolism.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Strength Training</span>
                          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">45 min</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Build lean muscle with targeted strength exercises.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">Flexibility & Recovery</span>
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">20 min</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Wind down with stretching and mobility exercises.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <a 
                        className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition duration-150"
                        href="#0"
                      >
                        View All Recommendations
                        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}