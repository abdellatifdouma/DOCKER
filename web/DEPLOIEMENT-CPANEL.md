# Déploiement d'erpium.ma sur cPanel

Ce projet est un site **Next.js en export statique** : `npm run build` génère un
dossier `out/` contenant du HTML/CSS/JS purs. **Aucun Node.js n'est requis sur le
serveur** — vous déposez simplement le contenu de `out/` dans `public_html`.

## Option A — Téléverser l'archive (le plus simple)

1. Récupérez le fichier **`erpium-site-cpanel.zip`** (fourni à part).
2. cPanel → **Gestionnaire de fichiers** → ouvrez **`public_html`**.
3. *(Recommandé)* Supprimez l'ancien `index.html` par défaut s'il existe.
4. Cliquez **Téléverser** et envoyez `erpium-site-cpanel.zip`.
5. De retour dans `public_html`, sélectionnez le zip → **Extraire**.
   > L'archive contient déjà les fichiers **à la racine** (index.html, _next/, images…),
   > donc ils atterrissent directement dans `public_html` — pas de sous-dossier.
6. Supprimez le zip. Visitez **https://erpium.ma** ✅

## Option B — Reconstruire vous-même puis téléverser

Sur votre machine (Node 18+ installé) :

```bash
cd web
npm install
npm run build      # génère ./out
```

Puis téléversez **le contenu** de `web/out/` dans `public_html` (tous les fichiers,
y compris le dossier caché `_next/`).

## Fichier .htaccess (recommandé)

Pour forcer le HTTPS et de belles pages 404, créez `public_html/.htaccess` :

```apache
# HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Page 404
ErrorDocument 404 /404.html
```

## Notes importantes

- Le site est servi **à la racine du domaine** (`public_html` = `erpium.ma/`).
  Les chemins sont absolus (`/_next/…`), donc **ne l'installez pas dans un sous-dossier**
  sans adapter `basePath` dans `next.config.mjs`.
- SSL : activez **AutoSSL** (Let's Encrypt) dans cPanel si ce n'est pas déjà fait.
- Le formulaire de contact pointe actuellement vers `mailto:contact@erpium.ma` et
  le téléphone `+212 5 22 93 94 07`. Pour un vrai formulaire, on peut ajouter un
  petit script PHP (cPanel gère PHP) ou brancher n8n — dites-le-moi.

## Structure du projet

```
web/
├─ app/
│  ├─ layout.tsx      # <html>, métadonnées SEO, favicon
│  ├─ page.tsx        # rend le contenu de la page
│  ├─ bodyHtml.ts     # le HTML de la page (facile à éditer)
│  ├─ globals.css     # toute la charte (couleurs, animations motion-design)
│  └─ icon.png        # favicon (logo Erpium)
├─ components/
│  └─ Scripts.tsx     # curseur, apparitions au scroll, bascule FR/EN
├─ public/            # logos (variantes claire/sombre)
├─ next.config.mjs    # output:'export' (statique)
└─ package.json
```

Pour modifier un texte : éditez `app/bodyHtml.ts`. Pour les couleurs/animations :
`app/globals.css`. Puis `npm run build` et re-téléversez `out/`.
