export type DeepThinkingMode = {
  fastAnswer: boolean;
  deepAnalysis: boolean;
  cybersecurityReview: boolean;
  executiveAdvisory: boolean;
  evidenceFirstMode: boolean;
  contradictionChallenge: boolean;
};

export type QueryRequest = {
  question: string;
  userId: string;
  mode: DeepThinkingMode;
  domainHint?: string;
  urgency?: "low" | "medium" | "high" | "critical";
};

export type EvidenceRecord = {
  id: string;
  sourceType: "document" | "log" | "database" | "tool";
  sourceName: string;
  reference: string;
  timestamp: string;
  summary: string;
};

export type AgentRun = {
  agent: string;
  status: "completed" | "skipped" | "blocked";
  notes: string;
};

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type MythosResponse = {
  queryId: string;
  executiveSummary: string;
  deepAnalysis: string[];
  evidenceUsed: EvidenceRecord[];
  cybersecurityImplications: string[];
  risks: {
    level: RiskLevel;
    rationale: string;
  };
  recommendations: string[];
  confidenceScore: number;
  missingData: string[];
  assumptions: string[];
  activeAgents: AgentRun[];
  evidenceAvailability: "available" | "partial" | "none";
};
