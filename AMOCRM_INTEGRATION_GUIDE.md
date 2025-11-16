# AmoCRM Webhook Integration Guide

## Overview
This guide shows you how to connect amoCRM to your Sellers Pro system so leads automatically flow from amoCRM into your admin panel.

## What You've Built

1. **Webhook Endpoint**: `/api/amocrm/webhook` - Receives data from amoCRM
2. **Automatic Lead Processing**: Extracts phone, email, name and saves to database
3. **Duplicate Prevention**: Checks if lead already exists by phone number

## Setup Steps

### Step 1: Get Your Webhook URL

Your webhook URL will be:
```
https://your-backend-domain.com/api/amocrm/webhook
```

For example:
- If using Render: `https://sellers-pro-backend.onrender.com/api/amocrm/webhook`
- If local testing: `https://your-ngrok-url.ngrok.io/api/amocrm/webhook`

### Step 2: Configure Webhook in AmoCRM

1. **Login to AmoCRM**
   - Go to your amoCRM account
   - Navigate to Settings (Настройки)

2. **Open Webhooks Section**
   - Click on "Integrations" (Интеграции)
   - Select "Webhooks" (Вебхуки)

3. **Create New Webhook**
   - Click "Add Webhook" (Добавить вебхук)
   - **URL**: Paste your webhook URL from Step 1
   - **Events to track**: Select "Lead Created" (Создание сделки)
   - **Method**: POST
   - **Format**: application/x-www-form-urlencoded (default)

4. **Save the Webhook**
   - Click "Save" (Сохранить)
   - AmoCRM will verify the endpoint

### Step 3: Test the Integration

#### Option A: Test with AmoCRM
1. Create a test lead in amoCRM
2. Fill in: Name, Phone, Email
3. Save the lead
4. Check your admin panel - the lead should appear!

#### Option B: Test Manually
```bash
# Test if endpoint is accessible
curl https://your-backend-domain.com/api/amocrm/test

# Should return:
{
  "success": true,
  "message": "AmoCRM webhook endpoint is ready",
  "endpoint": "/api/amocrm/webhook"
}
```

### Step 4: Monitor Logs

Check your server logs to see incoming webhooks:
```bash
# If using Render
# Go to Dashboard -> Your Service -> Logs

# You'll see:
✅ Received amoCRM webhook: {...}
✅ Processing lead: {name: "...", phone: "..."}
✅ Lead successfully saved to database
```

## Understanding the Code

### 1. Webhook Receiver (`routes/amocrm.js`)

```javascript
router.post('/webhook', async (req, res) => {
    // AmoCRM sends lead data here
    // We extract name, phone, email
    // Save to database
    // Return 200 to acknowledge
});
```

**Key Points:**
- Always return status 200 (even on errors) to prevent amoCRM from retrying
- Log everything for debugging
- Extract data from webhook payload

### 2. Data Extraction

```javascript
function extractPhone(webhookData, leadId) {
    // Looks through all fields for phone numbers
    for (const key in webhookData) {
        if (key.includes('phone') || key.includes('tel')) {
            return webhookData[key];
        }
    }
    return null;
}
```

**Why:** AmoCRM's webhook format varies, so we search all fields.

### 3. Duplicate Prevention

```javascript
// Check if lead already exists
const existingLead = await db.get(
    'SELECT id FROM leads WHERE phone = ?',
    [leadData.phone]
);

if (existingLead) {
    console.log('Lead already exists');
    return; // Don't create duplicate
}
```

## Advanced: Getting Full Lead Data

The webhook gives basic info. For complete details, you need to call amoCRM API:

### Step 1: Get API Credentials

1. Go to amoCRM Settings → API
2. Create integration
3. Copy: Client ID, Client Secret, Redirect URI
4. Get Access Token (OAuth 2.0)

### Step 2: Fetch Lead Details

```javascript
const axios = require('axios');

async function getLeadDetails(leadId, accessToken) {
    const response = await axios.get(
        `https://yoursubdomain.amocrm.ru/api/v4/leads/${leadId}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }
    );
    
    return response.data;
}
```

### Step 3: Extract Custom Fields

```javascript
function extractCustomFields(leadData) {
    const customFields = leadData.custom_fields_values || [];
    
    let phone = '';
    let email = '';
    
    customFields.forEach(field => {
        if (field.field_code === 'PHONE') {
            phone = field.values[0].value;
        }
        if (field.field_code === 'EMAIL') {
            email = field.values[0].value;
        }
    });
    
    return { phone, email };
}
```

## Troubleshooting

### Issue: "Webhook not receiving data"

**Solutions:**
1. ✅ Check URL is correct (no typos)
2. ✅ Verify server is running
3. ✅ Check CORS is enabled
4. ✅ Look at server logs for errors
5. ✅ Use ngrok for local testing

### Issue: "Lead created but missing phone/email"

**Solution:** AmoCRM's webhook might not send all fields. You need to:
1. Enable API integration (see Advanced section)
2. Fetch full lead details via API
3. Extract custom fields properly

### Issue: "Duplicate leads"

**Solution:** The code checks by phone. If leads have different phones, they'll both be created.

## Testing Locally with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm start

# In another terminal, expose it
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Use this in amoCRM: https://abc123.ngrok.io/api/amocrm/webhook
```

## Security Best Practices

### 1. Verify Webhook Source
Add secret key verification:

```javascript
router.post('/webhook', async (req, res) => {
    const secret = req.headers['x-amocrm-secret'];
    
    if (secret !== process.env.AMOCRM_SECRET) {
        return res.status(403).json({ error: 'Invalid secret' });
    }
    
    // Process webhook...
});
```

### 2. Rate Limiting
Prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // max 100 requests per windowMs
});

router.post('/webhook', limiter, async (req, res) => {
    // Process webhook...
});
```

## Next Steps

1. ✅ Deploy your backend with the new route
2. ✅ Configure webhook in amoCRM
3. ✅ Test with a real lead
4. ✅ Monitor logs to verify it works
5. 🔄 (Optional) Add API integration for complete data
6. 🔄 (Optional) Send Telegram notification when lead arrives
7. 🔄 (Optional) Update lead status back to amoCRM

## Support

If you need help:
1. Check server logs first
2. Verify webhook URL in amoCRM
3. Test the `/api/amocrm/test` endpoint
4. Look at the webhook payload structure in logs

---

**Remember:** AmoCRM webhooks are immediate. As soon as someone creates a lead in amoCRM, it flows into your system automatically! 🎉
