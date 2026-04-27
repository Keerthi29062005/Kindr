import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Image, File, Loader, CheckCircle,
  AlertCircle, MapPin, Tag, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeReport } from '../services/api';
import './UploadReport.css';

const REPORT_TYPES = ['Field Survey', 'Community Survey', 'NGO Report', 'Health Report', 'Infrastructure Report', 'Emergency Report'];
const LOCATIONS = ['Dharavi', 'Govandi', 'Mankhurd', 'Kurla', 'Chembur', 'Malad', 'Bandra', 'Other'];

export default function UploadReport() {
  const [mode, setMode] = useState('text'); // 'text' | 'file'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState('');
  const [isOther, setIsOther] = useState(false); // Track if 'Other' is selected
  const [reportType, setReportType] = useState('Field Survey');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setMode('file');
      toast.success(`File loaded: ${f.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!text.trim() && !file) {
      toast.error('Please provide text or upload a file');
      return;
    }
    if (!location) {
      toast.error('Please select or enter a location');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeReport({ text, file, location, reportType });
      setResult(data.analysis);
      toast.success('Report analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Check server connection.');
      // Demo result for hackathon
      setResult(getDemoResult());
    } finally {
      setLoading(false);
    }
  };

  const severityColor = { Critical: '#f43f5e', High: '#f59e0b', Medium: '#00d4ff', Low: '#00e5a0' };

  return (
    <div className="upload-page">
      <div className="upload-header animate-fadein">
        <div>
          <h1 className="page-title">Upload Field Report</h1>
          <p className="page-subtitle">Add survey data, text reports, or images — AI will extract community needs</p>
        </div>
        <div className="vertex-pill">
          <Zap size={12} />
          Vertex AI + Vision API
        </div>
      </div>

      <div className="upload-layout animate-fadein animate-delay-1">
        {/* ─── Input Panel ───────────────────────────────────── */}
        <div className="upload-panel">
          {/* Mode toggle */}
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
            >
              <FileText size={15} /> Text Input
            </button>
            <button
              className={`mode-btn ${mode === 'file' ? 'active' : ''}`}
              onClick={() => setMode('file')}
            >
              <Upload size={15} /> File Upload
            </button>
          </div>

          {/* Text Input */}
          {mode === 'text' ? (
            <div className="input-section">
              <label>Report Content</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your field report, survey responses, or community observations here..."
                rows={10}
                style={{ resize: 'vertical', lineHeight: 1.7 }}
              />
              <div className="char-count">{text.length} characters</div>
            </div>
          ) : (
            <div className="dropzone-section">
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="file-preview">
                    <div className="file-icon">
                      {file.type.startsWith('image/') ? <Image size={28} /> : <File size={28} />}
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button className="file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <div className="dropzone-icon">
                      {isDragActive ? <Upload size={36} /> : <Upload size={32} />}
                    </div>
                    <p className="dropzone-title">
                      {isDragActive ? 'Drop it here!' : 'Drag & drop your report'}
                    </p>
                    <p className="dropzone-sub">Images (JPG/PNG), PDFs, or text files • Max 10MB</p>
                  </div>
                )}
              </div>
              {file?.type.startsWith('image/') && (
                <div className="image-preview-container">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="grid-2" style={{ marginTop: '1.25rem' }}>
            <div>
              <label><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />Location</label>
              
              {!isOther ? (
                <select 
                  value={location} 
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setIsOther(true);
                      setLocation(''); // Clear to let user type fresh
                    } else {
                      setLocation(e.target.value);
                    }
                  }}
                >
                  <option value="">Select area...</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              ) : (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter custom location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus
                    style={{ paddingRight: '30px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => { setIsOther(false); setLocation(''); }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label><Tag size={12} style={{ display: 'inline', marginRight: '4px' }} />Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <><Loader size={16} className="spin" /> Analyzing with Vertex AI...</>
            ) : (
              <><Zap size={16} /> Analyze Report</>
            )}
          </button>
        </div>

        {/* ─── Results Panel ─────────────────────────────────── */}
        <div className="results-panel">
          {!result && !loading && (
            <div className="results-empty">
              <div className="empty-icon"><Zap size={40} /></div>
              <p>AI analysis results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="results-loading">
              <div className="loading-steps">
                {['Reading document...', 'Running OCR...', 'Extracting needs...', 'Scoring urgency...'].map((step, i) => (
                  <div key={step} className="loading-step" style={{ animationDelay: `${i * 0.8}s` }}>
                    <Loader size={13} className="spin" /> {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="results-content">
              <div className="result-section">
                <div className="result-header">
                  <CheckCircle size={16} color="#00e5a0" />
                  <h3>Analysis Complete</h3>
                  <div className="urgency-badge">
                    Urgency: <strong style={{ color: getUrgencyColor(result.urgencyScore) }}>{result.urgencyScore}/10</strong>
                  </div>
                </div>
                <p className="result-summary">{result.summary}</p>
              </div>

              <div className="result-section">
                <h3 className="section-title">Extracted Needs ({result.needs?.length})</h3>
                <div className="needs-grid">
                  {result.needs?.map((need, i) => (
                    <div key={i} className="need-card" style={{ borderColor: `${severityColor[need.severity]}30` }}>
                      <div className="need-card-top">
                        <span className="need-category" style={{ color: severityColor[need.severity] }}>{need.category}</span>
                        <span className={`badge badge-${need.severity?.toLowerCase()}`}>{need.severity}</span>
                      </div>
                      <p className="need-desc">{need.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getUrgencyColor(score) {
  if (score >= 8) return '#f43f5e';
  if (score >= 6) return '#f59e0b';
  if (score >= 4) return '#00d4ff';
  return '#00e5a0';
}

function getDemoResult() {
  return {
    summary: 'Critical water shortage affecting 500+ families. Immediate intervention required.',
    urgencyScore: 9,
    needs: [
      { category: 'Water', description: 'Acute water shortage — no clean water access within 2km', severity: 'Critical' },
      { category: 'Medical', description: 'Rising diarrhea and waterborne disease cases', severity: 'High' },
    ],
    recommendedActions: ['Deploy water tankers immediately', 'Set up ORS distribution points'],
    volunteerRequirements: { urgentCount: 15, skills: ['Medical', 'Logistics'] },
  };
}