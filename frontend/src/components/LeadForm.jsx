import React, { useState } from 'react';
import { User, Mail, Phone, Building, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function LeadForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirement: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [createdLead, setCreatedLead] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validations
    if (!formData.name || !formData.email || !formData.phone || !formData.requirement) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }

      setCreatedLead(data);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirement: '',
      });
      
      // Notify parent component to refresh dashboard metrics
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Server error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card form-container">
      <div className="section-header">
        <h3 className="section-title">
          <Send size={20} className="logo-icon" />
          Capture New Lead Details
        </h3>
      </div>

      {success && createdLead ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <CheckCircle size={60} color="var(--success)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
          <h4 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>Lead Registered Successfully!</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            We've saved <strong>{createdLead.name}</strong> to the database and sent an automated email.
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>AI Classification: </strong>
              <span className={`badge badge-${createdLead.aiCategory.toLowerCase().replace(' ', '-')}`}>
                {createdLead.aiCategory}
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)' }}>Sentiment Analyzed: </strong>
              <span className={`badge badge-${createdLead.aiSentiment === 'Positive' ? 'pos' : createdLead.aiSentiment === 'Negative' ? 'neg' : 'neu'}`}>
                {createdLead.aiSentiment}
              </span>
            </div>
            {createdLead.previewUrl && (
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <a 
                  href={createdLead.previewUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--accent-secondary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  View Sandbox Email Inbox &rarr;
                </a>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSuccess(false)}
            className="btn-submit"
            style={{ width: 'auto', display: 'inline-flex', padding: '0.75rem 2rem' }}
          >
            Register Another Lead
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group-row">
            <div className="form-group">
              <label>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@gmail.com"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Building size={16} />
                </span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. ABC Pvt Ltd"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Requirement / Message *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}>
                <MessageSquare size={16} />
              </span>
              <textarea
                name="requirement"
                value={formData.requirement}
                onChange={handleChange}
                placeholder="e.g. Need AI automation and lead tracking for our business website."
                className="form-textarea"
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                <span>Processing & Sending Tracked Email...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Lead & Trigger Email</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
