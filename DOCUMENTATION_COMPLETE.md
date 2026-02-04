# Documentation Complète - Microservice1-Films

## Introduction

Le projet **Microservice1-Films** est un service API REST développé en Node.js pour la gestion des films, genres et classifications d'âge. Ce microservice fait partie d'une architecture plus large composée de trois microservices.

## Architecture Globale

Le projet s'intègre dans un écosystème de microservices :

1. **Microservice1-Films** (Node.js/Express) - Gestion des films, genres et classifications d'âge
2. Microservice2-Comptes (Python/Flask) - Gestion des comptes utilisateurs
3. Microservice3-Seances (NodeJS/Express) - Gestion des séances

## Stack Technique

### Technologies Principales

- **Backend**: Node.js v18+ avec Express 5.x
- **Base de données**: MySQL 5.7+ avec Sequelize 6.x (ORM)
- **Gestion des variables**: dotenv 17.x
- **Gestion des erreurs**: Middleware personnalisé

### Choix Technologiques

**Node.js/Express** :
- Performant pour les API REST
- Large écosystème de modules
- Facilité de développement et de déploiement

**Sequelize** :
- ORM mature pour Node.js
- Gestion native des relations complexes
- Support des migrations et des transactions
- Compatible avec plusieurs bases de données

**MySQL** :
- Base de données relationnelle adaptée aux données structurées
- Performances élevées pour les lectures/écritures
- Large support dans l'industrie

## Structure du Projet

```
app/
├── config/          # Configuration de l'application
├── controllers/     # Logique métier et gestion des requêtes
├── database/        # Configuration de la base de données
├── errors/          # Gestion des erreurs personnalisées
├── middlewares/     # Middlewares Express
├── models/          # Modèles de données et associations
├── routes/          # Définition des routes API
├── utils/           # Utilitaires
└── validators/      # Validation des données
```

## Fonctionnalités Implémentées

### 1. Gestion des Genres

**Fonctionnalités** :
- CRUD complet (Création, Lecture, Mise à jour, Suppression)
- Tri par ordre alphabétique
- Validation des données

**Validation** :
- `label` : obligatoire, non vide, ≤ 150 caractères
- Nettoyage automatique des espaces superflus

**Endpoints** :
```
GET    /api/genres        - Liste tous les genres
GET    /api/genres/:id    - Détail d'un genre
POST   /api/genres        - Création d'un genre
PUT    /api/genres/:id    - Mise à jour d'un genre
DELETE /api/genres/:id    - Suppression d'un genre
```

### 2. Gestion des Films

**Fonctionnalités** :
- CRUD complet avec gestion des relations
- Récupération des films avec leurs genres et classifications
- Validation complète des données

