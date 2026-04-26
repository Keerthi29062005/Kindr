import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell
} from 'recharts';
import {
  AlertTriangle, Users, FileText, Zap,
  TrendingUp, MapPin, Activity, ChevronRight
} from 'lucide-react';
import { getDashboardNeeds, getAllReports, getAllVolunteers } from '../services/api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const DEMO_NEEDS = [
  { category: 'Water', count: 12, severity: 'Critical', color: '#3b82f6', locations: ['Dharavi', 'Kurla'] },
  { category: 'Medical', count: 9, severity: 'Critical', color: '#ef4444', locations: ['Govandi'] },
  { category: 'Food', count: 8, severity: 'High', color: '#f59e0b', locations: ['Mankhurd', 'Govandi'] },
  { category: 'Education', count: 7, severity: 'High', color: '#8b5cf6', locations: ['Dharavi'] },
  { category: 'Electricity', count: 5, severity: 'High', color: '#eab308', locations: ['Mankhurd'] },
  { category: 'Safety', count: 4, severity: 'Medium', color: '#ec4899', locations: ['Mankhurd'] },
  { category: 'Sanitation', count: 3, severity: 'Medium', color: '#f97316', locations: ['Kurla'] },
];

const DEMO_LOCATIONS = [
  { location: 'Dharavi', count: 8 },
  { location: 'Govandi', count: 6 },
  { location: 'Mankhurd', count: 5 },
  { location: 'Kurla', count: 4 },
  { location: 'Chembur', count: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-val">{payload[0].value} reports</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState({ needs: DEMO_NEEDS, locations: DEMO_LOCATIONS, totalReports: 25 });
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardNeeds().catch(() => null),
      getAllReports().catch(() => []),
      getAllVolunteers().catch(() => []),
    ]).then(([dashData, reps, vols]) => {
      if (dashData?.needs?.length) setData(dashData);
      setReports(reps);
      setVolunteers(vols);
      setLoading(false);
    });
  }, []);

  const stats = [
    {
      label: 'Active Reports',
      value: data.totalReports || reports.length || 25,
      icon: FileText,
      color: '#00d4ff',
      delta: '+3 today',
    },
    {
      label: 'Critical Needs',
      value: data.needs?.filter(n => n.severity === 'Critical').length || 2,
      icon: AlertTriangle,
      color: '#f43f5e',
      delta: 'Needs attention',
    },
    {
      label: 'Volunteers',
      value: volunteers.length || 47,
      icon: Users,
      color: '#00e5a0',
      delta: '+5 this week',
    },
    {
      label: 'Areas Covered',
      value: data.locations?.length || 12,
      icon: MapPin,
      color: '#8b5cf6',
      delta: 'Across city',
    },
  ];

  const radarData = data.needs?.slice(0, 6).map(n => ({
    category: n.category,
    urgency: n.count * 10,
  })) || [];

  return (
    <div className="dashboard">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="dashboard-header animate-fadein">
        <div>
          <h1 className="page-title">Community Intelligence Hub</h1>
          <p className="page-subtitle">Real-time view of community needs powered by Vertex AI</p>
        </div>
        <div className="header-actions">
          <Link to="/upload" className="btn btn-primary">
            <Zap size={15} />
            Add Report
          </Link>
          <Link to="/insights" className="btn btn-ghost">
            <Activity size={15} />
            AI Insights
          </Link>
        </div>
      </div>

      {/* ─── Stat Cards ───────────────────────────────────────── */}
      <div className="grid-4 animate-fadein animate-delay-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card stat-card">
              <div className="stat-top">
                <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                  <Icon size={20} />
                </div>
                <span className="stat-delta">{stat.delta}</span>
              </div>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ─── Charts Row ───────────────────────────────────────── */}
      <div className="dashboard-charts animate-fadein animate-delay-2">
        {/* Needs Bar Chart */}
        <div className="card chart-card">
          <div className="chart-header">
            <h2>Top Community Needs</h2>
            <span className="badge badge-critical">
              <span className="severity-dot critical" />
              Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.needs} barSize={28}>
              <XAxis
                dataKey="category"
                tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'DM Sans' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.needs?.map((entry, index) => (
                  <Cell key={index} fill={entry.color || '#00d4ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="card chart-card">
          <div className="chart-header">
            <h2>Urgency Radar</h2>
            <TrendingUp size={16} color="var(--accent-cyan)" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,212,255,0.1)" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar
                name="Urgency"
                dataKey="urgency"
                stroke="#00d4ff"
                fill="#00d4ff"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Bottom Row ───────────────────────────────────────── */}
      <div className="dashboard-bottom animate-fadein animate-delay-3">
        {/* Priority Needs List */}
        <div className="card needs-list-card">
          <div className="chart-header">
            <h2>Priority Issues</h2>
            <Link to="/reports" className="btn btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
              View All <ChevronRight size={13} />
            </Link>
          </div>
          <div className="needs-list">
            {data.needs?.map((need, i) => (
              <div key={need.category} className="need-row">
                <div className="need-rank">#{i + 1}</div>
                <div className="need-info">
                  <div className="need-name">
                    <span
                      className="need-dot"
                      style={{ background: need.color, boxShadow: `0 0 6px ${need.color}` }}
                    />
                    {need.category}
                  </div>
                  <div className="need-locations">
                    {need.locations?.slice(0, 2).map(l => (
                      <span key={l} className="tag">{l}</span>
                    ))}
                  </div>
                </div>
                <div className="need-meta">
                  <span className={`badge badge-${need.severity?.toLowerCase()}`}>
                    {need.severity}
                  </span>
                  <span className="need-count">{need.count} reports</span>
                </div>
                <div className="need-bar-wrap">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(need.count / (data.needs?.[0]?.count || 1)) * 100}%`,
                        background: need.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location heatmap */}
        <div className="card">
          <div className="chart-header">
            <h2>Reports by Area</h2>
            <MapPin size={16} color="var(--accent-cyan)" />
          </div>
          <div className="location-list">
            {data.locations?.map((loc) => {
              const pct = Math.round((loc.count / (data.totalReports || 25)) * 100);
              return (
                <div key={loc.location} className="location-row">
                  <div className="location-name">
                    <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} />
                    {loc.location}
                  </div>
                  <div className="location-bar">
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))',
                        }}
                      />
                    </div>
                    <span className="location-count">{loc.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="quick-actions">
            <Link to="/match" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Users size={15} />
              Match Volunteers Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}