# Documentation des routes API

Cette application Express expose uniquement des routes JSON et suppose une base URL locale de la forme `http://localhost:<PORT>` (valeur definie dans `app/config/env.js`). Les requetes doivent utiliser l'en-tete `Content-Type: application/json` lorsqu'elles transmettent un corps. Les reponses reussies suivent le schema `{ "success": true, "data": ... }`, tandis que les erreurs de validation retournent un statut `400` et une reponse `{ "success": false, "message": "...", "details": [...] }`. Les ressources inexistantes renvoient `404`.

- Authentification: aucune
- Encodage: UTF-8
- CORS: actif par defaut via `app/middlewares/cors`

## Route de sante

### GET `/health`

| Etat | Description |
| --- | --- |
| 200 | L'API demarre et la base est initialisee. |

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok"
}
```

## Ressource Genre (`/api/genres`)

### Modele

| Champ | Type | Obligatoire | Details |
| --- | --- | --- | --- |
| `label` | string | oui | Texte non vide <= 150 caracteres. |

### GET `/api/genres`

Retourne la liste des genres tries par label croissant.

```bash
curl http://localhost:3000/api/genres
```

```json
{
  "success": true,
  "data": [
    { "id": 1, "label": "Animation" },
    { "id": 2, "label": "Drame" }
  ]
}
```

### GET `/api/genres/:id`

Recupere un genre precise identifie par un entier strictement positif. Retourne `404` si introuvable.

```bash
curl http://localhost:3000/api/genres/1
```

### POST `/api/genres`

Creer un genre.

```bash
curl -X POST http://localhost:3000/api/genres \
  -H "Content-Type: application/json" \
  -d '{ "label": "Science-fiction" }'
```

Reponse `201 Created`:

```json
{
  "success": true,
  "data": { "id": 5, "label": "Science-fiction" }
}
```

### PUT `/api/genres/:id`

Met a jour un genre. Le corps peut inclure seulement les champs modifies; toutefois au moins un champ valide est requis, sinon `400`.

```bash
curl -X PUT http://localhost:3000/api/genres/5 \
  -H "Content-Type: application/json" \
  -d '{ "label": "Sci-Fi" }'
```

### DELETE `/api/genres/:id`

Supprime un genre. Reponse `204` sans corps.

```bash
curl -X DELETE http://localhost:3000/api/genres/5
```

## Ressource Age Rating (`/api/age-ratings`)

### Modele

| Champ | Type | Obligatoire | Details |
| --- | --- | --- | --- |
| `value` | integer | oui | Entier positif representant la classification (ex: 0, 10, 16). |

### GET `/api/age-ratings`

Liste toutes les classifications ordonnees par valeur croissante.

```bash
curl http://localhost:3000/api/age-ratings
```

### GET `/api/age-ratings/:id`

Retourne une classification precise. `:id` doit etre un entier strictement positif.

```bash
curl http://localhost:3000/api/age-ratings/2
```

### POST `/api/age-ratings`

Ajoute une classification.

```bash
curl -X POST http://localhost:3000/api/age-ratings \
  -H "Content-Type: application/json" \
  -d '{ "value": 13 }'
```

Reponse `201 Created`:

```json
{
  "success": true,
  "data": { "id": 4, "value": 13 }
}
```

### PUT `/api/age-ratings/:id`

Met a jour une classification. Au moins un champ valide est requis.

```bash
curl -X PUT http://localhost:3000/api/age-ratings/4 \
  -H "Content-Type: application/json" \
  -d '{ "value": 12 }'
```

### DELETE `/api/age-ratings/:id`

Supprime la classification cible. Reponse `204`.

```bash
curl -X DELETE http://localhost:3000/api/age-ratings/4
```

## Ressource Film (`/api/films`)

### Modele d'entree

| Champ | Type | Obligatoire | Details |
| --- | --- | --- | --- |
| `name` | string | oui | Nom non vide <= 255 caracteres. |
| `synopsis` | string | non | Texte <= 2000 caracteres. |
| `author` | string | oui | Auteur non vide <= 255 caracteres. |
| `ageRatingId` | integer | oui | Identifiant existant dans `age_rating`. |
| `genreIds` | integer[] | non (defaut: `[]`) | Tableau d'identifiants de genres existants, sans doublons. |

### Representation de sortie

Chaque film retourne aussi les objets associes:

```json
{
  "id": 1,
  "name": "Le Voyageur",
  "synopsis": "Synopsis optionnel",
  "author": "Jane Doe",
  "ageRatingId": 3,
  "ageRating": { "id": 3, "value": 13 },
  "genres": [
    { "id": 2, "label": "Drame" },
    { "id": 4, "label": "Aventure" }
  ]
}
```

### GET `/api/films`

Retourne tous les films tries par nom croissant, incluant `genres` et `ageRating`.

```bash
curl http://localhost:3000/api/films
```

### GET `/api/films/:id`

Identique a la liste mais limite a un film. Validation sur `:id` (entier > 0) et reponse `404` si introuvable.

### POST `/api/films`

Creer un film. `genreIds` peut etre vide ou absent; lorsqu'il est fourni, tous les genres doivent exister sinon `400`. `ageRatingId` doit egalement correspondre a une entree valide.

```bash
curl -X POST http://localhost:3000/api/films \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Le Voyageur",
    "synopsis": "Synopsis optionnel",
    "author": "Jane Doe",
    "ageRatingId": 3,
    "genreIds": [2, 4]
  }'
```

Reponse `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "Le Voyageur",
    "synopsis": "Synopsis optionnel",
    "author": "Jane Doe",
    "ageRatingId": 3,
    "ageRating": { "id": 3, "value": 13 },
    "genres": [
      { "id": 2, "label": "Drame" },
      { "id": 4, "label": "Aventure" }
    ]
  }
}
```

### PUT `/api/films/:id`

Met a jour partiellement ou totalement un film. Au moins un champ valide ou `genreIds` doit etre present. Pour modifier les genres, fournir `genreIds` complet (les anciens liens sont remplaces par ceux fournis).

```bash
curl -X PUT http://localhost:3000/api/films/7 \
  -H "Content-Type: application/json" \
  -d '{ "author": "John Smith", "genreIds": [1, 2] }'
```

### DELETE `/api/films/:id`

Supprime un film et renvoie `204` sans corps.

```bash
curl -X DELETE http://localhost:3000/api/films/7
```

## Reponses d'erreur courantes

- `400 Bad Request`: identifiant invalide, corps mal forme, champs manquants, genres ou ageRating inexistants.
- `404 Not Found`: ressource non trouvee pour l'identifiant fourni.
- `500 Internal Server Error`: erreurs non interceptees (journalisees par `app/middlewares/errorHandler`).

Chaque erreur standardise le format suivant:

```json
{
  "success": false,
  "message": "La validation des donnees a echoue.",
  "details": [
    "Le champ \"name\" est obligatoire.",
    "Chaque valeur de \"genreIds\" doit etre un identifiant valide."
  ]
}
```
