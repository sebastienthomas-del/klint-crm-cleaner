import { useTranslation } from 'react-i18next';
import { MarketingLayout } from '@/components/layout';
import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  HowItWorksSection,
  DashboardPreviewSection,
  ROISection,
  TestimonialsSection,
  IntegrationsSection,
  PricingPreviewSection,
  SectionHeader,
} from '@/components/marketing';

const Index = () => {
  const { t } = useTranslation();

  return (
    <MarketingLayout>
      <HeroSection />

      {/* Bloc 1 — Fonctionnalités */}
      <SectionHeader
        id="fonctionnalites"
        eyebrow={t('sections.features.eyebrow')}
        title={t('sections.features.title')}
        description={t('sections.features.description')}
      />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardPreviewSection />

      {/* Bloc 2 — Résultats */}
      <SectionHeader
        id="resultats"
        eyebrow={t('sections.results.eyebrow')}
        title={t('sections.results.title')}
        description={t('sections.results.description')}
      />
      <ROISection />

      <IntegrationsSection />

      {/* Bloc 3 — Tarifs / Abonnement */}
      <SectionHeader
        id="tarifs"
        eyebrow={t('sections.pricing.eyebrow')}
        title={t('sections.pricing.title')}
        description={t('sections.pricing.description')}
      />
      <PricingPreviewSection />
      <TestimonialsSection />
    </MarketingLayout>
  );
};

export default Index;
