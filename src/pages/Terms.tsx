import { MarketingLayout } from '@/components/layout';

const Terms = () => (
  <MarketingLayout>
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-muted-foreground mb-10">Dernière mise à jour : 5 mai 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Kléa, éditée par Monsieur Pipeline, accessible à l'adresse <strong>klea.app</strong>. En créant un compte, vous acceptez sans réserve les présentes CGU.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Description du service</h2>
            <p>Kléa est un outil SaaS d'optimisation de bases de données CRM. Il permet notamment :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>La détection et la fusion automatique de contacts doublons</li>
              <li>L'enrichissement de données de contacts</li>
              <li>La réactivation de contacts inactifs</li>
              <li>La connexion à des CRM tiers (HubSpot, etc.) via API</li>
              <li>L'accès à une API REST pour intégration externe</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Compte utilisateur</h2>
            <p>L'accès au service requiert la création d'un compte. Vous êtes responsable de la confidentialité de vos identifiants. Tout usage de votre compte relève de votre responsabilité. Kléa se réserve le droit de suspendre tout compte en cas d'utilisation abusive.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Abonnement et facturation</h2>
            <p>Le service est accessible sur abonnement payant mensuel ou annuel. Les tarifs en vigueur sont affichés sur la page <strong>/pricing</strong>. Le paiement est traité par Stripe. En cas de non-paiement, l'accès au service peut être suspendu. Les abonnements sont résiliables à tout moment ; la résiliation prend effet à la fin de la période en cours.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Données traitées</h2>
            <p>Dans le cadre du service, Kléa traite des données de contacts CRM importées par l'utilisateur. L'utilisateur est seul responsable de la légalité de ces données et de leur conformité au RGPD. Kléa agit en qualité de <strong>sous-traitant</strong> au sens de l'article 28 du RGPD.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Propriété intellectuelle</h2>
            <p>L'ensemble des éléments de la plateforme (interface, algorithmes, marque Kléa) est la propriété exclusive de Monsieur Pipeline. Toute reproduction ou exploitation non autorisée est interdite.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Limitation de responsabilité</h2>
            <p>Kléa ne saurait être tenu responsable des pertes de données, interruptions de service ou dommages indirects. La responsabilité de Kléa est limitée au montant des sommes versées par l'utilisateur au cours des trois derniers mois.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux de Paris.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">9. Contact</h2>
            <p>Pour toute question relative aux présentes CGU : <strong>legal@klea.app</strong></p>
          </section>

        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Terms;
