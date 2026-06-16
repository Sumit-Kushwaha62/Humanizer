import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase.js';
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

  // Auth & History State
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = () => supabase.auth.signInWithOAuth({ 
    provider: 'google', 
    options: { redirectTo: 'https://humanizer-frontend-ji1t.onrender.com' } 
  });
  
  const handleLogout = () => supabase.auth.signOut();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    }
    setAuthLoading(false);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true); setAuthError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthError('Check your email to confirm your account!');
    }
    setAuthLoading(false);
  };

  const loadHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error) setHistory(data);
  };

  useEffect(() => {
    if (showHistory && user) loadHistory();
  }, [showHistory, user]);

  const saveToHistory = async (input, output, mode, stats) => {
    if (!user) return;
    await supabase.from('history').insert({
      user_id: user.id,
      input_text: input,
      output_text: output,
      mode: mode,
      score_before: stats.scoreBefore,
      score_after: stats.scoreAfter
    });
    if (showHistory) loadHistory();
  };

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
      saveToHistory(inputText, data.result, mode, data.stats);
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
      saveToHistory(`File: ${file.name}`, data.result, mode, data.stats);
    } catch {
      setError('File processing failed.');
    }
    setLoading(false);
  };

  const copyOutput = (text = outputText) => {
    navigator.clipboard.writeText(text);
    if (text === outputText) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadOutput = (text = outputText) => {
    const blob = new Blob([text], { type: 'text/plain' });
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
        <div className="header-actions">
          {user ? (
            <div className="user-info">
              <button className="btn-sm" onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? 'Close History' : 'History'}
              </button>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuthModal(true)}>Login / Sign Up</button>
          )}
          <div className="header-badge">Powered by Gemini AI</div>
        </div>
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

        {/* HISTORY PANEL */}
        {showHistory && (
          <div className="history-panel">
            <div className="panel-header">
              <span className="panel-title">Recent History</span>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <p className="no-history">No humanization history yet.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="history-item" onClick={() => { setOutputText(item.output_text); setShowHistory(false); }}>
                    <div className="history-meta">
                      <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
                      <span className={`badge-mode ${item.mode}`}>{item.mode}</span>
                      <span className="history-scores">
                        {item.score_before} → {item.score_after}
                      </span>
                    </div>
                    <div className="history-actions">
                      <button className="btn-sm" onClick={(e) => { e.stopPropagation(); copyOutput(item.output_text); }}>📋</button>
                      <button className="btn-sm" onClick={(e) => { e.stopPropagation(); downloadOutput(item.output_text); }}>⬇</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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
                  onClick={() => copyOutput()}
                  disabled={!outputText}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button className="btn-sm" onClick={() => downloadOutput()} disabled={!outputText}>
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

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <button className="auth-close" onClick={() => setShowAuthModal(false)}>✕</button>
            
            <div className="auth-tabs">
              <button 
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
              >
                Login
              </button>
              <button 
                className={`auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={authTab === 'login' ? handleEmailLogin : handleEmailSignup}>
              {authError && (
                <div className={`auth-error ${authError.includes('Check your email') ? 'success' : ''}`}>
                  {authError}
                </div>
              )}
              
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <button className="auth-submit-btn" type="submit" disabled={authLoading}>
                {authLoading ? '...' : (authTab === 'login' ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="auth-divider">— or —</div>

            <button className="auth-google-btn" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"></path><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"></path><path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"></path><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"></path></svg>
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
