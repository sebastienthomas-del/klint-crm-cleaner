import { MarketingLayout } from '@/components/layout';
import {
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  HowItWorksSection,
  ROISection,
  TestimonialsSection,
  IntegrationsSection,
  PricingPreviewSection,
  CTASection,
} from '@/components/marketing';

const Index = () => {
  return (
    <MarketingLayout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ROISection />
      <TestimonialsSection />
      <IntegrationsSection />
      <PricingPreviewSection />
      <CTASection />
    </MarketingLayout>
  );
};

export default Index;
