import HeroStage from '@/components/home/HeroStage';
import AboutSection from '@/components/home/AboutSection';
import ResearchSection from '@/components/home/ResearchSection';
import PublicationsSection from '@/components/home/PublicationsSection';
import TeamSection from '@/components/home/TeamSection';
import NewsSection from '@/components/home/NewsSection';
import JoinSection from '@/components/home/JoinSection';

// News is read per request, so a new post appears on the next load.
export const dynamic = 'force-dynamic';

/**
 * One-page home. Section ids here must match lib/sections.ts, which drives the
 * nav and its scroll-spy. Each section previews a full page that still exists
 * on its own route.
 */
export default function HomePage() {
  return (
    <>
      <HeroStage />
      <AboutSection />
      <ResearchSection />
      <PublicationsSection />
      <TeamSection />
      <NewsSection />
      <JoinSection />
    </>
  );
}
