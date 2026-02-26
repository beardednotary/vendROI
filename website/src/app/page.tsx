import { Hero } from '@/components/Hero';
import { StatsStrip } from '@/components/StatsStrip';
import { ProblemSolution } from '@/components/ProblemSolution';
import { ScreenshotsCarousel } from '@/components/ScreenshotsCarousel';
import { HowItWorks } from '@/components/HowItWorks';
import { VerdictExamples } from '@/components/VerdictExamples';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { CTA } from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ProblemSolution />
      <ScreenshotsCarousel />
      <HowItWorks />
      <VerdictExamples />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
