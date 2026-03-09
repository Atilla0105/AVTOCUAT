import { AIProvider } from "@/types/ai";
import { createClaudeProvider } from "./claude";
import { createOpenAIProvider } from "./openai";

export function createAIProvider(
  provider: "claude" | "openai",
  apiKey: string
): AIProvider {
  switch (provider) {
    case "claude":
      return createClaudeProvider(apiKey);
    case "openai":
      return createOpenAIProvider(apiKey);
    default:
      throw new Error(`未知的AI提供者: ${provider}`);
  }
}

export function extractJSON(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return text;
}
