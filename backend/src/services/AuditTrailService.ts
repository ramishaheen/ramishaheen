export type AuditEvent = {
  timestamp: string;
  actor: string;
  action: string;
  metadata: Record<string, unknown>;
};

export class AuditTrailService {
  private events: AuditEvent[] = [];

  record(event: AuditEvent) {
    this.events.push(event);
  }

  all() {
    return this.events;
  }
}
