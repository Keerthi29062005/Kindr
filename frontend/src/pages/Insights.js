import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
import { getInsights } from '../services/api';
import './Insights.css';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInsights()
      .then(data => {
        setInsights(data);
        setLoading(false);
      })
      .catch(() => {
        // fallback demo
        setInsights({
          summary: "Water scarcity is the most critical issue across 3 areas.",
          topLocation: "Dharavi",
          topNeed: "Water",
          trend: "Water-related reports increased by 40% this week",
          recommendation: "Deploy water tankers and repair pipelines urgently"
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page">Loading insights...</div>;

  return (
    <div className="page">
      <h1 className="page-title">
        <Lightbulb size={20} /> AI Insights
      </h1>

      <div className="insights-grid">
        <div className="card">
          <h3><AlertTriangle size={16} /> Key Insight</h3>
          <p>{insights.summary}</p>
        </div>

        <div className="card">
          <h3><MapPin size={16} /> Most Affected Area</h3>
          <p>{insights.topLocation}</p>
        </div>

        <div className="card">
          <h3><TrendingUp size={16} /> Trend</h3>
          <p>{insights.trend}</p>
        </div>

        <div className="card">
          <h3>Recommended Action</h3>
          <p>{insights.recommendation}</p>
        </div>
      </div>
    </div>
  );
}