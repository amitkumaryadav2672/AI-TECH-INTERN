import React, { useState, useEffect } from 'react';
import { Activity, Send, Mail, RefreshCw, BarChart3, CheckCircle2, X } from 'lucide-react';
import './App.css';
import LeadForm from './components/LeadForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MailSandbox from './components/MailSandbox';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState({
    summary: {
      totalLeads: 0,
      emailsSent: 0,
      emailsOpened: 0,
      linkClicks: 0,
      totalOpenEvents: 0,
      totalClickEvents: 0,
      openRate: 0,
      clickRate: 0,
    },
    classifications: {},
    sentiments: {},
  });
  const [loading, setLoading] = useState(false);
  const [clickAlert, setClickAlert] = useState(null);

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leads`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Fetch analytics metrics
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/analytics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLeads();
    fetchMetrics();
  };

  useEffect(() => {
    handleRefresh();

    // Check for click tracking landing page trigger
    const params = new URLSearchParams(window.location.search);
    if (params.get('clicked') === 'true') {
      const name = params.get('leadName') || 'a customer';
      setClickAlert({
        show: true,
        leadName: name,
      });
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('CRITICAL: Are you sure you want to clear ALL lead database records? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE}/api/leads/reset`, {
        method: 'POST',
      });
      if (response.ok) {
        handleRefresh();
      }
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="logo-container">
          <Activity size={26} className="logo-icon" />
          <h1 className="logo-text">LeadOptix</h1>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={16} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'capture' ? 'active' : ''}`}
            onClick={() => setActiveTab('capture')}
          >
            <Send size={16} />
            <span>Capture Lead</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Mail size={16} />
            <span>Email Sandbox</span>
          </button>
        </nav>
      </header>

      {/* Main container */}
      <main className="app-main">
        {/* Click redirect confirmation banner */}
        {clickAlert && (
          <div className="click-notification">
            <div className="notification-content">
              <CheckCircle2 size={24} color="var(--success)" />
              <div>
                <span className="notification-title">Link Click Tracked successfully! </span>
                <span className="notification-desc">
                  Simulated user <strong>{clickAlert.leadName}</strong> clicked the tracked email link and was redirected.
                </span>
              </div>
            </div>
            <button className="btn-close" onClick={() => setClickAlert(null)}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tab switcher views */}
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard 
            leads={leads}
            metrics={metrics}
            onRefresh={handleRefresh}
            onDeleteLead={handleDeleteLead}
            onResetAll={handleResetAll}
            loading={loading}
          />
        )}

        {activeTab === 'capture' && (
          <LeadForm 
            onSubmitSuccess={handleRefresh}
          />
        )}

        {activeTab === 'sandbox' && (
          <MailSandbox 
            leads={leads}
            onActionTriggered={handleRefresh}
          />
        )}
      </main>

      {/* Premium Footer */}
      <footer className="app-footer">
        <p>LeadOptix Tracking Suite &copy; 2026 - Automated Lead Management & Email Tracking System</p>
      </footer>
    </div>
  );
}
