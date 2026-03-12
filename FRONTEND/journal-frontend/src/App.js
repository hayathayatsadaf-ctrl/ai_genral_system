import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/login";
import Register from "./components/register";
import "./App.css";

function App() {

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);

  const API = "https://ai-genral-system.onrender.com";

  const loadEntries = async () => {
    const res = await axios.get(`${API}/api/journal/${user}`);
    setEntries(res.data);
  };

  const submitJournal = async () => {
    await axios.post(`${API}/api/journal`, {
      userId: user,
      ambience: "forest",
      text
    });
    setText("");
    loadEntries();
  };

  const loadInsights = async () => {
    const res = await axios.get(`${API}/api/journal/insights/${user}`);
    setInsights(res.data);
  };


  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  /* ── AUTH SCREENS ── */
  if (!user) {
    return (
      <div className="auth-wrapper">
        {showRegister ? (
          <>
            <Register setUser={setUser} />
            <p className="auth-toggle">
              Already have an account?
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <p className="auth-toggle">
              Don't have an account?
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  /* ── MAIN APP ── */
  return (
    <div className="container">

      {/* Header */}
      <header className="app-header">
        <div className="header-text">
          <h1 className="title">
            AI <span>Emotion</span> Journal
          </h1>
          <p className="header-tagline">your daily reflection space</p>
        </div>
        <button className="btn-logout" onClick={() => setUser(null)}>
          Logout
        </button>
      </header>

      {/* Write Journal */}
      <div className="journal-write-card">
        <p className="section-label">New Entry</p>
        <textarea
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today…"
        />
        <div className="submit-row">
          <button className="btn-submit" onClick={submitJournal}>
            Save Entry
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="entries-section">
        <p className="section-label">Past Entries</p>

        {entries.length === 0 ? (
          <p className="empty-entries">No entries yet. Start writing above.</p>
        ) : (
          entries.map((e) => (
            <div key={e._id} className="entry">
              <p className="entry-text">{e.text}</p>
              <div className="entry-meta">
                {e.emotion && (
                  <span className="entry-tag emotion">
                    ✦ {e.emotion}
                  </span>
                )}
                {e.keywords && e.keywords.length > 0 && (
                  <span className="entry-tag keywords">
                    {e.keywords.join("  ·  ")}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Insights */}
      <div className="insights-section">
        <p className="section-label">Insights</p>
        <button className="btn-insights" onClick={loadInsights}>
          ◎ &nbsp;Load Insights
        </button>

        {insights && (
          <div className="insights-card">
            <div className="insight-stat">
              <span className="stat-value">{insights.totalEntries}</span>
              <span className="stat-label">Total Entries</span>
            </div>
            <div className="insight-stat">
              <span className="stat-value">{insights.topEmotion}</span>
              <span className="stat-label">Top Emotion</span>
            </div>
            <div className="insight-stat">
              <span className="stat-value">{insights.mostUsedAmbience}</span>
              <span className="stat-label">Fav Ambience</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
