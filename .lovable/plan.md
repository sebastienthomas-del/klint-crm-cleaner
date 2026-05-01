# Plan — Démo interactive in-app

Créer une page publique `/demo-tour` qui simule le fonctionnement complet de Kleant en 6 étapes scénarisées et animées, sans nécessiter de connexion HubSpot ni de compte. Idéale pour montrer le produit en live à un prospect ou en lien dans une cold email.

## Parcours utilisateur (6 étapes)

```
1. Connexion HubSpot     → animation OAuth simulée + barre de progression
2. Audit Flash           → scan animé de 12 847 contacts, score qualité base = 47/100
3. Détection doublons    → liste de 3 groupes (email/phone/name) avec confidence
4. Auto-merge            → un doublon >95% fusionné en live, log timeline
5. Enrichissement        → 1 contact passe de 4/12 à 11/12 champs remplis
6. Résultats             → KPIs finaux : 312 doublons fusionnés, +€48k pipeline débloqué, score 89/100
```

Chaque étape : auto-play de ~4 s + bouton "Suivant" / "Précédent" / "Rejouer" + barre de progression globale.

## Structure technique

**Nouveau fichier `src/pages/DemoTour.tsx`** (route publique, hors AppLayout)
- Layout pleine page sur fond sand/raspberry, header minimal "Kleant — Démo produit" + CTA "Activer mon essai 14j" → `/demo`
- State machine locale (useState `step`, useEffect timer auto-advance)
- Framer Motion pour transitions entre steps (fade + slide)

**Composants steps dans `src/components/demo-tour/`**
- `StepConnect.tsx` — mock OAuth HubSpot (logo + spinner + "Connexion établie ✓")
- `StepAudit.tsx` — compteur animé 0 → 12 847 contacts, jauge score qui monte
- `StepDuplicates.tsx` — 3 cartes groupes doublons (réutilise design de `pages/app/Duplicates.tsx`)
- `StepMerge.tsx` — animation 2 cartes contact qui fusionnent en 1, ligne timeline ajoutée
- `StepEnrich.tsx` — fiche contact avec champs vides qui se remplissent un par un
- `StepResults.tsx` — 4 KPI cards + CTA final
- `TourProgress.tsx` — barre 6 segments + contrôles play/pause/skip

**Données mock dans `src/data/demoTourData.ts`**
- Liste de contacts factices (Marie Dubois, Thomas Martin…) avec doublons volontaires
- Métriques avant/après cohérentes

**Route**
- Ajouter `<Route path="/demo-tour" element={<DemoTour />} />` dans `src/App.tsx` (zone marketing, pas de ProtectedRoute)

**Lien d'accès**
- Bouton "Voir une démo guidée" ajouté dans :
  - Hero de `pages/Index.tsx` (à côté du CTA principal, variante outline)
  - Page `/demo` (alternative au formulaire pour les visiteurs pressés)

## Détails visuels

- Cohérence stricte avec la charte : Raspberry `#b43052` + Sand `#e8ceb0`, Inter Tight headings
- Pas d'alternance `bg-muted/30` — fond body unifié conservé
- Animations sobres (300-500 ms), aucun effet gadget
- Mobile-friendly (le tour se replie en vertical, contrôles en bas sticky)

## Hors-périmètre

- Pas d'appel réel aux edge functions HubSpot (tout est animé localement)
- Pas de persistance / analytics (peut être ajouté plus tard via `activity_log` si besoin)
- Pas de modification du back-end Supabase
