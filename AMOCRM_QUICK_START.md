# AmoCRM Integration - Quick Reference

## 📊 How It Works (Flow Diagram)

```
┌─────────────┐
│   AmoCRM    │  Someone creates a lead
│   (CRM)     │  with phone & email
└──────┬──────┘
       │
       │ HTTP POST (webhook)
       │ {name, phone, email}
       ▼
┌─────────────────────┐
│  Your Backend       │
│  /api/amocrm/webhook│
└──────┬──────────────┘
       │
       │ 1. Receive data
       │ 2. Extract fields
       │ 3. Check duplicates
       │ 4. Save to database
       ▼
┌─────────────────────┐
│   SQLite Database   │
│   leads table       │
└──────┬──────────────┘
       │
       │ Lead now visible in:
       ▼
┌─────────────────────┐
│   Admin Panel       │
│   (admin.html)      │
└─────────────────────┘
```

## 🚀 Quick Start Commands

```bash
# 1. Navigate to backend folder
cd /Users/mackbook/Desktop/sellers-pro-backup/backend

# 2. Make sure dependencies are installed
npm install

# 3. Start your server
npm start

# 4. Test the endpoint
curl http://localhost:3000/api/amocrm/test

# Expected response:
# {"success":true,"message":"AmoCRM webhook endpoint is ready"}
```

## 🔑 Configuration Checklist

- [ ] Backend server is running
- [ ] Database has 'leads' table
- [ ] AmoCRM webhook is configured
- [ ] Webhook URL points to your backend
- [ ] Event "Lead Created" is selected
- [ ] Test lead created in amoCRM
- [ ] Lead appears in admin panel

## 📝 AmoCRM Webhook Configuration

**In AmoCRM Settings:**

1. **URL:** `https://your-domain.com/api/amocrm/webhook`
2. **Events:** ☑️ Lead Created (Создание сделки)
3. **Method:** POST
4. **Format:** application/x-www-form-urlencoded

## 🧪 Testing Scenarios

### Test 1: Endpoint Reachability
```bash
curl https://your-domain.com/api/amocrm/test
```
✅ Should return: `{"success":true,"message":"AmoCRM webhook endpoint is ready"}`

### Test 2: Manual Webhook Simulation
```bash
curl -X POST https://your-domain.com/api/amocrm/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "leads[add][0][id]": "12345",
    "leads[add][0][name]": "Test Lead",
    "leads[add][0][phone]": "+998901234567",
    "leads[add][0][email]": "test@example.com"
  }'
```
✅ Should return: `{"success":true,"message":"Webhook received"}`

### Test 3: Check Database
```bash
# Connect to your database and check
sqlite3 sellers-pro.db "SELECT * FROM leads WHERE source='amocrm';"
```
✅ Should show your test lead

## 🔍 Debugging Tips

### Check Server Logs
Look for these messages:
```
✅ Received amoCRM webhook: {...}
✅ Processing lead: {name: "...", phone: "..."}
✅ Lead successfully saved to database
```

### Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| No webhook received | Wrong URL | Double-check URL in amoCRM |
| 404 Not Found | Server not running | Start server with `npm start` |
| Lead not in database | Database error | Check server logs |
| Duplicate leads | No phone number | Add phone to amoCRM lead |

## 🎯 What Happens When You Receive a Lead

```javascript
// 1. AmoCRM sends this data
{
  "leads[add][0][id]": "12345",
  "leads[add][0][name]": "John Doe"
}

// 2. Your code extracts it
const leadData = {
  name: "John Doe",
  phone: "+998901234567",
  email: "john@example.com",
  source: "amocrm",
  status: "new"
}

// 3. Saves to database
INSERT INTO leads (name, phone, email, source, status, created_at)
VALUES ('John Doe', '+998901234567', 'john@example.com', 'amocrm', 'new', NOW());

// 4. Visible in admin panel immediately!
```

## 🔐 Security Recommendations

```javascript
// Add to your .env file
AMOCRM_SECRET=your-random-secret-key-here

// Add to webhook handler
if (req.headers['x-amocrm-secret'] !== process.env.AMOCRM_SECRET) {
  return res.status(403).json({ error: 'Unauthorized' });
}
```

## 📈 Monitoring Your Integration

### Success Metrics
- ✅ Webhook receives data (check logs)
- ✅ Leads saved to database (check admin panel)
- ✅ No duplicate leads (check database)
- ✅ All fields captured (name, phone, email)

### Health Check
```bash
# Run this periodically
curl https://your-domain.com/api/amocrm/test
curl https://your-domain.com/api/health
```

## 🎓 Understanding the Code

### Key Files
- `backend/routes/amocrm.js` - Webhook handler
- `backend/server.js` - Routes registration
- `backend/database.js` - Database operations

### Key Functions
- `processAmoCRMLead()` - Processes single lead
- `extractPhone()` - Finds phone in webhook data
- `extractEmail()` - Finds email in webhook data

## 💡 Pro Tips

1. **Always log webhook data** - Helps with debugging
2. **Return 200 always** - Even on errors, to prevent retries
3. **Check for duplicates** - Prevent same lead twice
4. **Use ngrok for local testing** - Test before deploying
5. **Monitor your logs** - Catch issues early

## 🆘 Need Help?

1. ✅ Read full guide: `AMOCRM_INTEGRATION_GUIDE.md`
2. ✅ Check server logs for errors
3. ✅ Test the endpoint manually
4. ✅ Verify amoCRM webhook configuration
5. ✅ Check database for saved leads

---

**🎉 You're Ready!** Deploy your backend and configure the webhook in amoCRM. Leads will start flowing automatically!
