export const metadata = {
  title: 'Home - Appy',
  description: 'Page description',
}

import CentralCard from '@/components/central-card'
import PageIllustration from '@/components/page-illustration'

export default function Home() {
  return (
    <>
      {/*  Page illustration */}
      <div className="relative max-w-6xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>

      {/* Central Card - Core Component */}
      <CentralCard />
    </>
  )
}
