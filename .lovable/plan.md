
# Plan d'implémentation Kleant - Application de maintenance CRM

## Résumé

Transformation complète de l'application Kleant avec :
- Nouveau thème **Gris & Cuivre** (univers minier)
- 4 pages principales : Dashboard, Doublons, Enrichissement, Réactivation
- Dashboard central pour gérer toutes les fonctionnalités
- Page Paramètres avec intégrations (CRM, Slack, Google Workspace, Notion, Teams)
- Agent IA autonome pour le nettoyage et la maintenance

---

## Phase 1 : Nouveau thème Gris & Cuivre

### Palette de couleurs

```text
+------------------+---------------------+---------------------+
|    Élément       |    Couleur          |    Code HSL         |
+------------------+---------------------+---------------------+
| Primary          | Cuivre              | 25 70% 50%          |
| Primary Light    | Cuivre clair        | 25 60% 65%          |
| Secondary        | Gris ardoise        | 220 15% 40%         |
| Background       | Gris très clair     | 220 10% 98%         |
| Card             | Blanc               | 0 0% 100%           |
| Foreground       | Gris charbon        | 220 15% 15%         |
| Muted            | Gris moyen          | 220 10% 60%         |
| Border           | Gris clair          | 220 10% 88%         |
| Success          | Vert émeraude       | 160 84% 39%         |
| Warning          | Ambre               | 38 92% 50%          |
| Destructive      | Rouge               | 0 84% 60%           |
+------------------+---------------------+---------------------+
```

### Fichiers à modifier
- `src/index.css` : Variables CSS pour le thème gris/cuivre
- `tailwind.config.ts` : Mise à jour des keyframes et backgrounds

---

## Phase 2 : Architecture de l'application

### Structure des pages

```text
/app
├── /dashboard        → Vue d'ensemble + Quick Actions
├── /duplicates       → Gestion des doublons
├── /enrichment       → Enrichissement des données
├── /reactivation     → Réactivation des contacts
└── /settings         → Paramètres et intégrations
    ├── Profil
    ├── Connexions (CRM, Slack, etc.)
    ├── Préférences
    └── Agent IA
```

### Fichiers à créer
- `src/pages/app/Duplicates.tsx`
- `src/pages/app/Enrichment.tsx`
- `src/pages/app/Reactivation.tsx`
- `src/pages/app/Settings.tsx`
- `src/components/app/AppLayout.tsx` - Layout commun avec sidebar

---

## Phase 3 : Dashboard Central

Le Dashboard devient le centre de contrôle avec des actions rapides vers toutes les fonctionnalités.

### Sections du Dashboard

1. **KPIs principaux** (4 cards)
   - Score de santé global (jauge circulaire)
   - Total contacts
   - Contacts actifs
   - Doublons détectés

2. **Actions rapides** (Quick Actions Panel)
   - "Fusionner les doublons" → Link vers /duplicates
   - "Enrichir contacts" → Link vers /enrichment
   - "Voir réactivations" → Link vers /reactivation
   - "Lancer scan IA" → Déclenche l'agent

