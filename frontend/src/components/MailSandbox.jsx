import React, { useState } from 'react';
import { Mail, Eye, MousePointer, ExternalLink, Info, Check, RefreshCw } from 'lucide-react';

export default function MailSandbox({ leads, onActionTriggered }) {
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [triggeringOpen, setTriggeringOpen] = useState(false);
  const [openTriggered, setOpenTriggered] = useState(false);

  const selectedLead = leads.find((l) => l._id === selectedLeadId);

  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenTriggered(false);
  };

  const handleSimulateOpen = async () => {
    if (!selectedLead) return;
    setTriggeringOpen(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000' 
          : 'https://ai-tech-intern.onrender.com');
      const pixelUrl = `${API_BASE}/api/track/open/${selectedLead._id}?t=${Date.now()}`;
      await fetch(pixelUrl, { cache: 'no-store' });
      setOpenTriggered(true);
      setTimeout(() => setOpenTriggered(false), 3000);
      if (onActionTriggered) onActionTriggered();
    } catch (error) {
      console.error('Error simulating open:', error);
    } finally {
      setTriggeringOpen(false);
    }
  };

  // Construct Mock Email HTML (matches Nodemailer template)
  const getMockEmailHtml = (lead) => {
    if (!lead) return '';
    const API_BASE = import.meta.env.VITE_API_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' 
        : 'https://ai-tech-intern.onrender.com');
    const trackingPixelUrl = `${API_BASE}/api/track/open/${lead._id}`;
    const trackingClickUrl = `${API_BASE}/api/track/click/${lead._id}`;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; padding: 20px; color: #1a202c; }
            .card { max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            h2 { color: #4f46e5; margin-bottom: 20px; font-size: 1.5rem; }
            blockquote { margin: 20px 0; padding: 12px 20px; border-left: 4px solid #4f46e5; background-color: #f7fafc; font-style: italic; }
            .btn { background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; text-align: center; }
            .footer { font-size: 0.85em; color: #718096; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Thank You for Reaching Out!</h2>
            <p>Hi <strong>${lead.name}</strong>,</p>
            <p>We have successfully received your inquiry regarding:</p>
            <blockquote>"${lead.requirement}"</blockquote>
            <p>Our team has categorized your inquiry under <strong>${lead.aiCategory}</strong>, and an expert will review it shortly to contact you at <strong>${lead.phone}</strong>.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${trackingClickUrl}" target="_blank" class="btn">
                Learn More About Our Services
              </a>
            </div>
            <p class="footer">
              Best regards,<br>
              <strong>Automated Lead Management System</strong>
            </p>
            <!-- Tracking Pixel -->
            <img src="${trackingPixelUrl}" width="1" height="1" style="display:none; width: 1px; height: 1px;" />
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">
          <Mail size={20} className="logo-icon" />
          Email Dispatch Sandbox
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <Info size={20} style={{ flexShrink: 0, color: 'var(--accent-primary)' }} />
        <div>
          This sandbox simulates how dynamic tracking works locally. Emails sent to the test server will log here. 
          Use the simulation buttons to fire open/click trackers and see real-time updates on the Dashboard.
        </div>
      </div>

      {leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <h4>No Emails Sent Yet</h4>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Submit a lead entry to trigger an automated tracking email.</p>
        </div>
      ) : (
        <div className="sandbox-layout">
          {/* Left panel: List of sent emails */}
          <div className="email-list-panel">
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Outbox Logs ({leads.length})
            </h4>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {leads.map((lead) => (
                <button
                  key={lead._id}
                  onClick={() => handleSelectLead(lead._id)}
                  className={`email-item-btn ${selectedLeadId === lead._id ? 'selected' : ''}`}
                >
                  <div className="email-item-meta">
                    <span className="email-item-title">{lead.name}</span>
                    <span className="email-item-time">
                      {new Date(lead.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="email-item-desc">Inquiry Received - {lead.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Email content & simulation triggers */}
          <div>
            {selectedLead ? (
              <div className="email-viewer-panel">
                <div className="email-viewer-header">
                  <div className="email-viewer-row">
                    <span className="email-viewer-label">From:</span>
                    <span>"Lead Tracker System" &lt;no-reply@leadtracker.com&gt;</span>
                  </div>
                  <div className="email-viewer-row">
                    <span className="email-viewer-label">To:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{selectedLead.email}</span>
                  </div>
                  <div className="email-viewer-row">
                    <span className="email-viewer-label">Subject:</span>
                    <span style={{ fontWeight: 600 }}>Inquiry Received - {selectedLead.name}</span>
                  </div>
                </div>

                <div className="email-viewer-actions">
                  <button 
                    onClick={handleSimulateOpen} 
                    className={`btn-action ${openTriggered ? 'btn-action-primary' : ''}`}
                    disabled={triggeringOpen}
                  >
                    {triggeringOpen ? (
                      <RefreshCw size={14} className="spinner" />
                    ) : openTriggered ? (
                      <Check size={14} color="var(--success)" />
                    ) : (
                      <Eye size={14} />
                    )}
                    <span>{openTriggered ? 'Open Tracked!' : 'Simulate Open (Load Pixel)'}</span>
                  </button>

                  <a 
                    href={`${import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://ai-tech-intern.onrender.com')}/api/track/click/${selectedLead._id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-action"
                    style={{ textDecoration: 'none' }}
                  >
                    <MousePointer size={14} />
                    <span>Simulate Click (Track Link)</span>
                  </a>

                  {selectedLead.previewUrl && (
                    <a 
                      href={selectedLead.previewUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-action btn-action-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Ethereal Webmail Inbox</span>
                    </a>
                  )}
                </div>

                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Rendered Email Body Preview:
                </h4>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                  <iframe
                    title="Mock Email Client"
                    srcDoc={getMockEmailHtml(selectedLead)}
                    className="email-iframe-container"
                  />
                </div>
              </div>
            ) : (
              <div className="email-viewer-panel" style={{ minHeight: '350px' }}>
                <div className="no-selection-placeholder">
                  <Mail size={40} />
                  <div>Select an email from the Outbox log to preview content and trigger tracking actions.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
