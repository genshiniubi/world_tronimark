import type {
  AiCompletionResponse,
  AiExplainResponse,
  AiReview,
  BootstrapResponse,
  DashboardData,
  FileMap,
  HealthInfo,
  Language,
  Note,
  ProblemDetail,
  ProblemSummary,
  SitePage,
  SubmissionResult,
  TrackDetail,
  TrackSummary,
} from '@codelab/shared';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });
  if (!response.ok) {
    let message = `请求失败 (${response.status})`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const api = {
  bootstrap: () => request<BootstrapResponse>('/api/bootstrap'),
  dashboard: () => request<DashboardData>('/api/dashboard'),
  tracks: () => request<TrackSummary[]>('/api/tracks'),
  track: (trackId: string) => request<TrackDetail>(`/api/tracks/${trackId}`),
  problems: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{
      items: ProblemSummary[];
      knowledgePoints: Array<{ id: string; title: string; description: string }>;
    }>(`/api/problems${query}`);
  },
  problem: (problemId: string) => request<ProblemDetail>(`/api/problems/${problemId}`),
  run: (body: {
    problemId: string;
    language: Language;
    files: FileMap;
    stdin: string;
  }) =>
    request<{
      verdict: string;
      compileOutput: string;
      stdout: string;
      stderr: string;
      exitCode: number | null;
      timeMs: number;
      timedOut: boolean;
      outputTruncated: boolean;
    }>('/api/run', { method: 'POST', body: JSON.stringify(body) }),
  submit: (body: { problemId: string; language: Language; files: FileMap }) =>
    request<SubmissionResult>('/api/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  debug: (body: {
    problemId: string;
    language: Language;
    files: FileMap;
    stdin: string;
  }) =>
    request<
      | {
          kind: 'trace';
          steps: Array<{ line: number; locals: Record<string, string> }>;
          stdout: string;
          stderr: string;
          error: string | null;
          timedOut: boolean;
        }
      | {
          kind: 'run';
          message: string;
          result: {
            verdict: string;
            compileOutput: string;
            stdout: string;
            stderr: string;
            timeMs: number;
          };
        }
    >('/api/debug', { method: 'POST', body: JSON.stringify(body) }),
  aiComplete: (body: {
    problemId?: string;
    language: Language;
    code: string;
    cursor: number;
    prefix: string;
  }) =>
    request<AiCompletionResponse>('/api/ai/complete', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  aiExplain: (body: {
    problemId?: string;
    language: Language;
    selectedText: string;
    context: string;
    question?: string;
  }) =>
    request<AiExplainResponse>('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  aiReview: (body: {
    problemId: string;
    language: Language;
    files: FileMap;
    submissionId: number;
  }) =>
    request<AiReview>('/api/ai/review', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  notes: (problemId?: string) =>
    request<Note[]>(`/api/notes${problemId ? `?problemId=${encodeURIComponent(problemId)}` : ''}`),
  createNote: (body: { problemId?: string | null; title: string; content: string }) =>
    request<Note>('/api/notes', { method: 'POST', body: JSON.stringify(body) }),
  updateNote: (noteId: number, body: { title: string; content: string }) =>
    request<Note>(`/api/notes/${noteId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteNote: (noteId: number) =>
    request<{ ok: boolean }>(`/api/notes/${noteId}`, { method: 'DELETE' }),
  sitePage: (slug: string) => request<SitePage>(`/api/site/${slug}`),
  contact: (body: { name: string; contact: string; message: string }) =>
    request<{ ok: boolean; id: number }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  health: () => request<HealthInfo>('/api/health'),
  updateProfile: (displayName: string) =>
    request<{ id: string; displayName: string }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ displayName }),
    }),
};

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export function downloadProgress(): void {
  window.location.href = '/api/progress/export';
}
