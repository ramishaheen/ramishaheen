export type ProviderConfig = {
  provider: "claude" | "gpt" | "gemini" | "deepseek" | "qwen" | "lmstudio" | "openrouter";
  model: string;
  enabled: boolean;
  privateMode?: boolean;
};

export class LLMProviderService {
  private providers: ProviderConfig[] = [];

  setProviders(configs: ProviderConfig[]) {
    this.providers = configs;
  }

  getProviders() {
    return this.providers;
  }

  selectForTask(task: "reasoning" | "cyber" | "summary" | "private"): ProviderConfig[] {
    const enabled = this.providers.filter((p) => p.enabled);
    if (task === "private") return enabled.filter((p) => p.privateMode || p.provider === "lmstudio");
    if (task === "summary") return enabled.slice(0, 1);
    if (task === "cyber") return enabled.filter((p) => ["gpt", "claude", "gemini"].includes(p.provider));
    return enabled;
  }
}
