import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Clock, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { getAllReports } from '../services/api';
import './Reports.css';
 
const DEMO_REPORTS = [
  {
    id: 'demo-1',
    location: 'Dharavi, Mumbai',
    reportType: 'Field Survey',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    analysis: {
      summary: 'Critical water shortage affecting 500+ families. Cascading health impacts with rising diarrhea cases.',
      urgencyScore: 9,
      needs: [
        { category: 'Water', severity: 'Critical' },
        { category: 'Medical', severity: 'High' },
        { category: 'Education', severity: 'Medium' },
      ],
      volunteerRequirements: { urgentCount: 15 },
    },
  },
  {
    id: 'demo-2',
    location: 'Govandi, Mumbai',
    reportType: 'NGO Report',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    analysis: {
      summary: 'Severe malnutrition among children under 5. Only 1 Anganwadi serving 3000 residents.',
      urgencyScore: 8,
      needs: [
        { category: 'Food', severity: 'Critical' },
        { category: 'Education', severity: 'High' },
        { category: 'Medical', severity: 'High' },
      ],
      volunteerRequirements: { urgentCount: 10 },
    },
  },
  {
    id: 'demo-3',
    location: 'Mankhurd, Mumbai',
    reportType: 'Community Survey',
    createdAt: new Date().toISOString(),
    analysis: {
      summary: 'Chronic electricity shortage 8-12 hours daily. Students cannot study. Women unsafe after dark.',
      urgencyScore: 7,
      needs: [
        { category: 'Electricity', severity: 'High' },
        { category: 'Safety', severity: 'High' },
        { category: 'Education', severity: 'Medium' },
      ],
      volunteerRequirements: { urgentCount: 8 },
    },
  },
];
 
const severityColor = { Critical: '#f43f5e', High: '#f59e0b', Medium: '#00d4ff', Low: '#00e5a0' };
 
function ReportCard({ report }) {
  const [expanded, setExpanded] = useState(false);
 
  return (
    <div className={`report-card card ${expanded ? 'expanded' : ''}`}>
      <div className="report-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="report-left">
          <div className="report-type-badge">{report.reportType}</div>
          <div className="report-main">
            <div className="report-location">
              <MapPin size={13} />
              {report.location}
            </div>
            <p className="report-summary">{report.analysis?.summary}</p>
          </div>
        </div>
        <div className="report-right">
          <div className="urgency-ring" data-urgency={report.analysis?.urgencyScore}>
            <span className="urgency-num">{report.analysis?.urgencyScore}</span>
            <span className="urgency-label">/10</span>
          </div>
          <div className="report-meta">
            <div className="report-needs-preview">
              {report.analysis?.needs?.slice(0, 3).map((n, i) => (
                <span
                  key={i}
                  className="need-dot"
                  style={{ background: severityColor[n.severity], boxShadow: `0 0 5px ${severityColor[n.severity]}` }}
                  title={`${n.category}: ${n.severity}`}
                />
              ))}
            </div>
            <div className="report-time">
              <Clock size={11} />
              {formatTime(report.createdAt)}
            </div>
          </div>
          <button className="expand-btn">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
 
      {expanded && (
        <div className="report-details animate-fadein">
          <div className="detail-divider" />
          <h4>Extracted Needs</h4>
          <div className="detail-needs">
            {report.analysis?.needs?.map((need, i) => (
              <div key={i} className="detail-need">
                <span
                  className="detail-dot"
                  style={{ background: severityColor[need.severity] }}
                />
                <span className="detail-cat">{need.category}</span>
                <span className={`badge badge-${need.severity?.toLowerCase()}`}>{need.severity}</span>
              </div>
            ))}
          </div>
          {report.analysis?.volunteerRequirements && (
            <div className="detail-volunteer">
              <span>🙋 {report.analysis.volunteerRequirements.urgentCount} volunteers needed urgently</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 
export default function Reports() {
  const [reports, setReports] = useState(DEMO_REPORTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    getAllReports()
      .then(data => { if (data.length) setReports(data); })
      .catch(() => {});
  }, []);
 
  const filtered = reports.filter(r => {
    const matchSearch = r.location?.toLowerCase().includes(search.toLowerCase()) ||
      r.analysis?.summary?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.reportType === filter;
    return matchSearch && matchFilter;
  });
 
  const types = ['All', ...new Set(reports.map(r => r.reportType).filter(Boolean))];
 
  return (
    <div className="reports-page">
      <div className="reports-header animate-fadein">
        <div>
          <h1 className="page-title">Field Reports</h1>
          <p className="page-subtitle">{reports.length} reports submitted · AI-analyzed</p>
        </div>
      </div>
 
      {/* Filters */}
      <div className="reports-filters animate-fadein animate-delay-1">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by location or content..."
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
        <div className="filter-chips">
          {types.map(t => (
            <button
              key={t}
              className={`filter-chip ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
 
      {/* Reports list */}
      <div className="reports-list animate-fadein animate-delay-2">
        {filtered.length === 0 && (
          <div className="reports-empty">
            <FileText size={40} style={{ opacity: 0.2 }} />
            <p>No reports found</p>
          </div>
        )}
        {filtered.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
 
function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}