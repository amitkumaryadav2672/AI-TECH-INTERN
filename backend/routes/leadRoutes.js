const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { classifyRequirement } = require('../services/aiService');
const { sendAutomatedEmail } = require('../services/emailService');

/**
 * GET /api/leads
 * Retrieves all leads from the database, sorted by creation date (newest first)
 */
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('[Leads API] Error fetching leads:', error.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

/**
 * POST /api/leads
 * Submits a new lead, classifies requirements via AI, saves to MongoDB, and triggers automated email
 */
router.post('/', async (req, res) => {
  const { name, email, phone, company, requirement } = req.body;

  // Basic validations
  if (!name || !email || !phone || !requirement) {
    return res.status(400).json({ error: 'Missing required fields. Name, Email, Phone, and Requirement are required.' });
  }

  try {
    console.log(`[Leads API] New lead submission received: ${name} (${email})`);

    // 1. Run AI analysis (Category classification and Sentiment analysis)
    const aiAnalysis = await classifyRequirement(requirement);
    console.log(`[Leads API] AI Classification completed: Category=${aiAnalysis.category}, Sentiment=${aiAnalysis.sentiment}`);

    // 2. Create the lead database record
    const newLead = new Lead({
      name,
      email,
      phone,
      company: company || '',
      requirement,
      aiCategory: aiAnalysis.category,
      aiSentiment: aiAnalysis.sentiment,
    });

    await newLead.save();

    // 3. Send automated tracking email
    const emailResult = await sendAutomatedEmail(newLead);
    
    if (emailResult.success) {
      newLead.emailSent = true;
      newLead.sentAt = new Date();
      newLead.previewUrl = emailResult.previewUrl || '';
      await newLead.save();
      console.log(`[Leads API] Email dispatch recorded. Preview URL: ${newLead.previewUrl}`);
    } else {
      console.error(`[Leads API] Email dispatch failed: ${emailResult.error}`);
    }

    res.status(201).json(newLead);
  } catch (error) {
    console.error('[Leads API] Error creating lead:', error.message);
    res.status(500).json({ error: 'Failed to process lead submission' });
  }
});

/**
 * DELETE /api/leads/:leadId
 * Deletes a lead record (useful for sandbox environment cleanup)
 */
router.delete('/:leadId', async (req, res) => {
  const { leadId } = req.params;
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully', leadId });
  } catch (error) {
    console.error('[Leads API] Error deleting lead:', error.message);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

/**
 * POST /api/leads/reset
 * Wipes out all lead entries for a clean dashboard (for testing convenience)
 */
router.post('/reset', async (req, res) => {
  try {
    await Lead.deleteMany({});
    res.json({ message: 'All leads cleared successfully' });
  } catch (error) {
    console.error('[Leads API] Error clearing leads:', error.message);
    res.status(500).json({ error: 'Failed to reset leads database' });
  }
});

module.exports = router;
