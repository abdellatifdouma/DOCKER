# TA BURO — Site vitrine

Refonte du site [ta-buro.ma](https://ta-buro.ma/) avec un design **élégant et corporate**,
conservant les deux branches d'activité et la vidéo en page d'accueil. Le contenu reste
identique à l'original ; seul le design a été repensé.

## Aperçu

Site statique, sans dépendance de build. Ouvrez simplement `index.html` dans un navigateur,
ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

```
.
├── index.html          # Page unique (hero vidéo + 2 pôles + contact)
├── css/styles.css      # Design system (bleu nuit · or · vert forêt · ivoire)
├── js/main.js          # Nav mobile, effets de scroll, révélations
└── assets/
    ├── hero-poster.svg # Image de repli élégante affichée sous la vidéo
    ├── favicon.svg
    └── hero.mp4        # ← À AJOUTER : votre vidéo de fond (voir ci-dessous)
```

## Vidéo de la page d'accueil

Le hero utilise une balise `<video>` en arrière-plan. Déposez votre vidéo ici :

- `assets/hero.mp4` (format recommandé, largement compatible)
- `assets/hero.webm` (optionnel, meilleure compression)

Tant qu'aucun fichier n'est présent, une image de repli animée (`hero-poster.svg`)
s'affiche automatiquement — la page reste donc élégante et fonctionnelle.

> Conseil : une vidéo courte (10–20 s), muette, en boucle, de 1920×1080, poids < 8 Mo.

## Les deux pôles d'activité

1. **Mobilier & Équipement de bureau** — import et distribution : bureaux, rangements,
   fauteuils, armoires, mobilier scolaire, tables de réunion, aménagement d'espaces.
2. **Environnement & Recyclage** — accompagnement de projets de traitement et de recyclage
   de tous types de déchets.

## Contact (TA BURO)

- 521 Bd Brahim Roudani (ex route El Jadida), Batha — Casablanca
- Tél : 05 22 99 70 80
