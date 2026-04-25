import { ModeState } from "../types/mythos";

type Props = {
  mode: ModeState;
  onToggle: (key: keyof ModeState) => void;
};

type ModeMeta = {
  key: keyof ModeState;
  label: string;
  hint: string;
  icon: string;
};

const modeMeta: ModeMeta[] = [
  { key: "fastAnswer", label: "Fast Answer", hint: "Low-latency overview", icon: "⚡" },
  { key: "deepAnalysis", label: "Deep Analysis", hint: "Expanded structured reasoning", icon: "🧠" },
  { key: "cybersecurityReview", label: "Cybersecurity Review", hint: "Defensive cyber implications", icon: "🛡️" },
  { key: "executiveAdvisory", label: "Executive Advisory", hint: "Board-level language", icon: "📈" },
  { key: "evidenceFirstMode", label: "Evidence-First", hint: "Strict source-backed output", icon: "📚" },
  { key: "contradictionChallenge", label: "Contradiction", hint: "Challenge assumptions", icon: "🔎" }
];

export function ModeToggle({ mode, onToggle }: Props) {
  return (
    <section className="panel mode-panel">
      <div className="panel-header">
        <h3>Deep Thinking Modes</h3>
        <span className="pill">Adaptive Orchestration</span>
      </div>
      <div className="mode-grid">
        {modeMeta.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`mode-card ${mode[item.key] ? "active" : ""}`}
            onClick={() => onToggle(item.key)}
            aria-pressed={mode[item.key]}
          >
            <div className="mode-title">
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
            </div>
            <small>{item.hint}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
