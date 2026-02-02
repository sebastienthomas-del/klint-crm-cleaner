
# Plan d'implémentation - Agent Sales Ops Expert

## Objectif

Transformer Kleant en un véritable expert Sales Operations avec 5 modules avancés pour maximiser les bookings et optimiser la LTV :

1. **Scoring d'intention** - Analyse des signaux d'engagement pour identifier les leads chauds
2. **Qualification ICP** - Matching automatique avec le profil client idéal
3. **Recyclage Closed Lost** - Détection des opportunités perdues à réouvrir
4. **Tracking Champions** - Suivi des changements d'entreprise
5. **Anti-Ghosting** - Détection des opportunités silencieuses

---

## Architecture globale

```text
Dashboard Central
      |
      +-- Section "Actions prioritaires du jour"
      |      |-- Top 10 contacts Hot (score intention >80)
      |      |-- Deals à bumper (ghosting)
      |      |-- Champions détectés (changement entreprise)
      |
      +-- Section "Alertes intelligentes"
      |      |-- Closed Lost à recycler
      |      |-- High Value Targets inactifs
      |
      +-- Section "Timeline Agent"
             |-- Historique des actions recommandées
             |-- Format: [Contact] | [Score] | [Action] | [Hook]
```

---

## Phase 1 : Nouveaux modèles de données

### Fichier `src/data/mockData.ts` - Extensions

```text
+----------------------------+-----------------------------------------------+
| Interface                  | Nouveaux champs                               |
+----------------------------+-----------------------------------------------+
| Contact (enrichi)          | intentScore: number (0-100)                   |
|                            | icpFit: 'perfect' | 'good' | 'partial' | 'low'|
|                            | signals: EngagementSignal[]                   |
|                            | championHistory: CompanyChange[]              |
|                            | lastDealId?: string                           |
+----------------------------+-----------------------------------------------+
| EngagementSignal           | type: 'pricing_page' | 'email_open' |         |
|                            |       'download' | 'linkedin' | 'website'     |
|                            | timestamp: string                             |
|                            | value: number (points attribués)              |
+----------------------------+-----------------------------------------------+
| ClosedLostDeal             | id, contactId, dealName, amount               |
|                            | lostReason: 'budget' | 'timing' | 'competitor' |
|                            | lostDate: string                              |
|                            | triggers: ReopenTrigger[]                     |
+----------------------------+-----------------------------------------------+
| ReopenTrigger              | type: 'funding' | 'quarter_change' |          |
|                            |       'new_project' | 'growth'                |
|                            | detectedAt: string                            |
|                            | description: string                           |
+----------------------------+-----------------------------------------------+
| GhostingOpportunity        | id, contactId, dealName, amount               |
|                            | lastActivity: string                          |
|                            | daysSilent: number                            |
|                            | suggestedBump: string                         |
+----------------------------+-----------------------------------------------+
| ChampionChange             | contactId, previousCompany, newCompany        |
|                            | detectedAt: string                            |
|                            | linkedInUrl?: string                          |
|                            | suggestedHook: string                         |
+----------------------------+-----------------------------------------------+
```

---

## Phase 2 : Nouveau hook `useSalesOpsAgent`

### Fichier `src/hooks/useSalesOpsAgent.ts`

Fonctionnalités :
- **calculateIntentScore(contact)** : Calcule le score 0-100 basé sur les signaux
  - +20 visite page Tarifs
  - +10 interaction LinkedIn
  - +15 téléchargement ressource
  - +5 ouverture email
  - -5 par mois d'inactivité

- **evaluateICPFit(contact, icpConfig)** : Compare aux critères ICP
  - Retourne 'perfect', 'good', 'partial', 'low'
  - Flag "High Value Target" même si inactif

- **detectReopenTriggers(closedLostDeals)** : Surveille les triggers
  - Levée de fonds (API simulée)
  - Nouveau trimestre
  - Signal de croissance

- **trackChampionMoves(contacts)** : Détecte les changements d'entreprise
  - Génère un template de relance personnalisé

- **detectGhosting(opportunities, thresholdDays)** : 
  - Repère les deals sans activité > X jours
  - Suggère un "Bump" avec valeur ajoutée

---

## Phase 3 : Nouveau composant Dashboard - Section "Actions du jour"

### Fichier `src/components/app/dashboard/PriorityActions.tsx`

Structure :
```text
+---------------------------------------------------------------+
|  ACTIONS PRIORITAIRES DU JOUR                            [8]  |
+---------------------------------------------------------------+
|  HOT LEADS (Score >80)                                        |
|  +----------------------------------------------------------+ |
|  | Marc Dubois | 92 | Appeler maintenant                    | |
|  | BigCorp - VP Sales                                       | |
|  | Hook: "Votre concurrent vient de signer avec nous..."    | |
|  +----------------------------------------------------------+ |
|                                                               |
|  CHAMPIONS DETECTES                                           |
|  +----------------------------------------------------------+ |
|  | Julie Lambert a rejoint TechStart (ex-Startup.io)        | |
|  | Hook: "Félicitations pour votre nouveau poste..."        | |
|  +----------------------------------------------------------+ |
|                                                               |
|  DEALS A BUMPER (Ghosting >15j)                              |
|  +----------------------------------------------------------+ |
|  | Enterprise SA - 50K€ | 23j sans activité                 | |
|  | Bump suggéré: "Partager case study secteur similaire"    | |
|  +----------------------------------------------------------+ |
+---------------------------------------------------------------+
```

