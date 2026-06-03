# Todo API — Node.js + PostgreSQL + Docker

API REST de gestion de tâches, dockerisée avec Node.js 18 et PostgreSQL 15.

## Stack

- **Runtime** : Node.js 18 (alpine)
- **Framework** : Express 4
- **Base de données** : PostgreSQL 15
- **Conteneurisation** : Docker + Docker Compose

---

## Lancer le projet

### Méthode recommandée — Docker Compose ⭐

Lance toute la stack (API + PostgreSQL) en une seule commande :

```bash
# 1. Créer le volume external requis (une seule fois)
docker volume create todo-logs

# 2. Lancer la stack complète en arrière-plan
docker compose up -d
```

L'API est disponible sur **http://localhost:3000**

**Commandes principales :**

```bash
docker compose up -d       # Lancer tous les services (détaché)
docker compose down        # Stopper et supprimer les containers
docker compose build       # Rebuilder l'image API après modif du code
docker compose logs -f api # Suivre les logs en temps réel
```

---

### Méthode alternative — En local (sans compose)

```bash
# 1. Variables d'environnement
cp .env.example .env

# 2. Lancer PostgreSQL seul
docker run -d \
  --name todo-postgres \
  -e POSTGRES_DB=todo_db \
  -e POSTGRES_USER=todo_user \
  -e POSTGRES_PASSWORD=todo_pass \
  -p 5432:5432 \
  postgres:15-alpine

# 3. Lancer l'API Node.js
npm install
npm start
```

---

## Volumes et persistance

La stack utilise deux **volumes nommés** gérés par Docker :

| Volume | Rôle |
|---|---|
| `postgres-data` | Données PostgreSQL — persistent après `docker compose down` |
| `api-logs` | Logs de l'API — persistent après redémarrage |
| `todo-logs` | Volume external partagé entre containers (exercice volumes) |

### Tester la persistance

```bash
# 1. Lancer la stack et créer une tâche
docker compose up -d
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Tâche persistante","status":"todo"}'

# 2. Stopper TOUT (containers supprimés, volumes conservés)
docker compose down

# 3. Relancer
docker compose up -d

# 4. Vérifier que les données sont toujours là 😈
curl http://localhost:3000/api/tasks
```

> ⚠️ `docker compose down -v` supprime aussi les volumes — les données sont perdues.

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

## Tester l'API

Un fichier [`requests.http`](./requests.http) est disponible à la racine du projet.
Il contient toutes les requêtes prêtes à l'emploi pour l'extension **REST Client** de VS Code.

> Installe l'extension **REST Client** dans VS Code, ouvre `requests.http` et clique sur `Send Request` au-dessus de chaque requête.

### Exemples de requêtes (curl)

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
docker compose ps                  # Voir les services du compose
docker volume ls                   # Lister les volumes
docker volume inspect postgres-data # Inspecter un volume
docker images                      # Voir les images
```


<img width="740" height="157" alt="{F572EF56-3EFD-47D2-A8EA-0353DD56F292}" src="https://github.com/user-attachments/assets/b5cdc9f7-53b1-4c4d-bcc4-95450f5d01bb" />

<img width="1081" height="697" alt="{3B262EEC-E108-4967-8808-9CCEBEF69974}" src="https://github.com/user-attachments/assets/eefa35ea-fdd1-4d0b-bd13-268865c73ae6" />

<img width="1114" height="520" alt="{BDFC6BC7-5AD6-4C73-B52B-295424E281BB}" src="https://github.com/user-attachments/assets/bea8cc0b-4ebe-4800-9b8f-18554d1c4d12" />

<img width="1120" height="752" alt="{B4542457-FFD8-470D-8C6F-FEF63F396014}" src="https://github.com/user-attachments/assets/003763c7-3606-47e0-914b-1c25bc7db35b" />
