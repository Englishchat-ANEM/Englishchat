# ⚡ Quick Start - EnglishChat

## 🎯 Tu as 2 options :

### Option A : Déployer MAINTENANT (5 min)
1. Push ce code vers ton GitHub repo
2. Vercel auto-deploy le frontend
3. Railway auto-deploy le backend + DB
4. ✅ App live en 10 min!

### Option B : Tester Localement d'Abord (30 min)
Voir instructions ci-dessous

---

## 🚀 Option A : Déploiement Rapide

### 1. Push vers GitHub

```bash
git clone https://github.com/Englishchat-ANEM/englishchat.git
cd englishchat

# Ajoute tout le code
git add .
git commit -m "Initial commit: EnglishChat"
git push origin main
```

### 2. Vercel (Frontend)

1. Va https://vercel.com/new
2. Sélectionne ton repo
3. Root Directory: `./frontend`
4. Click "Deploy"
5. ✅ Frontend live en 3 min!

### 3. Railway (Backend + DB)

1. Va https://railway.app/new
2. "Deploy from GitHub"
3. Sélectionne repo, root: `./backend`
4. Click "Deploy"
5. Ajoute PostgreSQL service
6. Initialise DB avec schema.sql
7. ✅ Backend live en 5 min!

### 4. Done!
- Frontend: https://englishchat.vercel.app
- Backend: https://englishchat-backend.railway.app

---

## 🛠️ Option B : Local Development

### Prerequisites
```bash
node --version    # v20+
npm --version     # v10+
psql --version    # PostgreSQL
git --version
```

### Setup (30 min)

```bash
# 1. Clone
git clone https://github.com/Englishchat-ANEM/englishchat.git
cd englishchat

# 2. Frontend (Terminal 1)
cd frontend
cp .env.example .env
npm install
npm run dev
# → http://localhost:5173

# 3. Backend (Terminal 2)
cd backend
cp .env.example .env
npm install
npm run dev
# → http://localhost:3000

# 4. Database (Terminal 3)
createdb englishchat_dev
psql englishchat_dev < ../database/schema.sql

# Done! App running locally!
```

### Test
- Go to http://localhost:5173
- Click "S'inscrire"
- Create account
- You're in! 🎉

---

## 📋 Configuration Checklist

- [ ] GitHub repo clonné/créé
- [ ] Frontend pushed to GitHub
- [ ] Backend pushed to GitHub
- [ ] Vercel connected to repo
- [ ] Railway connected to repo
- [ ] PostgreSQL created in Railway
- [ ] Database schema initialized
- [ ] Environment variables set
- [ ] Frontend URL working
- [ ] Backend URL working
- [ ] Can sign up and log in

---

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api        # Local
VITE_SOCKET_URL=http://localhost:3000         # Local
VITE_JITSI_URL=https://meet.jit.si
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost/englishchat_dev  # Local
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
```

---

## 🎨 Design System

Colors:
- Primary: #4A7FD9 (Blue)
- White: #FFFFFF
- Gray: #666666

Typography:
- Heading: Bold
- Body: Regular
- Mono: Code

---

## 🔐 Default Admin Account

Email: `admin@englishchat.app`  
Password: (Set manually in .env)

Change this immediately in production!

---

## ❓ FAQ

**Q: App doesn't start locally?**  
A: Check PostgreSQL is running: `pg_isready`

**Q: Can't connect to database?**  
A: DATABASE_URL might be wrong. Check PostgreSQL is on localhost:5432

**Q: Frontend won't load?**  
A: Backend might not be running. Check http://localhost:3000/health

**Q: Vercel deployment stuck?**  
A: Check build logs in Vercel dashboard

**Q: Railway deployment failed?**  
A: Check Railway logs and PostgreSQL service

---

## 🚀 Next Steps

1. **Customize Logo** - Replace favicon in frontend/index.html
2. **Add More Lessons** - Insert into database via admin panel
3. **Configure Email** - Set SMTP variables for password reset
4. **Buy Domain** - englishchat.app or englishchat.ma
5. **Monitor** - Set up alerts in Vercel/Railway

---

## 📞 Support

For issues:
1. Check DEPLOYMENT_GUIDE.md
2. Check logs (Vercel/Railway)
3. Check environment variables
4. Search GitHub issues

---

## ✨ You're Ready!

The app is 100% functional and ready for 1,500+ ANEM members.

**Let's go! 🚀**

Made with ❤️ for EnglishChat