**Validation** :
- Champs obligatoires : `name`, `author`, `ageRatingId`
- Champs optionnels : `synopsis` (≤ 2000 caractères)
- Relations : `genreIds` (tableau d'identifiants valides)

**Endpoints** :
```
GET    /api/films        - Liste tous les films avec relations
GET    /api/films/:id    - Détail d'un film avec relations
POST   /api/films        - Création d'un film
PUT    /api/films/:id    - Mise à jour d'un film
DELETE /api/films/:id    - Suppression d'un film
```

### 3. Gestion des Classifications d'Âge

**Fonctionnalités** :
- CRUD complet similaire aux genres
- Tri par valeur numérique
- Validation des données

**Validation** :
- `value` : obligatoire, entier positif

**Endpoints** :
```
GET    /api/age-ratings        - Liste toutes les classifications
GET    /api/age-ratings/:id    - Détail d'une classification
POST   /api/age-ratings        - Création d'une classification
PUT    /api/age-ratings/:id    - Mise à jour d'une classification
DELETE /api/age-ratings/:id    - Suppression d'une classification
```

## Modèle de Données

### Schéma de la Base de Données

#### Table `genres`
```
- id (INT, PK, AI)
- label (STRING, NOT NULL)
- created_at (DATETIME)
- modified_at (DATETIME)
```

#### Table `films`
```
- id (INT, PK, AI)
- name (STRING, NOT NULL)
- synopsis (TEXT)
- author (STRING, NOT NULL)
- age_rating_id (INT, FK → age_rating.id)
- created_at (DATETIME)
- modified_at (DATETIME)
```

#### Table `age_rating`
```
- id (INT, PK, AI)
- value (INT, NOT NULL)
- created_at (DATETIME)
- modified_at (DATETIME)
```

#### Table de jointure `film_genres`
```
- film_id (INT, FK → films.id)
- genre_id (INT, FK → genres.id)
- created_at (DATETIME)
- modified_at (DATETIME)
```

### Associations Sequelize

```javascript
// Film → AgeRating (Many-to-One)
Film.belongsTo(AgeRating, { as: 'ageRating', foreignKey: 'ageRatingId' })
AgeRating.hasMany(Film, { as: 'films', foreignKey: 'ageRatingId' })

// Film ↔ Genre (Many-to-Many)
Film.belongsToMany(Genre, {
    as: 'genres',
    through: 'film_genres',
    foreignKey: 'filmId',
    otherKey: 'genreId'
})

Genre.belongsToMany(Film, {
    as: 'films',
    through: 'film_genres',
    foreignKey: 'genreId',
    otherKey: 'filmId'
})
```

## Gestion des Erreurs

### Classes d'Erreurs Personnalisées

```javascript
// Structure de base
class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message)
        this.statusCode = statusCode
        this.details = details
    }
}

// Erreurs spécifiques
class BadRequestError extends HttpError { /* 400 */ }
class NotFoundError extends HttpError { /* 404 */ }
```

### Middleware de Gestion des Erreurs

```javascript
// Format de réponse d'erreur
{
    "success": false,
    "message": "Message d'erreur",
    "details": ["Détails optionnels"]
}

// Codes HTTP utilisés
- 200: Succès (GET, PUT)
- 201: Création réussie (POST)
- 204: Suppression réussie (DELETE)
- 400: Données invalides
- 404: Ressource introuvable
- 500: Erreur interne
```

## Validation des Données

### Validateur de Genre

```javascript
// Règles de validation
- label: obligatoire, non vide, ≤ 150 caractères
- Nettoyage des espaces superflus
```

### Validateur de Film

```javascript
// Règles de validation
- name: obligatoire, non vide, ≤ 255 caractères
- synopsis: optionnel, ≤ 2000 caractères
- author: obligatoire, non vide, ≤ 255 caractères
- ageRatingId: obligatoire, entier positif
- genreIds: optionnel, tableau d'entiers positifs
```

### Validateur de Classification d'Âge

```javascript
// Règles de validation
- value: obligatoire, entier positif
```

## Middlewares

### CORS
Gère les en-têtes CORS pour permettre les requêtes cross-origin :
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### Not Found
Gère les routes non trouvées avec un message clair.

### Error Handler
Gère toutes les erreurs de manière centralisée avec des réponses JSON structurées.

### Async Handler
Utilitaire pour gérer les erreurs dans les routes asynchrones.

## Configuration

### Variables d'Environnement

**Requises** :
- `DATABASE_URL` - URL de connexion MySQL (ex: `mysql://user:password@localhost:3306/films_db`)

**Optionnelles** :
- `PORT` - Port du serveur (défaut : 3000)
- `NODE_ENV` - Environnement (défaut : development)

### Exemple de fichier `.env`

```bash
DATABASE_URL=mysql://root:secret@127.0.0.1:3306/films_db
PORT=3000
NODE_ENV=development
```

## Bonnes Pratiques Implémentées

1. **Séparation des préoccupations** : Architecture MVC bien respectée
2. **Validation robuste** : Validation complète avant traitement
3. **Gestion des erreurs** : Système personnalisé et structuré
4. **Documentation** : README complet avec exemples
5. **Conventions de nommage** : Cohérentes et claires
6. **Gestion des relations** : Associations Sequelize bien implémentées
7. **Sécurité** : Désactivation de X-Powered-By, validation des entrées

## Exemples de Requêtes

### Création d'un Genre

**Requête** :
```bash
POST /api/genres
Content-Type: application/json

{
    "label": "Science-Fiction"
}
```

**Réponse** :
```json
{
    "success": true,
    "data": {
        "id": 1,
        "label": "Science-Fiction",
        "created_at": "2023-01-01T00:00:00.000Z",
        "modified_at": "2023-01-01T00:00:00.000Z"
    }
}
```

### Création d'un Film avec Relations

**Requête** :
```bash
POST /api/films
Content-Type: application/json

{
    "name": "Inception",
    "synopsis": "Un voleur qui s'infiltre dans les rêves...",
    "author": "Christopher Nolan",
    "ageRatingId": 1,
    "genreIds": [1, 2, 3]
}
```

**Réponse** :
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Inception",
        "synopsis": "Un voleur qui s'infiltre dans les rêves...",
        "author": "Christopher Nolan",
        "age_rating_id": 1,
        "created_at": "2023-01-01T00:00:00.000Z",
        "modified_at": "2023-01-01T00:00:00.000Z",
        "ageRating": {
            "id": 1,
            "value": 12,
            "created_at": "2023-01-01T00:00:00.000Z",
            "modified_at": "2023-01-01T00:00:00.000Z"
        },
        "genres": [
            {
                "id": 1,
                "label": "Science-Fiction",
                "created_at": "2023-01-01T00:00:00.000Z",
                "modified_at": "2023-01-01T00:00:00.000Z"
            },
            {
                "id": 2,
                "label": "Action",
                "created_at": "2023-01-01T00:00:00.000Z",
                "modified_at": "2023-01-01T00:00:00.000Z"
            },
            {
                "id": 3,
                "label": "Thriller",
                "created_at": "2023-01-01T00:00:00.000Z",
                "modified_at": "2023-01-01T00:00:00.000Z"
            }
        ]
    }
}
```

## Améliorations Possibles

1. **Tests** : Ajout de tests unitaires (Jest/Mocha) et d'intégration
2. **Pagination** : Implémentation de la pagination pour les listes
3. **Filtrage** : Ajout de capacités de filtrage avancé
4. **Authentication** : Ajout d'un système d'authentification (JWT/OAuth)
5. **Documentation API** : Utilisation d'OpenAPI/Swagger
6. **Logging** : Système de logging plus sophistiqué (Winston/Morgan)
7. **Metrics** : Ajout de métriques pour le monitoring (Prometheus)
8. **Cache** : Implémentation de caching (Redis)
9. **Rate Limiting** : Protection contre les abus
10. **Health Checks** : Endpoints de santé plus complets

## Conclusion

Le projet **Microservice1-Films** est une implémentation solide et bien structurée d'une API REST pour la gestion des films et des données associées. L'architecture MVC est bien respectée, la validation des données est robuste, et la gestion des erreurs est complète. Le projet utilise efficacement Sequelize pour gérer les relations complexes entre les entités et suit les bonnes pratiques de développement Node.js.

Ce microservice est prêt à être intégré dans une architecture plus large et peut servir de base pour des fonctionnalités supplémentaires dans le domaine de la gestion cinématographique.