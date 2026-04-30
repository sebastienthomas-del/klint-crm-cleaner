# Transfert du prompt KLEANT réécrit dans le projet

## Objectif
Créer un fichier `BRIEF.md` à la racine du projet contenant la version corrigée du prompt Claude, alignée sur la réalité de KLEANT (charte Raspberry/Sand, Inter Tight, nav réelle, pas de Scoring, pas de Zustand, pas de dark mode, contrainte Vite dedupe, format reco IA imposé, schéma DB avec user_roles séparé).

Ce fichier servira de **brief de référence** pour :
- toi quand tu briefes Nolwenn ou un dev
- toute IA (Lovable, Claude, etc.) qui touche au projet, pour ne pas dériver
- onboarder un nouveau contributeur en 5 min

## Ce qui sera fait
1. Création de `BRIEF.md` à la racine, avec le contenu complet du prompt réécrit présenté dans le message précédent.

## Ce qui ne sera PAS touché
- Aucun fichier `src/` modifié
- Aucune dépendance ajoutée/retirée
- Aucun composant, page, route ou style impacté
- Aucune table Supabase créée ou modifiée

## Détails techniques
- Format : Markdown avec bloc de code délimitant le prompt copiable
- Emplacement : `/BRIEF.md` (racine, à côté de `README.md`)
- Encodage : UTF-8 standard
- Aucun import, aucune référence depuis le code applicatif (fichier de doc pur)

## Risque
Nul. Fichier statique de documentation, ne change rien au build ni au runtime.
