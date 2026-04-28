# EnglishChat 🎤📚

**Une application pour apprendre l'anglais en parlant directement avec d'autres apprenants.**

## 🎯 Fonctionnalités

✅ **Leçons Interactives** - Apprenez avec des leçons de A1 à B2  
✅ **Appels WebRTC Anonymes** - Pratiquez en temps réel avec des pairs  
✅ **Dashboard** - Suivez votre progression avec des stats  
✅ **Admin Panel** - Créez et gérez les leçons  
✅ **Gamification** - XP, Streaks, Badges  

## 🏗️ Architecture

```
Frontend:   React 19 + Vite + Tailwind CSS (Vercel)
Backend:    Node.js + Express + Socket.io (Railway)
Database:   PostgreSQL (Railway)
Calls:      Jitsi (WebRTC)
```

## 🚀 Démarrage Local

### Prérequis
- Node.js v20+
- PostgreSQL
- Git

### Setup

```bash
# Clone the repo
git clone https://github.com/Englishchat-ANEM/englishchat.git
cd englishchat

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

# Backend (new terminal)
cd backend
cp .env.example .env
npm install
npm run dev

# Database (new terminal)
createdb englishchat_dev
psql englishchat_dev < ../database/schema.sql
```

### URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health Check: http://localhost:3000/health

## 📝 API Documentation

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Lessons
- `GET /api/lessons?level=A1` - Get lessons
- `GET /api/lessons/:id` - Get lesson detail
- `POST /api/lessons/:id/complete` - Complete lesson

### Users
- `GET /api/users/stats` - Get user stats

### Calls
- `GET /api/calls/history` - Get call history
- `POST /api/calls/end` - End call

## 🎨 Design

The UI follows a clean, modern design with:
- Blue primary color (#4A7FD9)
- White backgrounds with subtle gradients
- Rounded corners (16px) for modern feel
- Card-based layout
- Responsive mobile-first

## 🔐 Security

- JWT authentication (7-day expiration)
- bcryptjs for password hashing
- CORS enabled for frontend
- Environment variables for secrets

## 📊 Database

Schema includes:
- Users (with roles: user, admin)
- Lessons (20+ initial lessons)
- User Progress Tracking
- Call History
- Badges/Achievements

## 🌍 Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Connect Vercel to repo
3. Deploy (automatic)

### Railway (Backend + Database)
1. Create new project
2. Connect GitHub repo
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

## 📧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_JITSI_URL=https://meet.jit.si
```

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/englishchat_dev
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
```

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - Feel free to use for learning and education

## 👥 For ANEM

This app is built for the Association des Nigériens Étudiants au Maroc  
To reach 1,500+ members and scale across African student communities.

## 📞 Support

For issues or questions, open a GitHub issue or contact the admin.

---

**Made with ❤️ for EnglishChat MVP**
