# KLEANT — Brief produit & technique

> Document de référence pour briefer un contributeur (humain ou IA) sur le projet.
> Toute modification structurelle qui contredit ce brief doit être refusée ou remontée.

---

## Prompt de référence (copiable)

```
// KLEANT — Brief produit & technique
// Agent IA autonome de maintenance CRM

PRODUIT
Nom : KLEANT
Vision : Agent IA autonome qui maintient un CRM propre sans intervention humaine.
        Détecte et fusionne les doublons (>95% confiance = auto-merge),
        enrichit les fiches incomplètes, réactive les contacts dormants,
        et qualifie selon un ICP configurable.
Cible : Sales Ops, RevOps, dirigeants commerciaux PME/scale-up.

STACK TECHNIQUE
- React 18 + TypeScript + Vite 5
- Tailwind CSS v3 + shadcn/ui
- Supabase (auth + Postgres + RLS) via Lovable Cloud
- React Query (TanStack Query) pour data fetching et cache serveur
- React Router v6 pour navigation
- react-i18next pour i18n (FR par défaut, EN, ES, IT, PT)
- PAS de Zustand ni Redux : state local via hooks custom (useAgent, useSalesOpsAgent)

CONTRAINTE VITE CRITIQUE
vite.config.ts doit forcer la déduplication React :
  resolve: { dedupe: ['react', 'react-dom', 'react/jsx-runtime'] }
Sinon : erreurs useMemo / hooks dupliqués en runtime.

IDENTITÉ VISUELLE
Palette (HSL dans index.css, jamais en dur dans les composants) :
  --primary    : Raspberry #b43052
  --accent     : Sand     #e8ceb0
  --secondary  : Slate Gray
  --success    : vert sobre
  --warning    : ambre
  --destructive: rouge
Background : appliqué UNE SEULE FOIS sur <body>
  → gradient sand + motif dots raspberry subtil
  → les sections N'AJOUTENT PAS de bg-muted/30 alterné (interdit)
Typo (Google Fonts) :
  - Headings : Inter Tight, font-semibold, tracking-tight
  - Body     : Inter, font-normal, text-sm/text-base
  - Interdit : Space Grotesk, Lexend, serif
Esthétique : sobre, premium, Apple-like. Pas de néon, pas de glassmorphism agressif.

LAYOUT APPLICATIF (/app/*)
- Sidebar shadcn collapsible="icon" (mini-strip avec icônes quand réduite)
- Header sticky : SidebarTrigger + barre recherche contact + cloche notifs
- Logo : icône Pickaxe (lucide) dans pastille gradient raspberry + wordmark "Kleant"
- Mini-card "Agent IA actif" en bas du SidebarContent (dot pulsant + dernier scan)

NAVIGATION (figée — ne pas inventer d'autres entrées)
1. Dashboard       → /app/dashboard       (LayoutDashboard)
2. Doublons        → /app/duplicates      (Users2)
3. Enrichissement  → /app/enrichment      (Sparkles)
4. Réactivation    → /app/reactivation    (RefreshCw)
5. Paramètres      → /app/settings        (Settings)

⛔ INTERDIT : module "Scoring" (retiré du core, décision produit définitive).
   Le scoring ICP existe mais est INTÉGRÉ aux modules, pas une page séparée.

DASHBOARD (composants déjà définis)
- PriorityActions      : top actions IA recommandées du jour
- ClosedLostRecycler   : opportunités Closed Lost à recycler
- ChampionTracker      : champions clients ayant changé de poste
- GhostingAlerts       : deals qui ghostent (silence anormal)
- ICPQualification     : répartition base contacts vs ICP cible

FORMAT IMPOSÉ DES RECOMMANDATIONS IA
Toute reco générée par l'agent DOIT suivre exactement :
  [Contact] | [Score] | [Action recommandée] | [Hook suggéré]
Exemple :
  Marie Dupont (CMO Acme) | 87 | Relancer | "Vu votre levée Series B, parlons attribution"

LOGIQUE AGENT AUTONOME (useAgent.ts)
- États : active | paused | scanning | error
- Fréquence scan : hourly | daily | weekly
- Auto-merge doublons si confiance > 95% (seuil configurable)
- Auto-enrichissement on/off
- Alertes on/off, rapport hebdo on/off
- Timeline log : chaque action loggée (merge, enrich, validate, scan)

ICP CONFIGURABLE
- Critères de qualification personnalisables (industrie, taille, rôle, géo, tech stack)
- Règles d'intent scoring custom
- Sales Ops Intelligence : LTV optim, Closed Lost recycling,
  Champion tracking (job change), ghosting detection

INTÉGRATIONS (page Paramètres)
CRM : HubSpot, Salesforce, Pipedrive, Attio, Folk
Productivité : Slack, Gmail, Outlook, Notion
Enrichissement : Apollo, Dropcontact, Kaspr (à brancher selon dispo)

BASE DE DONNÉES SUPABASE (tables core)
- profiles          : user metadata (lié à auth.users)
- user_roles        : table SÉPARÉE avec enum app_role + has_role() SECURITY DEFINER
                      (jamais de role sur profiles → faille d'escalade)
- crm_connections   : intégrations actives par user
- automation_rules  : règles de l'agent (seuils, fréquence, on/off)
- activity_log      : timeline des actions agent
RLS activée partout. Policies via has_role() pour les checks admin.

PAGES MARKETING (publiques)
/, /features, /pricing, /about, /contact, /demo, /auth
MarketingLayout avec Header + Footer + LanguageSelector.

LIVRABLES
Cette app est DÉJÀ construite. Ce brief sert de référence pour :
- onboarder un nouveau contributeur
- valider qu'une modification respecte la charte et les règles produit
- éviter de re-proposer Scoring, dark mode, Zustand, ou de casser la palette

RÈGLE D'OR
Avant toute modif structurelle (nouvelle page, nouveau module, changement de palette
ou de typo), vérifier les memories projet. Si un changement contredit une règle
mémoire (ex: réintroduire Scoring), refuser et proposer une alternative.
```

---

## Annexe : challenge du prompt original (Claude)

| Proposition Claude | Réalité KLEANT | Décision |
|---|---|---|
| Nom "Agent IA CRM" | KLEANT | Renommé |
| Zustand pour state | React Query + hooks custom | Retiré |
| Nav avec Import CRM / Nettoyage / Intelligence / **Scoring** | Dashboard / Doublons / Enrichissement / Réactivation / Paramètres | Remplacé — Scoring interdit |
| Palette Slate-900 + Indigo-500 | Raspberry #b43052 + Sand #e8ceb0 + Slate Gray | Remplacé |
| Inter seul | Inter Tight (titres) + Inter (body) | Complété |
| Dark/light toggle | Hors scope | Retiré |
| Card "Score moyen CRM 0-100" | Scoring retiré du core | Retiré |
| Badges Phase 1/2/3 sur la nav | Pas de modèle de phases | Retiré |
| Plans starter/growth/scale dans state | Pricing pas en place | Retiré |
| "Empty shells" pour toutes les pages | App déjà construite | Inversé : doc descriptive |
| Manque : i18n, agent autonome, ICP, format reco IA, Vite dedupe, user_roles séparé | Tous présents | Ajoutés |
