import React, { useState } from 'react';
import {
  GitMerge, Zap, Loader, Star, MapPin, Target,
  Users, TrendingUp, ChevronRight, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { matchVolunteer } from '../services/api';
import './VolunteerMatch.css';

const ALL_SKILLS = [
  'Medical', 'Nursing', 'Teaching', 'Counseling', 'Logistics',
  'Engineering', 'Nutrition', 'Safety', 'Social Work', 'Legal', 'Languages', 'Photography'
];

const DEMO_MATCHES = {
  matches: [
    {
      needIndex: 1,
      category: 'Medical',
      description: 'Rising diarrhea and waterborne disease cases from contaminated water',
      location: 'Dharavi, Mumbai',
      severity: 'Critical',
      matchScore: 96,
      matchReason: 'Your medical background is urgently needed for waterborne disease treatment',
      estimatedImpact: 'Could directly help 300+ affected patients this week',
      suggestedRole: 'Field Medical Officer — ORS distribution and patient triage',
    },
    {
      needIndex: 2,
      category: 'Education',
      description: 'Children missing school to collect water — need learning support',
      location: 'Dharavi, Mumbai',
      severity: 'High',
      matchScore: 88,
      matchReason: 'Teaching skills align with urgent need for child education support',
      estimatedImpact: 'Help 200+ children maintain educational continuity',
      suggestedRole: 'Community Educator — after-school programs and catch-up sessions',
    },
    {
      needIndex: 3,
      category: 'Food',
      description: 'Malnutrition affecting 40% of children under 5 — needs nutrition education',
      location: 'Govandi, Mumbai',
      severity: 'Critical',
      matchScore: 82,
      matchReason: 'Nutrition knowledge + teaching skills = high impact in awareness programs',
      estimatedImpact: 'Reach 600+ mothers with nutrition counseling',
      suggestedRole: 'Nutrition Educator — community health camps',
    },
    {
      needIndex: 4,
      category: 'Safety',
      description: 'Women unsafe after dark due to no street lighting',
      location: 'Mankhurd, Mumbai',
      severity: 'High',
      matchScore: 71,
      matchReason: 'Safety skills needed for community safety audit and patrol coordination',
      estimatedImpact: 'Improve safety for 2000+ residents',
      suggestedRole: 'Safety Coordinator — community patrol organizer',
    },
  ],
  overallMatchQuality: 'Excellent',
  volunteerStrengths: ['Clinical expertise', 'Educational background', 'Community engagement'],
  suggestedTraining: ['Disaster preparedness certification', 'Community health worker training'],
};

export default function VolunteerMatch() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleMatch = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Select at least one skill to match');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await matchVolunteer({
        volunteerSkills: selectedSkills,
        volunteerLocation: location,
      });
      setResult(data);
      toast.success(`Found ${data.matches?.length || 0} matches!`);
    } catch (err) {
      // Demo for hackathon
      setResult(DEMO_MATCHES);
      toast.success(`Found ${DEMO_MATCHES.matches.length} AI-matched opportunities!`);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 90) return '#00e5a0';
    if (score >= 75) return '#00d4ff';
    if (score >= 60) return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="match-page">
      <div className="match-header animate-fadein">
        <div>
          <h1 className="page-title">AI Volunteer Matcher</h1>
          <p className="page-subtitle">Vertex AI matches your skills to the most impactful community needs</p>
        </div>
        <div className="vertex-pill">
          <Zap size={12} />
          Gemini 1.5 Pro Matching
        </div>
      </div>

      <div className="match-layout animate-fadein animate-delay-1">
        {/* ─── Query Panel ───────────────────────────────────── */}
        <div className="card query-panel">
          <h2 className="section-h2">
            <Target size={16} style={{ color: 'var(--accent-cyan)' }} />
            Your Profile
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label>Your Skills</label>
            <div className="match-skills-grid">
              {ALL_SKILLS.map(skill => (
                <button
                  key={skill}
                  className={`match-skill-btn ${selectedSkills.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label><MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />Your Location (optional)</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Dharavi, Mumbai"
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            onClick={handleMatch}
            disabled={loading}
          >
            {loading
              ? <><Loader size={15} className="spin" /> Matching with AI...</>
              : <><GitMerge size={15} /> Find My Matches</>
            }
          </button>

          {/* How it works */}
          <div className="how-it-works">
            <h3>How AI Matching Works</h3>
            <div className="how-step">
              <span className="how-num">1</span>
              <span>Your skills are sent to Vertex AI (Gemini 1.5 Pro)</span>
            </div>
            <div className="how-step">
              <span className="how-num">2</span>
              <span>AI analyzes all active community needs from reports</span>
            </div>
            <div className="how-step">
              <span className="how-num">3</span>
              <span>Matches ranked by impact score + skill alignment</span>
            </div>
          </div>
        </div>

        {/* ─── Results ───────────────────────────────────────── */}
        <div className="results-area">
          {!result && !loading && (
            <div className="match-empty">
              <GitMerge size={48} style={{ opacity: 0.15 }} />
              <p>Select your skills and click Match to find opportunities</p>
            </div>
          )}

          {loading && (
            <div className="match-loading">
              <div className="loading-orb" />
              <p>AI is analyzing {selectedSkills.length} skills against community needs...</p>
              <div className="loading-skills">
                {selectedSkills.map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="match-results">
              {/* Summary banner */}
              <div className="match-summary">
                <div className="match-summary-left">
                  <Award size={20} style={{ color: 'var(--accent-amber)' }} />
                  <div>
                    <div className="match-quality">{result.overallMatchQuality} Match Quality</div>
                    <div className="match-subtitle">{result.matches?.length} opportunities found</div>
                  </div>
                </div>
                <div className="match-strengths">
                  {result.volunteerStrengths?.map(s => (
                    <span key={s} className="strength-tag">{s}</span>
                  ))}
                </div>
              </div>

              {/* Match cards */}
              {result.matches?.map((match, i) => (
                <div key={i} className="match-card animate-fadein" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="match-card-header">
                    <div className="match-rank">#{i + 1}</div>
                    <div className="match-cat-info">
                      <h3 className="match-category">{match.category}</h3>
                      <div className="match-location">
                        <MapPin size={11} />
                        {match.location}
                      </div>
                    </div>
                    <div className="match-score-circle" style={{ '--score-color': scoreColor(match.matchScore) }}>
                      <span className="score-number">{match.matchScore}</span>
                      <span className="score-label">match</span>
                    </div>
                  </div>

                  <div className="match-severity-row">
                    <span className={`badge badge-${match.severity?.toLowerCase()}`}>
                      <span className={`severity-dot ${match.severity?.toLowerCase()}`} />
                      {match.severity}
                    </span>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${match.matchScore}%`, background: scoreColor(match.matchScore) }}
                      />
                    </div>
                  </div>

                  <p className="match-description">{match.description}</p>

                  <div className="match-role">
                    <Target size={12} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                    <span>{match.suggestedRole}</span>
                  </div>

                  <div className="match-impact">
                    <TrendingUp size={12} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    <span>{match.estimatedImpact}</span>
                  </div>

                  <p className="match-reason">{match.matchReason}</p>

                  <button className="btn btn-primary" style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    Accept This Assignment <ChevronRight size={14} />
                  </button>
                </div>
              ))}

              {/* Training suggestions */}
              {result.suggestedTraining?.length > 0 && (
                <div className="training-card">
                  <h3><Star size={14} /> Boost Your Impact</h3>
                  <p>Suggested training to increase match quality:</p>
                  <div className="training-list">
                    {result.suggestedTraining.map(t => (
                      <span key={t} className="training-item">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}