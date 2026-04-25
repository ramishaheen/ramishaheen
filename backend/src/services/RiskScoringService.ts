import { RiskLevel } from "../types/mythos.js";

export class RiskScoringService {
  fromSignal(signalCount: number, hasCyberFindings: boolean): { level: RiskLevel; rationale: string } {
    if (hasCyberFindings && signalCount > 5) {
      return { level: "Critical", rationale: "Multiple cybersecurity findings with broad impact indicators." };
    }
    if (hasCyberFindings || signalCount > 3) {
      return { level: "High", rationale: "Material risk indicators are present and require escalation." };
    }
    if (signalCount > 0) {
      return { level: "Medium", rationale: "Limited verified evidence exists; maintain monitoring and controls." };
    }
    return { level: "Low", rationale: "No verified evidence currently indicates active risk." };
  }
}
