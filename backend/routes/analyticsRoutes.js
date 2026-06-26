const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

/**
 * GET /api/analytics
 * Computes engagement metrics and distribution stats for the dashboard interface
 */
router.get('/', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    
    // Aggregated metrics
    const emailSentCount = await Lead.countDocuments({ emailSent: true });
    
    // Total unique emails opened
    const emailOpenedCount = await Lead.countDocuments({ emailOpened: true });
    
    // Total unique links clicked
    const linkClickedCount = await Lead.countDocuments({ linkClicked: true });

    // Aggregate counts for openCount and clickCount (total interactions)
    const totalInteractions = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalOpens: { $sum: '$openCount' },
          totalClicks: { $sum: '$clickCount' },
        },
      },
    ]);

    const totalOpenEvents = totalInteractions[0]?.totalOpens || 0;
    const totalClickEvents = totalInteractions[0]?.totalClicks || 0;

    // Rates calculation
    const openRate = emailSentCount > 0 ? Math.round((emailOpenedCount / emailSentCount) * 100) : 0;
    const clickRate = emailSentCount > 0 ? Math.round((linkClickedCount / emailSentCount) * 100) : 0;

    // AI Classification categories distribution
    const categoryStats = await Lead.aggregate([
      { $group: { _id: '$aiCategory', count: { $sum: 1 } } }
    ]);
    
    const categoriesBreakdown = {};
    categoryStats.forEach(item => {
      categoriesBreakdown[item._id || 'General Inquiry'] = item.count;
    });

    // AI Sentiment distribution
    const sentimentStats = await Lead.aggregate([
      { $group: { _id: '$aiSentiment', count: { $sum: 1 } } }
    ]);
    
    const sentimentsBreakdown = { Positive: 0, Neutral: 0, Negative: 0 };
    sentimentStats.forEach(item => {
      if (item._id) {
        sentimentsBreakdown[item._id] = item.count;
      }
    });

    res.json({
      summary: {
        totalLeads,
        emailsSent: emailSentCount,
        emailsOpened: emailOpenedCount,
        linkClicks: linkClickedCount,
        totalOpenEvents,
        totalClickEvents,
        openRate,
        clickRate,
      },
      classifications: categoriesBreakdown,
      sentiments: sentimentsBreakdown,
    });
  } catch (error) {
    console.error('[Analytics API] Error generating metrics:', error.message);
    res.status(500).json({ error: 'Failed to generate metrics data' });
  }
});

module.exports = router;
