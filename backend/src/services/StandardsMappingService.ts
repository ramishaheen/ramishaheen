export class StandardsMappingService {
  mapCyberControls(): string[] {
    return [
      "NIST CSF: DE.CM (Security Continuous Monitoring)",
      "ISO 27001 Annex A.8 (Asset Management)",
      "ISO 27001 Annex A.12 (Operations Security)",
      "CIS Controls v8: 8 (Audit Log Management), 13 (Network Monitoring)",
      "COBIT: DSS05 (Manage Security Services)",
      "ISO 31000: Risk assessment and treatment"
    ];
  }
}
