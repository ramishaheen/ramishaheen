import { useMemo, useState } from "react";
import { submitMythosQuery } from "./api/mythos";
import { ModeToggle } from "./components/ModeToggle";
import { ModeState, MythosResponse } from "./types/mythos";

const defaultMode: ModeState = {
  fastAnswer: false,
  deepAnalysis: true,
  cybersecurityReview: true,
  executiveAdvisory: true,
  evidenceFirstMode: true,
  contradictionChallenge: true
};

type ViewTab = "overview" | "analysis" | "watchtower";

function scoreTone(score: number): "low" | "medium" | "high" {
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
}

export function App() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<ModeState>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MythosResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");

  const toggleMode = (key: keyof ModeState) => {
    setMode((current) => ({ ...current, [key]: !current[key] }));
  };

  const runQuery = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await submitMythosQuery(question, mode);
      setResult(response);
      setActiveTab("overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const confidenceTone = scoreTone(result?.confidenceScore ?? 0);
  const evidenceScore = useMemo(() => {
    if (!result) return 0;
    if (result.evidenceAvailability === "available") return 90;
    if (result.evidenceAvailability === "partial") return 55;
    return 10;
  }, [result]);

  return (
    <main className="mythos-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <header className="hero panel">
        <div>
          <h1>Mythos Intelligence System</h1>
          <p>
            Multi-agent intelligence orchestration with a permanent defensive cybersecurity core,
            evidence verification, contradiction checks, and executive-grade decision support.
          </p>
        </div>
        <div className="hero-badges">
          <span className="pill">Evidence-First</span>
          <span className="pill">Defensive Cyber</span>
          <span className="pill">Auditable Output</span>
        </div>
      </header>

      <section className="command-grid">
        <article className="panel command-center">
          <div className="panel-header">
            <h3>Mythos Command Center</h3>
            <span className="pill pulse">Live Orchestration</span>
          </div>

          <textarea
            value={question}
            placeholder="Ask strategic, investigative, cybersecurity, operations, or executive decision questions..."
            onChange={(event) => setQuestion(event.target.value)}
          />

          <div className="command-row">
            <small>{question.length} characters</small>
            <button disabled={loading || question.length < 5} onClick={runQuery}>
              {loading ? "Running Mythos Pipeline..." : "Run Intelligence Query"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </article>

        <article className="panel score-stack">
          <h3>Mission Telemetry</h3>
          <div className="metric-card">
            <span>Confidence Score</span>
            <strong className={`tone-${confidenceTone}`}>{result ? `${result.confidenceScore}%` : "--"}</strong>
          </div>
          <div className="metric-card">
            <span>Evidence Completeness</span>
            <div className="meter">
              <div className="meter-fill" style={{ width: `${evidenceScore}%` }} />
            </div>
            <small>{result ? `${evidenceScore}%` : "No query yet"}</small>
          </div>
          <div className="metric-card">
            <span>Risk Level</span>
            <strong>{result?.risks.level ?? "Pending"}</strong>
            <small>{result?.risks.rationale ?? "Run a query to evaluate risk."}</small>
          </div>
        </article>
      </section>

      <ModeToggle mode={mode} onToggle={toggleMode} />

      <nav className="tab-row panel">
        <button className={activeTab === "overview" ? "tab active" : "tab"} onClick={() => setActiveTab("overview")}>Overview</button>
        <button className={activeTab === "analysis" ? "tab active" : "tab"} onClick={() => setActiveTab("analysis")}>Deep Analysis</button>
        <button className={activeTab === "watchtower" ? "tab active" : "tab"} onClick={() => setActiveTab("watchtower")}>Cyber Watchtower</button>
      </nav>

      {activeTab === "overview" && (
        <section className="results-grid">
          <article className="panel">
            <h3>Executive Summary</h3>
            <p className="empty">{result?.executiveSummary ?? "No executive package generated yet."}</p>
            <h4>Recommendations</h4>
            <ul>
              {(result?.recommendations ?? ["No recommendations available until a query is executed."]).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h3>Agent Activity Panel</h3>
            {!result ? (
              <p className="empty">Agents will appear after execution.</p>
            ) : (
              <ul className="agent-list">
                {result.activeAgents.map((a) => (
                  <li key={a.agent}>
                    <div>
                      <strong>{a.agent}</strong>
                      <small>{a.notes}</small>
                    </div>
                    <span className={`status ${a.status}`}>{a.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      )}

      {activeTab === "analysis" && (
        <section className="results-grid">
          <article className="panel">
            <h3>Deep Analysis</h3>
            {!result ? (
              <p className="empty">No decomposition generated yet.</p>
            ) : (
              <ol>
                {result.deepAnalysis.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            )}
          </article>

          <article className="panel">
            <h3>Evidence Panel</h3>
            {!result ? (
              <p className="empty">No evidence to display.</p>
            ) : result.evidenceUsed.length === 0 ? (
              <p className="empty">Data source not connected.</p>
            ) : (
              <ul>
                {result.evidenceUsed.map((e) => (
                  <li key={e.id}>
                    <strong>{e.sourceName}</strong>
                    <small>{e.reference}</small>
                  </li>
                ))}
              </ul>
            )}

            <h4>Assumptions</h4>
            <ul>
              {(result?.assumptions ?? ["No assumptions available until query execution."]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h4>Missing Data</h4>
            <ul>
              {(result?.missingData ?? ["No missing-data analysis yet."]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {activeTab === "watchtower" && (
        <section className="results-grid">
          <article className="panel">
            <h3>Autonomous Cybersecurity Watchtower</h3>
            {!result ? (
              <p className="empty">Awaiting telemetry feed.</p>
            ) : (
              <ul>
                {result.cybersecurityImplications.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </article>

          <article className="panel">
            <h3>Decision Intelligence Panel</h3>
            <p><strong>Recommended Decision:</strong> {result?.recommendations[0] ?? "Not available"}</p>
            <p><strong>Pros/Cons:</strong> Use contradiction mode to challenge risks before execution.</p>
            <p><strong>Escalation:</strong> High/Critical outcomes require authorized human approval.</p>
            <p><strong>Evidence Availability:</strong> {result?.evidenceAvailability ?? "unknown"}</p>
          </article>
        </section>
      )}

      <footer className="panel footer-panel">
        <h3>Admin Settings</h3>
        <p className="empty">
          Configure LLM providers, encrypted API keys, connector health checks, role permissions, and escalation workflows via secured admin APIs.
        </p>
      </footer>
    </main>
  );
}