3. **Alertes prioritaires** (liste d'alertes avec CTA)

4. **Activité récente de l'agent IA** (timeline)

5. **Graphiques** (2 charts)
   - Évolution qualité (7 jours)
   - Répartition des scores

6. **Listes suggérées** (3 cards avec export)

---

## Phase 4 : Page Doublons (/app/duplicates)

### Fonctionnalités
- Filtres par niveau de confiance (Haute >90%, Moyenne 70-90%, Basse <70%)
- Liste des groupes de doublons en cards extensibles
- Comparaison côte à côte des données
- Boutons : Fusionner auto, Fusionner manuel, Ignorer
- Actions en masse
- Historique des fusions avec rollback

### Composants à créer
- `src/components/app/duplicates/DuplicateCard.tsx`
- `src/components/app/duplicates/DuplicateComparison.tsx`
- `src/components/app/duplicates/MergeModal.tsx`

---

## Phase 5 : Page Enrichissement (/app/enrichment)

### Fonctionnalités
- Cards par type de données manquantes :
  - Secteur d'activité (firmographics)
  - Taille entreprise
  - LinkedIn
  - Emails à valider
  - Téléphones à formater
  - Postes à standardiser
  
- Toggle pour activer l'enrichissement automatique
- Table des contacts à enrichir avec filtres
- Historique des enrichissements

### Composants à créer
- `src/components/app/enrichment/EnrichmentCard.tsx`
- `src/components/app/enrichment/ContactsToEnrichTable.tsx`
- `src/components/app/enrichment/EnrichmentHistory.tsx`

---

## Phase 6 : Page Réactivation (/app/reactivation)

### Fonctionnalités
- Filtres : période d'inactivité, score potentiel, secteur
- Listes pré-générées :
  - Top 50 cette semaine
  - Anciens clients
  - Leads engagés puis disparus
  - Contacts VIP dormants
  
- Table de priorisation avec :
  - Motif de réactivation
  - Suggestion d'approche
  - Score de probabilité

- Export CSV par liste

### Composants à créer
- `src/components/app/reactivation/ReactivationListCard.tsx`
- `src/components/app/reactivation/PrioritizationTable.tsx`

---

## Phase 7 : Page Paramètres (/app/settings)

### Structure en onglets

**Onglet 1 : Profil**
- Photo, Nom, Email, Poste, Téléphone
- Langue préférée

**Onglet 2 : Connexions (Intégrations)**

Cards d'intégration pour :

| Service           | Type        | Actions                    |
|-------------------|-------------|----------------------------|
| HubSpot           | CRM         | Connecter / Déconnecter    |
| Pipedrive         | CRM         | Connecter / Déconnecter    |
| Salesforce        | CRM         | Connecter / Déconnecter    |
| Slack             | Notification| Connecter / Config channels|
| Google Workspace  | Productivité| Connecter / Sync contacts  |
| Notion            | Documentation| Connecter / Sync bases    |
| Microsoft Teams   | Notification| Connecter / Config channels|

Chaque card affiche :
- Logo du service
- Statut (Connecté / Non connecté)
- Dernière synchronisation
- Bouton d'action

**Onglet 3 : Préférences**
- Fuseau horaire
- Format de date
- Notifications (toggles par type)
- Fréquence des rapports

**Onglet 4 : Agent IA**
- Statut de l'agent (Actif / Pause)
- Configuration des règles automatiques
- Fréquence des scans
- Seuils de confiance pour actions auto
- Logs des dernières actions

### Composants à créer
- `src/components/app/settings/ProfileTab.tsx`
- `src/components/app/settings/ConnectionsTab.tsx`
- `src/components/app/settings/IntegrationCard.tsx`
- `src/components/app/settings/PreferencesTab.tsx`
- `src/components/app/settings/AgentTab.tsx`

---

## Phase 8 : Agent IA Autonome

### Architecture

L'agent IA sera représenté dans l'interface avec un panneau de contrôle et un système de logs en temps réel.

### Fonctionnalités de l'agent

1. **Scan automatique**
   - Détection des doublons
   - Identification des données manquantes
   - Scoring des contacts

2. **Actions automatiques** (configurables)
   - Fusion des doublons haute confiance (>95%)
   - Enrichissement des nouveaux contacts
   - Mise à jour des scores

3. **Alertes intelligentes**
   - Notifications pour actions nécessitant validation
   - Rapports hebdomadaires
   - Alertes critiques

4. **Interface de contrôle**
   - Bouton Start/Pause
   - Indicateur de statut (En cours, En attente, Erreur)
   - Timeline des actions récentes
   - Statistiques de performance

### Composants à créer
- `src/components/app/agent/AgentStatus.tsx`
- `src/components/app/agent/AgentControls.tsx`
- `src/components/app/agent/AgentTimeline.tsx`
- `src/components/app/agent/AgentConfig.tsx`
- `src/hooks/useAgent.ts` - Hook pour gérer l'état de l'agent

---

## Phase 9 : Mise à jour du Routing

Fichier `src/App.tsx` :
- Ajouter routes : /app/duplicates, /app/enrichment, /app/reactivation, /app/settings
- Lazy loading pour toutes les pages

---

## Phase 10 : Layout Application

### AppLayout (sidebar + header)

Structure :
```text
+------------------------+
|       Header           |
+--------+---------------+
|        |               |
| Side   |    Content    |
| bar    |               |
|        |               |
+--------+---------------+
```

Sidebar avec :
- Logo Kleant
- Navigation principale (Dashboard, Doublons, Enrichissement, Réactivation)
- Séparateur
- Paramètres
- Statut Agent IA (mini indicateur)
- Profil utilisateur

---

## Phase 11 : Données Mock

Générer des données réalistes pour :
- 234 groupes de doublons
- 1456 contacts à enrichir
- 500+ contacts à réactiver
- Historique d'activité de l'agent
- Logs de connexions

---

## Phase 12 : Traductions

Ajouter dans les 5 fichiers de langue (fr, en, es, it, pt) :
- Clés pour Doublons
- Clés pour Enrichissement
- Clés pour Réactivation
- Clés pour Paramètres
- Clés pour Agent IA
- Clés pour Intégrations

---

## Récapitulatif des fichiers

### Fichiers à modifier
| Fichier | Modification |
|---------|--------------|
| `src/index.css` | Thème gris/cuivre |
| `tailwind.config.ts` | Couleurs et animations |
| `src/App.tsx` | Nouvelles routes |
| `src/pages/app/Dashboard.tsx` | Refonte avec thème + quick actions |
| `src/locales/*.json` | Nouvelles traductions |

### Fichiers à créer
| Fichier | Description |
|---------|-------------|
| `src/components/app/AppLayout.tsx` | Layout avec sidebar |
| `src/components/app/AppSidebar.tsx` | Sidebar navigation |
| `src/pages/app/Duplicates.tsx` | Page doublons |
| `src/pages/app/Enrichment.tsx` | Page enrichissement |
| `src/pages/app/Reactivation.tsx` | Page réactivation |
| `src/pages/app/Settings.tsx` | Page paramètres |
| `src/components/app/duplicates/*.tsx` | Composants doublons |
| `src/components/app/enrichment/*.tsx` | Composants enrichissement |
| `src/components/app/reactivation/*.tsx` | Composants réactivation |
| `src/components/app/settings/*.tsx` | Composants paramètres |
| `src/components/app/agent/*.tsx` | Composants agent IA |
| `src/hooks/useAgent.ts` | Hook agent IA |
| `src/data/mockData.ts` | Données mock centralisées |

---

## Ordre d'exécution

1. Thème gris/cuivre (index.css + tailwind.config.ts)
2. AppLayout + AppSidebar
3. Mise à jour Dashboard avec thème
4. Page Doublons
5. Page Enrichissement
6. Page Réactivation
7. Page Paramètres avec intégrations
8. Composants Agent IA
9. Traductions
10. Données mock

