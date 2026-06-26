const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// 1x1 transparent GIF tracking pixel base64
const TRANSPARENT_GIF_BUFFER = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

/**
 * GET /api/track/open/:leadId
 * Tracks email open events by serving a 1x1 transparent GIF
 */
router.get('/open/:leadId', async (req, res) => {
  const { leadId } = req.params;

  try {
    const lead = await Lead.findById(leadId);
    if (lead) {
      const now = new Date();
      lead.emailOpened = true;
      lead.openCount += 1;
      
      if (!lead.firstOpenedAt) {
        lead.firstOpenedAt = now;
      }
      lead.lastOpenedAt = now;

      await lead.save();
      console.log(`[Tracking] Email open tracked for lead: ${lead.name} (${leadId}) - Total opens: ${lead.openCount}`);
    } else {
      console.warn(`[Tracking] Email open request received for non-existent lead ID: ${leadId}`);
    }
  } catch (error) {
    console.error(`[Tracking] Error tracking email open:`, error.message);
  }

  // Always return the transparent 1x1 GIF to prevent broken image icon in email client
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': TRANSPARENT_GIF_BUFFER.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
  });
  res.end(TRANSPARENT_GIF_BUFFER);
});

/**
 * GET /api/track/click/:leadId
 * Tracks click events and redirects the user to the application's landing page
 */
router.get('/click/:leadId', async (req, res) => {
  const { leadId } = req.params;
  const frontendHost = 'http://localhost:5173'; // Vite UI dev server

  try {
    const lead = await Lead.findById(leadId);
    if (lead) {
      const now = new Date();
      lead.linkClicked = true;
      lead.clickCount += 1;

      if (!lead.firstClickedAt) {
        lead.firstClickedAt = now;
      }

      await lead.save();
      console.log(`[Tracking] Link click tracked for lead: ${lead.name} (${leadId}) - Total clicks: ${lead.clickCount}`);
      
      // Redirect to the frontend with query parameters indicating click success
      return res.redirect(`${frontendHost}?clicked=true&leadName=${encodeURIComponent(lead.name)}`);
    }
  } catch (error) {
    console.error(`[Tracking] Error tracking link click:`, error.message);
  }

  // Fallback redirect to frontend
  res.redirect(frontendHost);
});

module.exports = router;
