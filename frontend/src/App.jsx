import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

//const API = 'https://humanizer-47dt.onrender.com';
const API = 'https://humanizer-47dt.onrender.com/api/humanize';

function StatsBar({ stats, apiCalls, apiSaved }) {
  const scoreDrop = stats.scoreBefore - stats.scoreAfter;
  
  const getScoreColor = (s) => s > 60 ? '#E24B4A' : s > 30 ? '#EF9F27' : '#639922';
  const getBadge = (s) => s > 60 
    ? { label: 'High AI risk', cls: 'badge-high' }
    : s > 30 
    ? { label: 'Moderate', cls: 'badge-med' }
    : { label: 'Looks human', cls: 'badge-low' };

  return (
    <div className="stats-bar">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Words</div>
          <div className="stat-val">{stats.wordCount}</div>
          <div className="stat-sub">processed</div>
        </div>

        <div className="stat-score-card">
          <div className="stat-label">AI Score — Before</div>
          <div className="stat-score-num" style={{ color: getScoreColor(stats.scoreBefore) }}>
            {stats.scoreBefore}<span className="stat-denom">/100</span>
          </div>
          <div className="stat-bar-bg">
            <div className="stat-bar-fill" style={{ width: `${stats.scoreBefore}%`, background: getScoreColor(stats.scoreBefore) }} />
          </div>
          <span className={`stat-badge ${getBadge(stats.scoreBefore).cls}`}>
            {getBadge(stats.scoreBefore).label}
          </span>
        </div>

        <div className="stat-score-card">
          <div className="stat-label">AI Score — After</div>
          <div className="stat-score-num" style={{ color: getScoreColor(stats.scoreAfter) }}>
            {stats.scoreAfter}<span className="stat-denom">/100</span>
          </div>
          <div className="stat-bar-bg">
            <div className="stat-bar-fill" style={{ width: `${stats.scoreAfter}%`, background: getScoreColor(stats.scoreAfter) }} />
          </div>
          <span className={`stat-badge ${getBadge(stats.scoreAfter).cls}`}>
            {getBadge(stats.scoreAfter).label}
          </span>
        </div>

        <div className="stat-card">
          <div className="stat-label">Score drop</div>
          <div className="stat-val" style={{ color: scoreDrop > 0 ? '#3B6D11' : '#A32D2D' }}>
            {scoreDrop > 0 ? '-' : '+'}{Math.abs(scoreDrop)}
          </div>
          <div className="stat-sub">points improved</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Method</div>
          <div className="stat-method-icon">{stats.method === 'rules' ? '⚡' : stats.method === 'ai' ? '🤖' : '⚡🤖'}</div>
          <div className="stat-method-name">
            {stats.method === 'rules' ? 'Rule Engine' : stats.method === 'ai' ? 'Gemini AI' : 'Hybrid'}
          </div>
          <div className="stat-sub">{stats.method === 'rules' ? 'No API used' : 'API called'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">API calls</div>
          <div className="stat-val">{apiCalls}</div>
          <div className="stat-sub" style={{ color: '#3B6D11' }}>{apiSaved} saved ⚡</div>
        </div>
      </div>
      <div className="stats-divider" />
    </div>
  );
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('text');
  const [fileName, setFileName] = useState('');
  const [stats, setStats] = useState(null);
  const [sessionApiCalls, setSessionApiCalls] = useState(0);
  const [sessionApiSaved, setSessionApiSaved] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const wordCount = (t) => t.trim() ? t.trim().split(/\s+/).length : 0;

  const handleTextHumanize = async () => {
    if (!inputText.trim()) return;
    setLoading(true); setError(''); setOutputText(''); setStats(null);
    try {
      const { data } = await axios.post(`${API}/text`, { text: inputText, mode });
      setOutputText(data.result);
      setStats(data.stats);
      if (data.stats.apiCallMade) {
        setSessionApiCalls(prev => prev + 1);
      } else {
        setSessionApiSaved(prev => prev + 1);
      }
    } catch {
      setError('Request failed. Check if backend is running.');
    }
    setLoading(false);
  };

  const handleFileHumanize = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return;
    setLoading(true); setError(''); setOutputText(''); setStats(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    try {
      const { data } = await axios.post(`${API}/file`, formData);
      setOutputText(data.result);
      setStats(data.stats);
      if (data.stats.apiCallMade) {
        setSessionApiCalls(prev => prev + 1);
      } else {
        setSessionApiSaved(prev => prev + 1);
      }
    } catch {
      setError('File processing failed.');
    }
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'humanized.txt';
    a.click();
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="logo">human<span>izer</span></div>
        <div className="header-badge">Powered by Gemini AI</div>
      </header>

      {/* BODY */}
      <div className="body">
        {/* CONTROLS */}
        <div className="controls">
          <div className="tabs">
            <button className={`tab-btn ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>
              Paste Text
            </button>
            <button className={`tab-btn ${tab === 'file' ? 'active' : ''}`} onClick={() => setTab('file')}>
              Upload File
            </button>
          </div>
          <div className="mode-wrap">
            <span className="mode-label">Mode</span>
            <select className="mode-select" value={mode} onChange={e => setMode(e.target.value)}>
              <option value="standard">Standard — light touch</option>
              <option value="aggressive">Aggressive — heavy rewrite</option>
            </select>
          </div>
        </div>

        {/* STATS BAR */}
        {stats && (
          <StatsBar 
            stats={stats} 
            apiCalls={sessionApiCalls} 
            apiSaved={sessionApiSaved} 
          />
        )}

        {/* PANELS */}
        <div className="panels">
          {/* INPUT */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Input</span>
              <span className="char-count">
                {tab === 'text' ? `${wordCount(inputText)} words` : fileName || 'No file chosen'}
              </span>
            </div>

            {tab === 'text' ? (
              <textarea
                placeholder="Paste your AI-generated text here…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
            ) : (
              <div className="file-drop">
                <input
                  type="file"
                  ref={fileRef}
                  accept=".txt,.pdf,.docx"
                  onChange={e => setFileName(e.target.files[0]?.name || '')}
                />
                {fileName && <p className="file-name">📄 {fileName}</p>}
              </div>
            )}

            <div className="panel-footer">
              <button
                className="btn-primary"
                onClick={tab === 'text' ? handleTextHumanize : handleFileHumanize}
                disabled={loading}
              >
                {loading ? '⏳ Processing…' : '✦ Humanize'}
              </button>
              {error && <span className="error">{error}</span>}
            </div>
          </div>

          {/* OUTPUT */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Output</span>
              <span className="char-count">
                {outputText ? `${wordCount(outputText)} words` : '—'}
              </span>
            </div>
            <textarea
              placeholder="Your humanized text will appear here…"
              value={outputText}
              readOnly
            />
            <div className="panel-footer">
              <div className="output-actions">
                <button
                  className={`btn-sm ${copied ? 'btn-copied' : ''}`}
                  onClick={copyOutput}
                  disabled={!outputText}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button className="btn-sm" onClick={downloadOutput} disabled={!outputText}>
                  ⬇ Download
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="tip">
          Tip: Use <b>Aggressive</b> mode for heavily AI-sounding text. Standard works best for lightly edited content.
        </p>
      </div>
    </div>
  );
}
