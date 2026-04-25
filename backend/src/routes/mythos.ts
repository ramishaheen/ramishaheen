import { Router } from "express";
import { z } from "zod";
import { OrchestrationService } from "../services/OrchestrationService.js";
import { ReasoningService } from "../services/ReasoningService.js";
import { EvidenceService } from "../services/EvidenceService.js";
import { VerificationService } from "../services/VerificationService.js";
import { CybersecurityService } from "../services/CybersecurityService.js";
import { RiskScoringService } from "../services/RiskScoringService.js";
import { AuditTrailService } from "../services/AuditTrailService.js";
import { LLMProviderService } from "../services/LLMProviderService.js";
import { requireAdmin } from "../middleware/auth.js";

const querySchema = z.object({
  question: z.string().min(5),
  userId: z.string().min(1),
  domainHint: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "critical"]).optional(),
  mode: z.object({
    fastAnswer: z.boolean(),
    deepAnalysis: z.boolean(),
    cybersecurityReview: z.boolean(),
    executiveAdvisory: z.boolean(),
    evidenceFirstMode: z.boolean(),
    contradictionChallenge: z.boolean()
  })
});

const providerSchema = z.object({
  providers: z.array(z.object({
    provider: z.enum(["claude", "gpt", "gemini", "deepseek", "qwen", "lmstudio", "openrouter"]),
    model: z.string().min(1),
    enabled: z.boolean(),
    privateMode: z.boolean().optional()
  }))
});

const agentSettingsSchema = z.object({
  permissions: z.record(z.string(), z.array(z.string())),
  escalationWorkflow: z.array(z.string())
});

const auditTrail = new AuditTrailService();
const llmProviderService = new LLMProviderService();
const orchestration = new OrchestrationService(
  new ReasoningService(),
  new EvidenceService(),
  new VerificationService(),
  new CybersecurityService(),
  new RiskScoringService(),
  auditTrail
);

const queryStore = new Map<string, unknown>();
let agentSettings: z.infer<typeof agentSettingsSchema> = {
  permissions: {},
  escalationWorkflow: []
};

export const mythosRouter = Router();

mythosRouter.post("/query", async (req, res) => {
  const parsed = querySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const result = await orchestration.run(parsed.data);
  queryStore.set(result.queryId, result);
  return res.status(200).json(result);
});

mythosRouter.get("/query/:id", (req, res) => {
  const record = queryStore.get(req.params.id);
  if (!record) return res.status(404).json({ message: "Query not found." });
  return res.status(200).json(record);
});

mythosRouter.get("/history", (_req, res) => {
  return res.status(200).json(Array.from(queryStore.values()));
});

mythosRouter.get("/evidence/:queryId", (req, res) => {
  const record = queryStore.get(req.params.queryId) as { evidenceUsed?: unknown[] } | undefined;
  if (!record) return res.status(404).json({ message: "Query not found." });
  return res.status(200).json({ evidence: record.evidenceUsed ?? [] });
});

mythosRouter.get("/agents/status", (_req, res) => {
  return res.status(200).json({
    orchestrator: "online",
    agents: [
      "Orchestrator Agent",
      "General Reasoning Agent",
      "Cybersecurity Agent",
      "Evidence Verification Agent",
      "Contradiction Agent",
      "Risk Analysis Agent",
      "Standards & Compliance Agent",
      "Executive Summary Agent",
      "Memory & Learning Agent"
    ]
  });
});

mythosRouter.get("/cyber/alerts", (_req, res) => {
  return res.status(200).json({ message: "Data source not connected.", alerts: [] });
});

mythosRouter.get("/cyber/findings", (_req, res) => {
  return res.status(200).json({ message: "Data source not connected.", findings: [] });
});

mythosRouter.get("/risk/dashboard", (_req, res) => {
  return res.status(200).json({
    totalQueries: queryStore.size,
    highRiskCount: Array.from(queryStore.values()).filter(
      (q) => typeof q === "object" && q !== null && "risks" in q && (q as { risks: { level: string } }).risks.level === "High"
    ).length
  });
});

mythosRouter.post("/settings/llm-provider", requireAdmin, (req, res) => {
  const parsed = providerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  llmProviderService.setProviders(parsed.data.providers);
  auditTrail.record({
    timestamp: new Date().toISOString(),
    actor: "admin",
    action: "settings.llm_provider.updated",
    metadata: { count: parsed.data.providers.length }
  });

  return res.status(200).json({ providers: llmProviderService.getProviders() });
});

mythosRouter.post("/settings/agents", requireAdmin, (req, res) => {
  const parsed = agentSettingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  agentSettings = parsed.data;
  auditTrail.record({
    timestamp: new Date().toISOString(),
    actor: "admin",
    action: "settings.agents.updated",
    metadata: { agentsConfigured: Object.keys(parsed.data.permissions).length }
  });

  return res.status(200).json(agentSettings);
});

mythosRouter.get("/audit-trail", requireAdmin, (_req, res) => {
  return res.status(200).json(auditTrail.all());
});
