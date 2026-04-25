import { ModeState, MythosResponse } from "../types/mythos";

const API_ROOT = import.meta.env.VITE_API_ROOT ?? "http://localhost:8080/api/mythos";

export async function submitMythosQuery(question: string, mode: ModeState): Promise<MythosResponse> {
  const response = await fetch(`${API_ROOT}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      userId: "interactive-user",
      mode,
      urgency: "medium"
    })
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
