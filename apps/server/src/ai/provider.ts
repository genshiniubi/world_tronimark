import { config, aiConfigured } from '../config.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiChatOptions {
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

export function isAiConfigured(): boolean {
  return aiConfigured;
}

export function aiStatus() {
  return {
    enabled: config.ai.enabled,
    configured: aiConfigured,
    provider: aiConfigured ? new URL(config.ai.baseUrl).host : 'local-fallback',
    model: config.ai.model || 'not-set',
    features: {
      completion: aiConfigured,
      explain: aiConfigured,
      review: aiConfigured,
    },
    fallback: !aiConfigured,
  };
}

export async function chat(
  messages: ChatMessage[],
  options: AiChatOptions = {},
): Promise<string> {
  if (!aiConfigured) throw new Error('AI_NOT_CONFIGURED');
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? config.ai.timeoutMs,
  );
  try {
    const response = await fetch(`${config.ai.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(config.ai.apiKey ? { authorization: `Bearer ${config.ai.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1200,
        ...(options.json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`AI_HTTP_${response.status}: ${body.slice(0, 300)}`);
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI_EMPTY_RESPONSE');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

export function parseJsonObject<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() || trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('AI_INVALID_JSON');
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
