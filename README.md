# Erpium — Site web & présence LinkedIn

Projet complet du site **erpium.ma** (Next.js, export statique pour cPanel) et de
tous les assets **LinkedIn** d'Erpium — filiale Solutions Digitales du groupe
Arboris Management (Casablanca).

Ce fichier est le **point d'entrée** : tout ce qu'il faut pour reprendre le projet
sur n'importe quel PC.

---

## 1. Récupérer le projet sur un autre PC

Le travail vit sur la branche **`claude/erpium-website-research-caxjqu`** (pas sur `main`).

```bash
git clone https://github.com/abdellatifdouma/docker.git
cd docker
git checkout claude/erpium-website-research-caxjqu
```

> **Windows / PowerShell** : si `npm` est bloqué (« exécution de scripts désactivée »),
> lancez une fois : `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
> (répondre O), ou utilisez `npm.cmd` au lieu de `npm`.

Prérequis : **Node.js 18+** (https://nodejs.org).

---

## 2. Structure du dépôt

```
docker/
├─ README.md                     ← ce fichier
├─ erpium-landing.html           ← maquette source (1 seul fichier, tout inclus)
├─ index.html                    ← copie de la maquette (dépannage / aperçu rapide)
├─ erpium-site-cpanel.zip        ← site compilé, prêt à extraire dans public_html
│
├─ web/                          ← PROJET Next.js (source du site)
│  ├─ app/
│  │  ├─ page.tsx / layout.tsx   ← page & métadonnées
│  │  ├─ bodyHtml.ts             ← le HTML de la page (éditer les TEXTES ici)
│  │  ├─ globals.css             ← charte : couleurs, animations (éditer le STYLE ici)
│  │  └─ icon.png                ← favicon
│  ├─ components/Scripts.tsx     ← curseur, apparitions, bascule FR/EN
│  ├─ public/
│  │  ├─ erpium-logo*.png        ← logos (clair / blanc)
│  │  └─ videos/                 ← vidéos démo + posters (mp4/jpg)
│  ├─ next.config.mjs            ← output:'export' (statique)
│  ├─ package.json
│  └─ DEPLOIEMENT-CPANEL.md      ← guide de mise en ligne détaillé
│
└─ linkedin/                     ← PRÉSENCE LINKEDIN
   ├─ KIT-LINKEDIN-ERPIUM.md         ← créer la page : infos, À propos, spécialités, posts
   ├─ PLANNING-EDITORIAL-LINKEDIN.md ← 1 mois de posts (12), datés
   ├─ linkedin-banniere.png          ← bannière 1128×191
   ├─ linkedin-logo.png              ← avatar 300×300
   ├─ demo-*.mp4                     ← vidéos démo (16:9)
   └─ videos-carre/                  ← vidéos LinkedIn carré 1080×1080
      ├─ 1-transport-carre.mp4 … 4-automatisation-carre.mp4
      ├─ cover-*.jpg                 ← vignettes
      └─ PACK-A-PUBLIER.md           ← légendes prêtes à coller
```

---

## 3. Lancer le site en local

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

Pour modifier :
- **les textes** → `web/app/bodyHtml.ts`
- **les couleurs / animations** → `web/app/globals.css`
- **les vidéos / images** → `web/public/videos/`

---

## 4. Mettre le site en ligne (cPanel)

Le site est un **export statique** : aucun Node.js requis sur le serveur.

```bash
cd web
npm run build        # génère le dossier ./out
```

Puis, dans cPanel → **Gestionnaire de fichiers → `public_html`** :
1. Supprimez l'ancien dossier `_next` (les noms de fichiers changent à chaque build).
2. Téléversez `erpium-site-cpanel.zip` (ou tout le contenu de `web/out/`).
3. **Extraire** → les fichiers se placent à la racine de `public_html`.
4. Videz le cache navigateur (Ctrl+F5) → https://erpium.ma

> Détails, HTTPS et .htaccess : voir **`web/DEPLOIEMENT-CPANEL.md`**.

> ⚠️ `erpium-site-cpanel.zip` est déjà à jour dans le dépôt : si vous ne modifiez rien,
> vous pouvez le téléverser tel quel sans rebuild.

---

## 5. LinkedIn

Tout est dans **`linkedin/`** :
1. **Créer la page** → suivez `linkedin/KIT-LINKEDIN-ERPIUM.md` (infos, À propos, spécialités).
2. **Visuels** → `linkedin-banniere.png` (couverture) + `linkedin-logo.png` (avatar).
3. **Publier les vidéos** → dossier `videos-carre/`, légendes dans `PACK-A-PUBLIER.md`
   (1 vidéo/semaine, upload natif, format carré optimisé mobile).
4. **Planning du mois** → `linkedin/PLANNING-EDITORIAL-LINKEDIN.md` (12 posts datés).

---

## 6. Enregistrer ses modifications

```bash
git add -A
git commit -m "Votre message"
git push origin claude/erpium-website-research-caxjqu
```

---

## Contacts & identité

- **Site** : https://erpium.ma
- **Positionnement** : ERP · développement web & mobile · agents IA téléphoniques (FR + darija) · automatisation
- **Groupe** : Arboris Management (filiales : CreativX, BMM Connect, Talensia)
- **Couleurs** : navy `#00073F` · bleu `#0043FF` · vert Arboris `#58AA48`
- **Siège** : Casablanca, Maroc
