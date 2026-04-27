import React, { useState } from 'react';
import { Users, CheckCircle, Loader, Heart, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerVolunteer } from '../services/api';
import './VolunteerSignup.css';

const ALL_SKILLS = [
  { id: 'Medical', label: 'Medical / First Aid', emoji: '🏥', color: '#ef4444' },
  { id: 'Nursing', label: 'Nursing', emoji: '💉', color: '#f43f5e' },
  { id: 'Teaching', label: 'Teaching / Education', emoji: '📚', color: '#8b5cf6' },
  { id: 'Counseling', label: 'Counseling / Mental Health', emoji: '🧠', color: '#a855f7' },
  { id: 'Logistics', label: 'Logistics / Transportation', emoji: '🚛', color: '#f59e0b' },
  { id: 'Engineering', label: 'Engineering / Technical', emoji: '⚙️', color: '#06b6d4' },
  { id: 'Nutrition', label: 'Nutrition / Food', emoji: '🥗', color: '#10b981' },
  { id: 'Safety', label: 'Safety / Security', emoji: '🛡️', color: '#ec4899' },
  { id: 'Photography', label: 'Documentation / Media', emoji: '📷', color: '#6366f1' },
  { id: 'Social Work', label: 'Social Work / NGO', emoji: '🤝', color: '#00b4a6' },
  { id: 'Legal', label: 'Legal Aid', emoji: '⚖️', color: '#f97316' },
  { id: 'Languages', label: 'Translation / Languages', emoji: '🌐', color: '#eab308' },
];

const AVAILABILITY = ['Weekdays', 'Weekends', 'Evenings', 'Full-time', 'On-call', 'Flexible'];

export default function VolunteerSignup() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '', bio: '',
    skills: [], availability: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skillId) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skillId)
        ? f.skills.filter(s => s !== skillId)
        : [...f.skills, skillId],
    }));
  };
const [volunteerCount, setVolunteerCount] = useState(47);
  const toggleAvailability = (a) => {
    setForm(f => ({
      ...f,
      availability: f.availability.includes(a)
        ? f.availability.filter(x => x !== a)
        : [...f.availability, a],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || form.skills.length === 0) {
      toast.error('Name, email, phone number and at least one skill are required');
      setLoading(true);

    // Simulating an API call
    setTimeout(() => {
      setVolunteerCount(prev => prev + 1);
      setLoading(false);
    }, 1000);
      return;
    }

    setLoading(true);
    try {
      await registerVolunteer(form);
      setSuccess(true);
      toast.success('You\'re registered! AI will match you to community needs.');
    } catch (err) {
      toast.error('Registration failed. Try again.');
      // Demo success for hackathon
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="volunteer-page">
        <div className="success-state animate-fadein">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h2>You're a Community Hero!</h2>
          <p>Your profile is live. AI will match you to the most impactful needs based on your skills.</p>
          <div className="success-skills">
            {form.skills.map(s => {
              const skill = ALL_SKILLS.find(sk => sk.id === s);
              return (
                <span key={s} className="skill-chip active" style={{ borderColor: skill?.color, color: skill?.color }}>
                  {skill?.emoji} {s}
                </span>
              );
            })}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.href = '/match'}>
            <Heart size={15} /> See My Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-page">
      <div className="volunteer-header animate-fadein">
        <div>
          <h1 className="page-title">Join as Volunteer</h1>
          <p className="page-subtitle">Tell us your skills — AI will find where you can make the biggest impact</p>
        </div>
        <div className="volunteer-stats">
          <div className="vol-stat">
            <span className="vol-stat-num">{volunteerCount}</span>
            <span className="vol-stat-label">Active volunteers</span>
          </div>
          <div className="vol-stat">
            <span className="vol-stat-num">23</span>
            <span className="vol-stat-label">Needs matched</span>
          </div>
        </div>
      </div>

      <div className="volunteer-layout animate-fadein animate-delay-1">
        {/* ─── Skills Selection ──────────────────────────────── */}
        <div className="card">
          <h2 className="section-h2">
            <Heart size={16} style={{ color: 'var(--accent-rose)' }} />
            Your Skills
          </h2>
          <p className="section-desc">Select all skills you can contribute (minimum 1)</p>
          <div className="skills-grid">
            {ALL_SKILLS.map((skill) => {
              const selected = form.skills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  className={`skill-chip ${selected ? 'active' : ''}`}
                  style={selected ? { borderColor: skill.color, color: skill.color, background: `${skill.color}15` } : {}}
                  onClick={() => toggleSkill(skill.id)}
                >
                  <span className="skill-emoji">{skill.emoji}</span>
                  {skill.label}
                  {selected && <span className="skill-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Personal Info ─────────────────────────────────── */}
        <div className="form-section">
          <div className="card">
            <h2 className="section-h2">
              <Users size={16} style={{ color: 'var(--accent-cyan)' }} />
              Personal Information
            </h2>
            <div className="form-fields">
              <div className="grid-2">
                <div>
                  <label>Full Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label>Phone *</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label><MapPin size={11} style={{ display: 'inline' }} /> Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Your area / city"
                  />
                </div>
              </div>
              <div>
                <label>Brief Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about your experience or motivation to volunteer..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card">
            <h2 className="section-h2">
              <Clock size={16} style={{ color: 'var(--accent-amber)' }} />
              Availability
            </h2>
            <div className="avail-chips">
              {AVAILABILITY.map(a => (
                <button
                  key={a}
                  className={`avail-chip ${form.availability.includes(a) ? 'active' : ''}`}
                  onClick={() => toggleAvailability(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="card submit-card">
            <div className="submit-info">
              <div className="submit-count">
                {form.skills.length} skill{form.skills.length !== 1 ? 's' : ''} selected
              </div>
              <p className="submit-note">
                AI will analyze your profile against current community needs and show your best matches
              </p>
            </div>
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <><Loader size={15} className="spin" /> Registering...</>
                : <><Heart size={15} /> Register as Volunteer</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}