const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

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
            const existingLead = await Lead.findOne({ phone: leadData.phone });
            
            if (existingLead) {
                console.log('Lead already exists:', existingLead._id);
                return;
            }
        }
        
        // Create new lead in database
        const newLead = new Lead(leadData);
        await newLead.save();
        
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
