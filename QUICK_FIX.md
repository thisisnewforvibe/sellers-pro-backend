# 🔥 RENDER FIX - DO THIS NOW!

## ✅ CODE IS PUSHED TO GITHUB ✓

## 🎯 FIX RENDER IN 5 STEPS:

### 1. Go to Render Dashboard
https://dashboard.render.com/

### 2. Click Your Service
Find: **sellers-pro-backend**

### 3. Fix Settings
Settings → Build & Deploy:
- **Root Directory:** (LEAVE EMPTY!)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Click "Save Changes"

### 4. Add Environment Variables
Settings → Environment → Add these:

```
MONGODB_URI = YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET = sellers_pro_secret_key_2025_production_ready
TELEGRAM_BOT_TOKEN = 7841643509:AAGe2c8dIj261293qbTwo8Kqkd9LlBvCSfE
TELEGRAM_BOT_USERNAME = sellerprouz_bot
LEAD_BOT_TOKEN = 8258730522:AAF6leBBQGbWmo_ut8OgZI6peG9EITweMxk
ADMIN_TELEGRAM_ID = 991516379
FRONTEND_URL = https://your-frontend-url.com
BACKEND_URL = https://sellers-pro-backend.onrender.com
NODE_ENV = production
```

**⚠️ GET MONGODB_URI from MongoDB Atlas!**

### 5. Deploy
- Settings → "Clear Build Cache"
- Click "Manual Deploy" → "Deploy latest commit"
- Wait 2-3 minutes

---

## 🔴 MOST IMPORTANT!

**Root Directory MUST BE EMPTY!**

If it says "backend" or anything else → DELETE IT!

---

## 📞 Need MongoDB?

Quick setup:
1. https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create user + password
4. Network Access → Allow 0.0.0.0/0
5. Get connection string
6. Add as MONGODB_URI in Render

---

## Test After Deploy

```bash
curl https://sellers-pro-backend.onrender.com/api/health
```

Should return: `{"status":"OK","timestamp":"..."}`

---

**FOLLOW THESE STEPS EXACTLY AND IT WILL WORK! 🚀**

Full guide: See `RENDER_DEPLOYMENT.md`
