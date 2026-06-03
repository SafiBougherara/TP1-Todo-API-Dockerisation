# Todo API — Node.js + PostgreSQL + Docker

API REST de gestion de tâches, dockerisée avec Node.js 18 et PostgreSQL 15.

## Stack

- **Runtime** : Node.js 18 (alpine)
- **Framework** : Express 4
- **Base de données** : PostgreSQL 15
- **Conteneurisation** : Docker

---

## Lancer le projet

### 1. Pré-requis

- [Docker Desktop](https://www.docker.com/get-started) installé et lancé
- Node.js 18+ (pour le développement local)

### 2. Variables d'environnement

```bash
cp .env.example .env
```

Le `.env` par défaut est déjà configuré pour fonctionner avec le container Postgres ci-dessous.

### 3. Lancer PostgreSQL via Docker

```bash
docker run -d \
  --name todo-postgres \
  -e POSTGRES_DB=todo_db \
  -e POSTGRES_USER=todo_user \
  -e POSTGRES_PASSWORD=todo_pass \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4. Lancer l'API en local

```bash
npm install
npm start
```

L'API est disponible sur **http://localhost:3000**

---

## Construire et lancer avec Docker

```bash
# Build de l'image
docker build -t todo-api .

# Lancer le container (en supposant que Postgres tourne déjà)
docker run -p 3000:3000 \
  --env-file .env \
  -e DB_HOST=host.docker.internal \
  todo-api
```

---

## Endpoints de l'API

| Méthode | Route              | Description              |
|---------|--------------------|--------------------------|
| GET     | `/health`          | Health check             |
| GET     | `/api/tasks`       | Lister toutes les tâches |
| GET     | `/api/tasks/:id`   | Voir une tâche           |
| POST    | `/api/tasks`       | Créer une tâche          |
| PUT     | `/api/tasks/:id`   | Modifier une tâche       |
| DELETE  | `/api/tasks/:id`   | Supprimer une tâche      |

## Modèle de données — Task

```json
{
  "id": 1,
  "title": "Ma tâche",
  "description": "Description de la tâche",
  "status": "todo",
  "created_at": "2026-06-03T10:00:00.000Z",
  "updated_at": "2026-06-03T10:00:00.000Z"
}
```

**Statuts possibles** : `todo` | `in_progress` | `done`

---

## Exemples de requêtes

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Ma première tâche", "description": "Description", "status": "todo"}'

# Lister toutes les tâches
curl http://localhost:3000/api/tasks

# Modifier le statut d'une tâche
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Supprimer une tâche
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Commandes Docker utiles

```bash
docker ps                          # Voir les containers actifs
docker stop todo-postgres          # Stopper Postgres
docker rm todo-postgres            # Supprimer le container
docker images                      # Voir les images
```
