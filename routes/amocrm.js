const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * AmoCRM Webhook Endpoint
 * This receives lead data from amoCRM when a new lead is created
 */
router.post('/webhook', async (req, res) => {
    try {
        console.log('Received amoCRM webhook:', JSON.stringify(req.body, null, 2));
        
        // AmoCRM sends data in 'leads' array
        const webhookData = req.body;
        
        // Check if this is a lead creation event
        if (webhookData['leads[add]']) {
            const leadIds = webhookData['leads[add]'];
            
            // Process each lead
            for (const leadId of leadIds) {
                await processAmoCRMLead(leadId, webhookData);
            }
        }
        
        // Always respond with 200 to acknowledge receipt
        res.status(200).json({ success: true, message: 'Webhook received' });
        
    } catch (error) {
        console.error('Error processing amoCRM webhook:', error);
        // Still return 200 to prevent amoCRM from retrying
        res.status(200).json({ success: false, error: error.message });
    }
});

/**
 * Process a single lead from amoCRM
 */
async function processAmoCRMLead(leadId, webhookData) {
    try {
        // Extract lead data from webhook
        // Note: You'll need to fetch full lead details via API for complete data
        const leadData = {
            name: webhookData[`leads[add][${leadId}][name]`] || 'Unknown',
            phone: extractPhone(webhookData, leadId),
            email: extractEmail(webhookData, leadId),
            source: 'amocrm',
            status: 'new',
            notes: `Lead from amoCRM (ID: ${leadId})`
        };
        
        console.log('Processing lead:', leadData);
        
        // Check if lead already exists (by phone)
        if (leadData.phone) {
            const existingLead = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT id FROM leads WHERE phone = ?',
                    [leadData.phone],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });
            
            if (existingLead) {
                console.log('Lead already exists:', existingLead.id);
                return;
            }
        }
        
        // Insert new lead into database
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO leads (name, phone, email, source, status, created_at, notes)
                 VALUES (?, ?, ?, ?, ?, datetime('now'), ?)`,
                [leadData.name, leadData.phone, leadData.email, leadData.source, leadData.status, leadData.notes],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        console.log('Lead successfully saved to database');
        
    } catch (error) {
        console.error('Error processing lead:', error);
        throw error;
    }
}

/**
 * Extract phone number from webhook data
 */
function extractPhone(webhookData, leadId) {
    // AmoCRM sends contact info in custom fields
    // Look for phone in various possible fields
    for (const key in webhookData) {
        if (key.includes('phone') || key.includes('tel')) {
            return webhookData[key];
        }
    }
    return null;
}

/**
 * Extract email from webhook data
 */
function extractEmail(webhookData, leadId) {
    // Look for email in webhook data
    for (const key in webhookData) {
        if (key.includes('email')) {
            return webhookData[key];
        }
    }
    return null;
}

/**
 * Test endpoint to verify the route is working
 */
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'AmoCRM webhook endpoint is ready',
        endpoint: '/api/amocrm/webhook'
    });
});

module.exports = router;