Chaque carte affiche :
- **Contact** : Nom, entreprise, poste
- **Score** : Badge coloré (Hot/Warm/Cold)
- **Action recommandée** : Appeler, Email, LinkedIn
- **Hook suggéré** : Message ultra-personnalisé

---

## Phase 4 : Section "Closed Lost à recycler"

### Fichier `src/components/app/dashboard/ClosedLostRecycler.tsx`

Structure :
```text
+---------------------------------------------------------------+
|  OPPORTUNITES A RECYCLER                                [12]  |
+---------------------------------------------------------------+
|  BUDGET PROBABLEMENT DEBLOQUE                                 |
|  +----------------------------------------------------------+ |
|  | Acme Corp | Deal: Licence Enterprise | 45K€              | |
|  | Trigger: Levée Série B détectée (20M€)                   | |
|  | Perdu il y a: 4 mois | Raison: Budget insuffisant        | |
|  | Hook: "Suite à votre récente levée, votre projet..."     | |
|  | [Contacter] [Ignorer]                                    | |
|  +----------------------------------------------------------+ |
|                                                               |
|  NOUVEAU TRIMESTRE                                            |
|  +----------------------------------------------------------+ |
|  | Tech Solutions | Deal: Abonnement Pro | 12K€             | |
|  | Trigger: Q2 2025 démarré - nouveaux budgets              | |
|  +----------------------------------------------------------+ |
+---------------------------------------------------------------+
```

---

## Phase 5 : Section "Qualification ICP"

### Fichier `src/components/app/dashboard/ICPQualification.tsx`

Structure :
```text
+---------------------------------------------------------------+
|  HIGH VALUE TARGETS                                     [23]  |
+---------------------------------------------------------------+
|  Critères ICP: Tech | 50-200 emp. | VP/C-Level              |
+---------------------------------------------------------------+
|  MATCH PARFAIT (meme inactifs)                               |
|  +----------------------------------------------------------+ |
|  | Antoine Mercier | CEO @ Enterprise SA                    | |
|  | ICP Fit: 100% | Inactif depuis: 8 mois                   | |
|  | Pourquoi HVT: Tech, 150 emp, décideur, €2M ARR potentiel | |
|  | Hook: "Les CEOs tech qui ont adopté Kleant économisent..."| |
|  +----------------------------------------------------------+ |
+---------------------------------------------------------------+
```

---

## Phase 6 : Page Settings - Configuration ICP

### Fichier `src/pages/app/Settings.tsx` - Nouvel onglet "ICP & Scoring"

Configuration modifiable :
- **Critères ICP**
  - Tailles entreprise cibles (multi-select)
  - Secteurs prioritaires (tags)
  - Postes cibles (CEO, CTO, VP Sales, etc.)
  - Tech stack souhaité

- **Pondération du scoring**
  - Points par type de signal (sliders)
  - Seuil "Hot" (default: 80)
  - Pénalité inactivité (points/mois)

- **Seuils ghosting**
  - Jours avant alerte (default: 15)
  - Types de deals à surveiller

---

## Phase 7 : Enrichissement page Réactivation

### Fichier `src/pages/app/Reactivation.tsx` - Améliorations

Nouvelles sections :
1. **Champions détectés** - Contacts ayant changé d'entreprise
2. **Closed Lost recyclables** - Avec triggers détectés
3. **High Value Targets dormants** - ICP parfait mais inactif

Nouvelles colonnes table :
- Score d'intention (avec breakdown au survol)
- ICP Fit (badge)
- Motif de réactivation
- Hook suggéré

---

## Phase 8 : Données mock enrichies

### Fichier `src/data/mockData.ts` - Nouvelles données

