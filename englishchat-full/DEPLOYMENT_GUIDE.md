# 🚀 EnglishChat Deployment Guide

**Option 1 (Recommandée) : Déploiement Entièrement Automatisé**

## Étape 1 : Preparer le Repo GitHub

```bash
# Clone le repo vide que tu as créé
git clone https://github.com/Englishchat-ANEM/englishchat.git
cd englishchat

# Ajoute tout le code généré
git add .
git commit -m "Initial commit: EnglishChat full stack"
git push origin main
```

---

## Étape 2 : Déployer le Frontend sur Vercel

### 2.1 Créer le Vercel Project

1. Va sur https://vercel.com
2. Log in avec ton GitHub account
3. Clique "Add New..." → "Project"
4. Sélectionne ton repo `englishchat`
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: `./frontend`

### 2.2 Ajouter les Variables d'Environnement

Dans le Vercel project settings:

```
VITE_API_URL = https://englishchat-backend.railway.app/api
VITE_SOCKET_URL = https://englishchat-backend.railway.app
VITE_JITSI_URL = https://meet.jit.si
```

### 2.3 Déployer

Clique "Deploy" → Attends 2-3 min → ✅ Frontend live!

**Frontend URL** : https://englishchat.vercel.app (ou ton custom domain)

---

## Étape 3 : Déployer le Backend sur Railway

### 3.1 Créer le Railway Project

1. Va sur https://railway.app
2. Log in avec ton GitHub account
3. Clique "New Project"
4. Sélectionne "Deploy from GitHub repo"
5. Choisis le repo `englishchat`
6. Sélectionne le **root directory** : `./backend`

### 3.2 Ajouter PostgreSQL

1. Dans Railway, clique "Add Service" → "PostgreSQL"
2. Attends que PostgreSQL soit créé (~1 min)
3. Railway crée automatiquement les variables d'environnement

### 3.3 Configurer les Variables Backend

Dans Railway project, va à "Variables" et ajoute:

```
NODE_ENV = production
PORT = 3000
JWT_SECRET = genere_une_cle_longue_et_complexe_ici_min_32_chars
FRONTEND_URL = https://englishchat.vercel.app
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = ton_email@gmail.com
SMTP_PASS = ton_app_password
```

**Important** : Railway va automatiquement créer `DATABASE_URL` - tu n'as rien à faire!

### 3.4 Déployer

1. Clique "Deploy"
2. Attends que les builds finissent (~5-10 min)
3. ✅ Backend live!

**Backend URL** : https://englishchat-backend.railway.app

---

## Étape 4 : Initialiser la Base de Données

### Option A : Via Railway Console

```bash
# Dans Railway, va à "Database" → PostgreSQL
# Clique sur l'onglet "CLI"
# Copie/colle le contenu de database/schema.sql
# Exécute
```

### Option B : Via SSH (Advanced)

```bash
# Railway te fournit un SSH command
# Copie-le et exécute dans ton terminal

# Une fois connecté :
psql << EOF
[contenu complet de database/schema.sql]
EOF
```

---

## Étape 5 : Acheter un Domain (Optionnel)

### 5.1 Acheter le Domain

1. Va sur https://namecheap.com ou https://godaddy.com
2. Cherche `englishchat.app` ou `englishchat.ma`
3. Achète pour 1 an (~$10-15)
4. Note les nameservers

### 5.2 Configurer Vercel

1. Vercel project settings → "Domains"
2. Ajoute ton domain
3. Vercel te donne les nameservers à configurer
4. Va sur Namecheap/GoDaddy et mets à jour les nameservers
5. Attends ~24h pour la propagation DNS
6. ✅ Frontend sur ton domain!

### 5.3 Configurer Railway (Backend)

1. Railway project → "Settings" → "Custom Domain"
2. Ajoute un subdomain: `api.englishchat.app`
3. Railway fournit un SSL certificat automatiquement
4. ✅ Backend sur ton domain!

---

## Étape 6 : Mettre à Jour les URLs

Une fois les domains configurés, updates les variables:

**Frontend (Vercel)**:
```
VITE_API_URL = https://api.englishchat.app/api
VITE_SOCKET_URL = https://api.englishchat.app
```

**Backend (Railway)**:
```
FRONTEND_URL = https://englishchat.app
```

---

## ✅ Test Final

1. Va sur https://englishchat.app (ou vercel URL)
2. Clique "S'inscrire"
3. Remplis le formulaire
4. Si tu vois le dashboard = ✅ APP LIVE!

---

## 🛠️ Troubleshooting

### Frontend ne charge pas

**Cause**: Variables d'environnement manquantes
**Solution**: 
- Vercel → Project → Settings → Environment Variables
- Ajoute `VITE_API_URL` et `VITE_SOCKET_URL`
- Redéploie

### Backend retourne 503

**Cause**: Base de données non initialisée
**Solution**:
- Exécute le schema.sql dans Railway PostgreSQL console
- Ou redéploie le backend

### CORS error

**Cause**: `FRONTEND_URL` incorrect sur backend
**Solution**:
- Railway → Variables
- Change `FRONTEND_URL` à ton URL frontend correcte
- Redéploie

### Appels WebRTC ne marchent pas

**Cause**: Firewall ou SSL issues
**Solution**:
- Assure-toi que HTTPS est configuré
- Jitsi is external, devrait marcher si API répond

---

## 📊 Monitoring

### Vercel
- Aller sur Vercel Dashboard
- Vois "Deployments", "Logs", "Analytics"

### Railway
- Aller sur Railway Dashboard
- Vois "Logs", "Metrics", "Database"

---

## 🔄 Redéploiement

Après des changements de code:

```bash
# Push vers GitHub
git add .
git commit -m "feature: description"
git push origin main

# Vercel redéploie automatiquement
# Railway redéploie automatiquement (si connecté à GitHub)
```

---

## 💰 Coûts Finaux

- **Vercel (Frontend)** : Gratuit (100k pageviews/month)
- **Railway (Backend + Database)** : $5/month avec $5 crédit gratuit 1er mois
- **Domain** : ~$10-15/an
- **Total** : ~$50/an ou ~$5/mois après crédit gratuit

---

## 🎉 Félicitations!

Ton app EnglishChat est maintenant live pour les 1,500+ membres ANEM!

**Frontend** : https://englishchat.app  
**Backend** : https://api.englishchat.app  
**Admin Console** : admin@englishchat.app / (voir .env)

Profite! 🚀
