# Procédure de déploiement - Todo API

## 1. Prérequis
- Accès au cluster K3S (fichier kubeconfig dans `~/.kube/config`)
- Variables CI/CD configurées dans GitLab : `DOCKERHUB_USER`, `DOCKERHUB_TOKEN`, `KUBE_CONFIG`
- Branche `main` à jour et tests verts en local

## 2. Déploiement (nominal)
1. Merger la branche de feature dans `main` via merge request (après review)
2. Le merge déclenche la pipeline automatiquement
3. Suivre la pipeline : GitLab > CI/CD > Pipelines
4. Stages attendus : lint > test > build > push > deploy, tous verts

## 3. Vérification
- `kubectl get pods` : tous les pods en Running
- `kubectl rollout status deployment/todo-api` : rollout complete
- `curl http://<adresse>/health` : doit répondre `{"status":"ok"}`
- Dashboard Grafana : pas de pic d'erreurs

## 4. Rollback (si le déploiement casse)
Prérequis : kubeconfig dans `~/.kube/config` (sinon : demander à [contact]).
1. `kubectl rollout undo deployment/todo-api` : revient à la version précédente
2. `kubectl rollout status deployment/todo-api` : attendre "successfully rolled out"
3. `kubectl get pods` : tous Running
4. `curl http://<adresse>/health` : doit répondre `{"status":"ok"}`
5. Prévenir `#incidents`

## 5. Contacts
- Responsable déploiement : [Nom] - [Contact]
- Astreinte : [Nom] - [Contact]
