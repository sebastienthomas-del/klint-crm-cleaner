import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Mail,
  Sparkles,
  Rocket,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarketingLayout } from '@/components/layout';
import { toast } from 'sonner';
import {
  qualifyLead,
  type DemoLead,
  type QualificationResult,
  type CompanySize,
  type CrmName,
  type Goal,
} from '@/lib/icpQualification';

type Step = 'form' | 'qualifying' | 'instant_trial' | 'planned_demo';

const Demo = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [lead, setLead] = useState<DemoLead>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    companySize: '11-50',
    crm: 'hubspot',
    goal: 'all',
    notes: '',
  });

  const update = <K extends keyof DemoLead>(key: K, value: DemoLead[K]) =>
    setLead((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('qualifying');

    // Simulated lead capture + qualification.
    // TODO(backend): persist lead in `demo_requests`, send transactional email, notify sales.
    await new Promise((r) => setTimeout(r, 1200));

    const qualification = qualifyLead(lead);
    setResult(qualification);
    setStep(qualification.path);

    toast.success('Email de confirmation envoyé', {
      description: `Un récap a été envoyé à ${lead.email}.`,
    });
  };

  return (
    <MarketingLayout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Stepper */}
          <FunnelStepper step={step} />

          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Démo personnalisée + essai gratuit
                    </span>
                  </div>
                  <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                    Découvrez Kleant en 2 minutes
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Dites-nous comment vous travaillez. Nous vous orientons vers l'essai gratuit
                    instantané ou une démo planifiée selon votre contexte.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-sm">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          required
                          value={lead.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          required
                          value={lead.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="vous@entreprise.com"
                          value={lead.email}
                          onChange={(e) => update('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Poste</Label>
                        <Input
                          id="role"
                          placeholder="Head of Sales, RevOps…"
                          value={lead.role}
                          onChange={(e) => update('role', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Entreprise</Label>
                        <Input
                          id="company"
                          required
                          value={lead.company}
                          onChange={(e) => update('company', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Taille de l'équipe sales</Label>
                        <Select
                          value={lead.companySize}
                          onValueChange={(v) => update('companySize', v as CompanySize)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-200">51-200</SelectItem>
                            <SelectItem value="201-1000">201-1000</SelectItem>
                            <SelectItem value="1000+">1000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>CRM utilisé</Label>
                        <Select
                          value={lead.crm}
                          onValueChange={(v) => update('crm', v as CrmName)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hubspot">HubSpot</SelectItem>
                            <SelectItem value="pipedrive">Pipedrive</SelectItem>
                            <SelectItem value="salesforce">Salesforce</SelectItem>
                            <SelectItem value="zoho">Zoho</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                            <SelectItem value="none">Aucun pour le moment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Objectif principal</Label>
                        <Select
                          value={lead.goal}
                          onValueChange={(v) => update('goal', v as Goal)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dedupe">Dédoublonnage</SelectItem>
                            <SelectItem value="enrich">Enrichissement</SelectItem>
                            <SelectItem value="reactivate">Réactivation leads</SelectItem>
                            <SelectItem value="scoring">Scoring & priorisation</SelectItem>
                            <SelectItem value="all">Tout le périmètre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Contexte (optionnel)</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        placeholder="Volume de contacts, problème prioritaire…"
                        value={lead.notes}
                        onChange={(e) => update('notes', e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-primary shadow-glow hover:shadow-glow-lg gap-2"
                    >
                      Continuer
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      <ShieldCheck className="w-3 h-3 inline mr-1" />
                      Vos informations restent confidentielles. Aucun spam.
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 'qualifying' && (
              <motion.div
                key="qualifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-6" />
                <h2 className="font-display text-2xl font-semibold mb-2">
                  Analyse de votre contexte…
                </h2>
                <p className="text-muted-foreground">
                  Notre IA évalue le meilleur parcours pour vous.
                </p>
              </motion.div>
            )}

            {step === 'instant_trial' && result && (
              <InstantTrialScreen
                lead={lead}
                result={result}
                onActivate={() => {
                  // TODO(backend): create `trials` row + auth account.
                  navigate(
                    `/auth?tab=signup&trial=14&email=${encodeURIComponent(lead.email)}`
                  );
                }}
              />
            )}

            {step === 'planned_demo' && result && (
              <PlannedDemoScreen lead={lead} result={result} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </MarketingLayout>
  );
};

const FunnelStepper = ({ step }: { step: Step }) => {
  const steps = [
    { id: 'form', label: 'Vos infos' },
    { id: 'qualifying', label: 'Qualification' },
    { id: 'done', label: 'Activation' },
  ];
  const currentIndex =
    step === 'form' ? 0 : step === 'qualifying' ? 1 : 2;

  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              i <= currentIndex
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-xs">
              {i + 1}
            </span>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-px ${
                i < currentIndex ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const InstantTrialScreen = ({
  lead,
  result,
  onActivate,
}: {
  lead: DemoLead;
  result: QualificationResult;
  onActivate: () => void;
}) => (
  <motion.div
    key="instant"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto text-center"
  >
    <div className="w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mx-auto mb-6">
      <Rocket className="w-8 h-8 text-primary-foreground" />
    </div>
    <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
      Bonne nouvelle, {lead.firstName} 👋
    </h2>
    <p className="text-lg text-muted-foreground mb-8">
      Votre profil est éligible à l'<strong className="text-foreground">essai gratuit
      14 jours</strong>, activable en 30 secondes. Pas de carte bancaire.
    </p>

    <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-success" />
        <span className="font-medium">Pourquoi ce parcours vous correspond</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>

    <Button
      size="lg"
      onClick={onActivate}
      className="gradient-primary shadow-glow hover:shadow-glow-lg gap-2"
    >
      Activer mon essai gratuit
      <ArrowRight className="w-4 h-4" />
    </Button>

    <p className="text-xs text-muted-foreground mt-4">
      <Mail className="w-3 h-3 inline mr-1" />
      Un email de confirmation vous attend à {lead.email}
    </p>
  </motion.div>
);

const PlannedDemoScreen = ({
  lead,
  result,
}: {
  lead: DemoLead;
  result: QualificationResult;
}) => (
  <motion.div
    key="planned"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
      <Calendar className="w-8 h-8 text-secondary-foreground" />
    </div>
    <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
      Réservons un créneau, {lead.firstName}
    </h2>
    <p className="text-lg text-muted-foreground mb-8">
      Votre contexte mérite un accompagnement dédié. Un expert Kleant prépare
      une démo personnalisée pour {lead.company}.
    </p>

    <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-success" />
        <span className="font-medium">Ce que nous préparerons</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            {r}
          </li>
        ))}
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
          Lien d'activation essai 14 jours envoyé après le call.
        </li>
      </ul>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        size="lg"
        className="gradient-primary shadow-glow hover:shadow-glow-lg gap-2"
        onClick={() => {
          // TODO: open Calendly modal / embedded scheduler.
          toast.success('Créneau de démo confirmé', {
            description: 'Vous recevrez les détails par email.',
          });
        }}
      >
        Choisir un créneau
        <Calendar className="w-4 h-4" />
      </Button>
      <Link to="/">
        <Button size="lg" variant="outline">
          Retour à l'accueil
        </Button>
      </Link>
    </div>

    <p className="text-xs text-muted-foreground mt-4">
      <Mail className="w-3 h-3 inline mr-1" />
      Confirmation envoyée à {lead.email}
    </p>
  </motion.div>
);

export default Demo;
