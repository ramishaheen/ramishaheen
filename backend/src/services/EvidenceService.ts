import { EvidenceRecord, QueryRequest } from "../types/mythos.js";

export class EvidenceService {
  async retrieveEvidence(_query: QueryRequest): Promise<EvidenceRecord[]> {
    // Production integration point: database/doc store/SIEM connectors.
    // No fake data is returned by design.
    return [];
  }

  evidenceCompleteness(evidence: EvidenceRecord[]): number {
    if (evidence.length === 0) return 0;
    if (evidence.length < 3) return 40;
    if (evidence.length < 7) return 70;
    return 90;
  }
}
