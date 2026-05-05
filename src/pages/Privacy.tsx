import { MarketingLayout } from '@/components/layout';

const Privacy = () => (
  <MarketingLayout>
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">Politique de Confidentialité</h1>
        <p className="text-muted-foreground mb-10">Dernière mise à jour : 5 mai 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">1. Responsable du traitement</h2>
            <p><strong>Monsieur Pipeline</strong> — éditeur de la plateforme Kléa (<strong>klea.app</strong>)<br />
            Contact DPO : <strong>privacy@klea.app</strong></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Données de compte</strong> : email, nom, mot de passe hashé</li>
              <li><strong>Données de facturation</strong> : gérées par Stripe (nous ne stockons jamais vos coordonnées bancaires)</li>
              <li><strong>Données CRM importées</strong> : contacts (nom, email, téléphone, entreprise) fournis par l'utilisateur</li>
              <li><strong>Données d'usage</strong> : logs d'activité, actions de l'agent IA</li>
              <li><strong>Données techniques</strong> : adresse IP, navigateur, cookies de session</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fourniture du service et gestion du compte</li>
              <li>Traitement des paiements</li>
              <li>Amélioration du service et statistiques anonymisées</li>
              <li>Envoi de communications transactionnelles (confirmation, factures)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">4. Base légale (RGPD)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Exécution du contrat (art. 6.1.b) pour la fourniture du service</li>
              <li>Intérêt légitime (art. 6.1.f) pour l'amélioration du service</li>
              <li>Consentement (art. 6.1.a) pour les communications marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">5. Sous-traitants</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> (hébergement base de données — UE)</li>
              <li><strong>Stripe</strong> (paiement — certifié PCI-DSS)</li>
              <li><strong>Vercel</strong> (hébergement frontend — UE possible)</li>
            </ul>
            <p className="mt-2">Tous nos sous-traitants sont liés par des DPA conformes au RGPD.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">6. Durée de conservation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Données de compte : durée du contrat + 3 ans</li>
              <li>Données CRM : supprimées à la résiliation du compte</li>
              <li>Logs : 12 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">7. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Droit d'accès, de rectification et d'effacement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition et de limitation du traitement</li>
              <li>Droit de retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-2">Pour exercer ces droits : <strong>privacy@klea.app</strong><br />
            Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (cnil.fr).</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-3">8. Cookies</h2>
            <p>Kléa utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
          </section>

        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Privacy;
