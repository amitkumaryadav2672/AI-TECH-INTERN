import React from 'react';
import { Users, Mail, Eye, MousePointer, Percent, Activity, Trash2, Calendar, RefreshCw, BarChart2 } from 'lucide-react';

export default function AnalyticsDashboard({ leads, metrics, onRefresh, onDeleteLead, onResetAll, loading }) {
  const getCategoryColorClass = (cat) => {
    switch (cat) {
      case 'Sales': return 'badge-sales';
      case 'Support': return 'badge-support';
      case 'Careers': return 'badge-careers';
      case 'Partnership': return 'badge-partnership';
      default: return 'badge-general';
    }
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <span className="badge badge-pos">Positive</span>;
      case 'Negative': return <span className="badge badge-neg">Negative</span>;
      default: return <span className="badge badge-neu">Neutral</span>;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Metrics Cards Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{metrics.summary.totalLeads}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Mail size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{metrics.summary.emailsSent}</span>
            <span className="stat-label">Emails Sent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {metrics.summary.emailsOpened} 
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                ({metrics.summary.totalOpenEvents} opens)
              </span>
            </span>
            <span className="stat-label">Emails Opened</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <MousePointer size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {metrics.summary.linkClicks}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                ({metrics.summary.totalClickEvents} clicks)
              </span>
            </span>
            <span className="stat-label">Link Clicks</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{metrics.summary.openRate}%</span>
            <span className="stat-label">Open Rate</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{metrics.summary.clickRate}%</span>
            <span className="stat-label">Conversion / CTR</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-layout">
        {/* Left Panel: Leads Table */}
        <div>
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">
                <Activity size={20} className="logo-icon" />
                Active Leads Registry
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={onRefresh} 
                  className="refresh-btn" 
                  title="Refresh Dashboard"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spinner' : ''} />
                </button>
                {leads.length > 0 && (
                  <button 
                    onClick={onResetAll} 
                    className="clear-btn"
                    title="Clear database records"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <Users size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <h4>No Leads Found</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Submit the form to generate the first lead entry.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Lead Contact</th>
                      <th>Requirement Details</th>
                      <th>AI analysis</th>
                      <th>Email Open Tracking</th>
                      <th>Click Tracking</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lead.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lead.phone}</div>
                          {lead.company && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginTop: '2px' }}>
                              💼 {lead.company}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }} title={lead.requirement}>
                            {lead.requirement}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <Calendar size={12} />
                            <span>{formatTimestamp(lead.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                            <span className={`badge ${getCategoryColorClass(lead.aiCategory)}`}>
                              {lead.aiCategory}
                            </span>
                            {getSentimentBadge(lead.aiSentiment)}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {lead.emailOpened ? (
                              <>
                                <span className="badge badge-active">Opened</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  Count: {lead.openCount}x
                                </span>
                              </>
                            ) : (
                              <span className="badge badge-inactive">Unopened</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {lead.linkClicked ? (
                              <>
                                <span className="badge badge-active">Clicked</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  Count: {lead.clickCount}x
                                </span>
                              </>
                            ) : (
                              <span className="badge badge-inactive">No Clicks</span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => onDeleteLead(lead._id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: AI Classification Distribution */}
        <div className="analytics-sidebar">
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">
                <BarChart2 size={20} className="logo-icon" />
                AI classification
              </h3>
            </div>
            
            {metrics.summary.totalLeads === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                Awaiting classification data...
              </p>
            ) : (
              <div>
                {['Sales', 'Support', 'Careers', 'Partnership', 'General Inquiry'].map((category) => {
                  const count = metrics.classifications[category] || 0;
                  const pct = metrics.summary.totalLeads > 0 ? Math.round((count / metrics.summary.totalLeads) * 100) : 0;
                  return (
                    <div key={category} style={{ marginBottom: '1.25rem' }}>
                      <div className="category-stat-row">
                        <span className="category-stat-name">{category}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{count} ({pct}%)</span>
                      </div>
                      <div className="category-stat-bar-container">
                        <div 
                          className="category-stat-bar-fill" 
                          style={{ 
                            width: `${pct}%`,
                            background: category === 'Sales' ? 'var(--accent-primary)' :
                                        category === 'Support' ? 'var(--danger)' :
                                        category === 'Careers' ? 'var(--warning)' :
                                        category === 'Partnership' ? 'var(--accent-secondary)' : 'var(--text-muted)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">
                <Activity size={20} className="logo-icon" />
                Sentiment Breakdown
              </h3>
            </div>
            
            {metrics.summary.totalLeads === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                Awaiting sentiment logs...
              </p>
            ) : (
              <div>
                {['Positive', 'Neutral', 'Negative'].map((sent) => {
                  const count = metrics.sentiments[sent] || 0;
                  const pct = metrics.summary.totalLeads > 0 ? Math.round((count / metrics.summary.totalLeads) * 100) : 0;
                  return (
                    <div key={sent} style={{ marginBottom: '1.25rem' }}>
                      <div className="category-stat-row">
                        <span className="category-stat-name">{sent}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{count} ({pct}%)</span>
                      </div>
                      <div className="category-stat-bar-container">
                        <div 
                          className="category-stat-bar-fill" 
                          style={{ 
                            width: `${pct}%`,
                            background: sent === 'Positive' ? 'var(--success)' :
                                        sent === 'Neutral' ? 'var(--text-muted)' : 'var(--danger)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