```text
// Contacts avec signaux d'engagement
hotLeads: [
  { 
    id: 'hot-1',
    firstName: 'Marc', lastName: 'Dubois',
    company: 'BigCorp', position: 'VP Sales',
    intentScore: 92,
    icpFit: 'perfect',
    signals: [
      { type: 'pricing_page', timestamp: '2025-02-01', value: 20 },
      { type: 'email_open', timestamp: '2025-01-31', value: 5 },
      { type: 'linkedin', timestamp: '2025-01-30', value: 10 }
    ],
    suggestedAction: 'Appeler maintenant',
    suggestedHook: 'Suite à votre visite sur notre page tarifs hier...'
  },
  // ... 9 autres
]

// Opportunités perdues avec triggers
closedLostDeals: [
  {
    id: 'cl-1',
    contactId: 'c1',
    dealName: 'Licence Enterprise',
    amount: 45000,
    lostReason: 'budget',
    lostDate: '2024-10-15',
    triggers: [
      { type: 'funding', detectedAt: '2025-01-28', description: 'Levée Série B - 20M€' }
    ],
    suggestedHook: 'Suite à votre récente levée, le timing semble idéal...'
  },
  // ... 11 autres
]

// Champions (changements d'entreprise)
championMoves: [
  {
    contactId: 'ch-1',
    firstName: 'Julie', lastName: 'Lambert',
    previousCompany: 'Startup.io',
    newCompany: 'TechStart',
    newPosition: 'Head of Growth',
    detectedAt: '2025-01-29',
    suggestedHook: 'Félicitations pour votre nouveau poste ! Chez Startup.io...'
  },
  // ... 4 autres
]

// Deals en ghosting
ghostingOpportunities: [
  {
    id: 'ghost-1',
    contactId: 'c3',
    contactName: 'Antoine Mercier',
    company: 'Enterprise SA',
    dealName: 'Pack Premium',
    amount: 50000,
    lastActivity: '2025-01-09',
    daysSilent: 23,
    suggestedBump: 'Partager case study secteur Tech',
    suggestedHook: 'Je pensais à vous en lisant cette étude de cas...'
  },
  // ... 7 autres
]

// Configuration ICP par défaut
defaultICPConfig: {
  companySizes: ['50-200', '201-500'],
  sectors: ['Tech', 'SaaS', 'FinTech'],
  positions: ['CEO', 'CTO', 'VP Sales', 'Head of Growth'],
  scoringWeights: {
    pricingPage: 20,
    emailOpen: 5,
    download: 15,
    linkedin: 10,
    websiteVisit: 3,
    inactivityPenalty: 5
  },
  hotThreshold: 80,
  ghostingDays: 15
}
```

---

## Phase 9 : Traductions

### Fichiers `src/locales/*.json`

Nouvelles clés pour les 5 langues :

```text
"salesOps": {
  "priorityActions": "Actions prioritaires du jour",
  "hotLeads": "Leads chauds",
  "champions": "Champions détectés",
  "ghosting": "Deals à bumper",
  "closedLost": "Opportunités à recycler",
  "icpQualification": "Qualification ICP",
  "highValueTargets": "High Value Targets",
  "intentScore": "Score d'intention",
  "icpFit": "Fit ICP",
  "suggestedAction": "Action recommandée",
  "suggestedHook": "Hook suggéré",
  "callNow": "Appeler maintenant",
  "sendEmail": "Envoyer email",
  "linkedInMessage": "Message LinkedIn",
  "bumpSuggestion": "Suggestion de bump",
  "triggerDetected": "Trigger détecté",
  "budgetUnlocked": "Budget probablement débloqué",
  "newQuarter": "Nouveau trimestre",
  "companyGrowth": "Croissance entreprise",
  "fundingDetected": "Levée de fonds détectée"
}
```

---

## Récapitulatif des fichiers

| Fichier | Action |
|---------|--------|
| `src/data/mockData.ts` | Modifier - Ajouter interfaces + données |
| `src/hooks/useSalesOpsAgent.ts` | Creer - Logique Sales Ops |
| `src/components/app/dashboard/PriorityActions.tsx` | Creer |
| `src/components/app/dashboard/ClosedLostRecycler.tsx` | Creer |
| `src/components/app/dashboard/ICPQualification.tsx` | Creer |
| `src/components/app/dashboard/ChampionTracker.tsx` | Creer |
| `src/components/app/dashboard/GhostingAlerts.tsx` | Creer |
| `src/pages/app/Dashboard.tsx` | Modifier - Integrer nouvelles sections |
| `src/pages/app/Reactivation.tsx` | Modifier - Ajouter colonnes + sections |
| `src/pages/app/Settings.tsx` | Modifier - Ajouter onglet ICP Config |
| `src/locales/fr.json` | Modifier |
| `src/locales/en.json` | Modifier |
| `src/locales/es.json` | Modifier |
| `src/locales/it.json` | Modifier |
| `src/locales/pt.json` | Modifier |

---

## Format de sortie standard

Chaque recommandation suivra le format demande :

```text
[Contact] | [Score] | [Action recommandée] | [Hook suggéré]
```

Exemple dans l'interface :
```text
Marc Dubois (BigCorp) | 92/100 | Appeler | "Suite à votre visite pricing hier, je pense que notre solution Pro correspondrait parfaitement à votre équipe de 45 commerciaux..."
```

---

## Ordre d'execution

1. Enrichir `mockData.ts` avec les nouvelles interfaces et donnees
2. Creer le hook `useSalesOpsAgent.ts`
3. Creer les composants dashboard (PriorityActions, ClosedLostRecycler, etc.)
4. Modifier le Dashboard pour integrer les nouvelles sections
5. Enrichir la page Reactivation
6. Ajouter l'onglet ICP Config dans Settings
7. Mettre a jour les traductions
