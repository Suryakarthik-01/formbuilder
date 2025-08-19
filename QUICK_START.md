# Quick Start Guide

Get your Form Builder application up and running in minutes!

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Setup (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd form-builder

# Install all dependencies (root, server, and client)
npm run install:all
```

### 2. Configure Environment
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Update Database Connection
Edit `server/.env` and update the MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/form-builder
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/form-builder
```

### 4. Start the Application
```bash
# Start both frontend and backend simultaneously
npm run dev
```

That's it! 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📋 What You Can Do Now

### Create Your First Form
1. Go to http://localhost:3000
2. Click "Create New Form"
3. Drag fields from the sidebar to build your form
4. Configure field settings by clicking on them
5. Save and publish your form

### Test Form Submission
1. Click "Preview" on your form
2. Fill out and submit the form
3. Go back to the dashboard to see the submission

### View Analytics
1. Click on a form card
2. Select "Analytics" to see submission trends
3. Export data as CSV if needed

## 🛠 Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run server:dev

# Start only frontend  
npm run client:dev

# Build frontend for production
npm run client:build

# Run tests
npm test
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- **Local MongoDB**: Make sure MongoDB service is running
- **MongoDB Atlas**: Check your connection string and network access

### Port Already in Use
- Backend (5000): Change `PORT` in `server/.env`
- Frontend (3000): Vite will automatically suggest an alternative port

### Dependencies Issues
```bash
# Clean install all dependencies
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## 📁 Project Structure Overview

```
form-builder/
├── client/          # React frontend (Port 3000)
├── server/          # Node.js backend (Port 5000)
├── package.json     # Root package with scripts
└── README.md        # Detailed documentation
```

## 🎯 Next Steps

1. **Customize the UI**: Edit Tailwind classes in components
2. **Add Authentication**: Implement user login/signup
3. **Deploy**: Use services like Vercel (frontend) + Railway (backend)
4. **Add Features**: Email notifications, webhooks, etc.

## 📚 Learn More

- [Full Documentation](README.md)
- [Backend API Docs](server/README.md)
- [Frontend Guide](client/README.md)

## 🆘 Need Help?

- Check the [troubleshooting section](README.md#troubleshooting)
- Open an issue on GitHub
- Review the console logs for error details

---

**Happy form building!** 🚀
