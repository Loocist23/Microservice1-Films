# Microservice Films

Microservice 1 du projet "Architecture logicielle" : gestion des genres. Ce service expose une API REST pour créer, lister, modifier et supprimer des genres. Il s'intègre avec :
- Microservice 2 - Comptes (Python / Flask) : https://github.com/Loocist23/LesJeunot-Accounts
- Microservice 3 - Seances (NodeJS / Express) : https://github.com/Koruji/Microservice3-Seance

## Fonctionnalites
- CRUD des genres
- Liste et detail des genres

## Stack technique
- NodeJS (Express)
- Sequelize + MySQL

## Modele de donnees
Genre (table `Genres` par defaut Sequelize)
- id: int, auto increment
- label: string
- timestamps: `createdAt`, `updatedAt`

Contraintes:
- `label` est obligatoire en creation
- `label` ne peut pas etre vide
- `label` max 150 caracteres
- `id` doit etre un entier positif dans les routes `/api/genres/:id`

## API
Base URL : `http://localhost:3000`

Endpoints principaux

| Methode | Route | Description |
| --- | --- | --- |
| GET | `/health` | Check de sante |
| GET | `/api/genres` | Liste des genres |
| GET | `/api/genres/:id` | Detail d'un genre |
| POST | `/api/genres` | Creer un genre |
| PUT | `/api/genres/:id` | Modifier un genre |
| DELETE | `/api/genres/:id` | Supprimer un genre |

Format des reponses (sauf DELETE)
```json
{
  "success": true,
  "data": {}
}
```

Reponse `/health`
```json
{
  "status": "ok"
}
```

Format d'erreur (`details` est optionnel)
```json
{
  "success": false,
  "message": "Message d'erreur",
  "details": []
}
```

Exemples de payloads

Creer un genre
```json
{
  "label": "Action"
}
```

Mettre a jour un genre (partiel)
```json
{
  "label": "Comedie"
}
```

Codes de retour usuels
- 200: succes (GET, PUT)
- 201: creation reussie (POST)
- 204: suppression reussie sans contenu (DELETE, corps vide)
- 400: donnees invalides
- 404: ressource introuvable
- 500: erreur interne

## Etat des autres ressources
Des modeles, validateurs et controleurs existent pour `films` et `age-ratings`, mais ils ne sont pas exposes par `server.js`. Tant que les routes ne sont pas montees, seules `/health` et `/api/genres` sont disponibles.

## Configuration
Variables d'environnement requises
- `DATABASE_URL` (ex: `mysql://user:password@localhost:3306/films_db`)

Variables optionnelles
- `PORT` (defaut: 3000)
- `NODE_ENV` (defaut: development)

Exemple `.env`
```bash
DATABASE_URL=mysql://root:secret@127.0.0.1:3306/films_db
PORT=3000
NODE_ENV=development
```

## Lancer en local
```bash
npm install
npm start
```
