import PreferencesPanel from "./preferences-panel/preferences-panel";
import WorkoutsPanel from "./workouts-panel/workouts-pane";

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
            <div className="relative bg-white dark:bg-gray-900 p-8 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="200">
              
              {/* Two panel layout */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-6">
                
                {/* Left Panel */}
                <PreferencesPanel />
       
                {/* Right Panel */}
                <WorkoutsPanel />


              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}