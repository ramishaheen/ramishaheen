import { EvidenceRecord } from "../types/mythos.js";

export class VerificationService {
  verifyClaimSupport(evidence: EvidenceRecord[]): { supported: boolean; message?: string } {
    if (evidence.length === 0) {
      return {
        supported: false,
        message: "No verified evidence is available in the system for this request."
      };
    }

    return { supported: true };
  }
}
