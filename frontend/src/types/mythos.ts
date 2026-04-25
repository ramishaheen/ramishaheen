export type ModeState = {
  fastAnswer: boolean;
  deepAnalysis: boolean;
  cybersecurityReview: boolean;
  executiveAdvisory: boolean;
  evidenceFirstMode: boolean;
  contradictionChallenge: boolean;
};

export type MythosResponse = {
  queryId: string;
  executiveSummary: string;
  deepAnalysis: string[];
  evidenceUsed: Array<{
    id: string;
    sourceType: string;
    sourceName: string;
    reference: string;
    timestamp: string;
    summary: string;
  }>;
  cybersecurityImplications: string[];
  risks: { level: "Low" | "Medium" | "High" | "Critical"; rationale: string };
  recommendations: string[];
  confidenceScore: number;
  missingData: string[];
  assumptions: string[];
  activeAgents: Array<{ agent: string; status: string; notes: string }>;
  evidenceAvailability: "available" | "partial" | "none";
};
