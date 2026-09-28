import { LenisProvider } from '@/components/providers/LenisProvider'
import { Navbar } from '@/components/ui/Navbar'
import { PlatformSequenceHero } from '@/components/sections/PlatformSequenceHero'
import { PlatformOverview } from '@/components/sections/PlatformOverview'
import { ThesisHorizontalScroll } from '@/components/sections/ThesisHorizontalScroll'
import { MarketOpportunity } from '@/components/sections/MarketOpportunity'
import { Portfolio } from '@/components/sections/Portfolio'
import { CMOShowcase } from '@/components/sections/CMOShowcase'
import { ReturnModel } from '@/components/sections/ReturnModel'
import { LeadershipTeam } from '@/components/sections/LeadershipTeam'
import { ROVAFramework } from '@/components/sections/ROVAFramework'
import { MissionVision } from '@/components/sections/MissionVision'
import { ContactSection } from '@/components/sections/ContactSection'
import { Footer } from '@/components/sections/Footer'

export default function MerovaHomePage() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-background">
        {/* Fixed Navigation */}
        <Navbar />
        
        <main>
          {/* Section 1: Scroll-scrubbed platform sequence (pinned) */}
          <PlatformSequenceHero />
          
          {/* Section 2: Platform Overview */}
          <PlatformOverview />
          
          {/* Section 3: Investment Thesis (horizontal scroll) */}
          <ThesisHorizontalScroll />
          
          {/* Section 4: Market Opportunity */}
          <MarketOpportunity />
          
          {/* Section 5: Portfolio Companies */}
          <Portfolio />
          
          {/* Section 6: CMO Showcase */}
          <CMOShowcase />
          
          {/* Section 7: Return Model */}
          <ReturnModel />
          
          {/* Section 8: Leadership Team */}
          <LeadershipTeam />
          
          {/* Section 9: ROVA Framework */}
          <ROVAFramework />
          
          {/* Section 10: Mission & Vision */}
          <MissionVision />
          
          {/* Section 11: Contact */}
          <ContactSection />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </LenisProvider>
  )
}
