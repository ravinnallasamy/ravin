export type ResumeChatResponse = {
  answer: string;
};

type AskApiSuccess = {
  success: true;
  question: string;
  answer: string;
  audio: string | null;
};

type AskApiError = {
  error: string;
};

export const RESUME_CHAT_OPEN_EVENT = 'resume-chat:open';

export function openResumeChat() {
  window.dispatchEvent(new Event(RESUME_CHAT_OPEN_EVENT));
}

function resumeChatEndpoint() {
  const base = process.env.NEXT_PUBLIC_RESUME_CHAT_API_URL;
  return base ? `${base.replace(/\/$/, '')}/api/public/ask` : '/api/resume-chat';
}

/**
 * Base URL of the resume-chat backend, e.g. https://ravin-assistant-backend-1.onrender.com
 * Configure it via NEXT_PUBLIC_RESUME_CHAT_API_URL (see .env.example).
 * Falls back to the local placeholder route if unset.
 */
export async function askResumeChat(question: string): Promise<ResumeChatResponse> {
  const res = await fetch(resumeChatEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  const data = (await res.json().catch(() => null)) as AskApiSuccess | AskApiError | null;

  if (!res.ok || !data || !('success' in data) || !data.success) {
    const message = data && 'error' in data ? data.error : `Resume chat request failed with status ${res.status}`;
    throw new Error(message);
  }

  return { answer: data.answer };
}

/**
 * Streaming variant. The backend emits SSE (`event: chunk` / `data: {"delta": string}`)
 * when the request sends `Accept: text/event-stream`, ending with
 * `event: done` / `data: { success, question, answer, audio }`.
 * Falls back to a non-streaming call if the backend doesn't respond with a stream
 * (e.g. the local placeholder route, or a non-2xx response).
 */
export async function askResumeChatStream(
  question: string,
  onDelta: (deltaText: string) => void,
): Promise<ResumeChatResponse> {
  const res = await fetch(resumeChatEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ question }),
  });

  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as AskApiError | null;
    throw new Error(data?.error || `Resume chat request failed with status ${res.status}`);
  }

  if (!contentType.includes('text/event-stream') || !res.body) {
    const data = (await res.json().catch(() => null)) as AskApiSuccess | AskApiError | null;
    if (!data || !('success' in data) || !data.success) {
      throw new Error(data && 'error' in data ? data.error : 'Resume chat request failed');
    }
    onDelta(data.answer);
    return { answer: data.answer };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalAnswer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const eventMatch = frame.match(/^event: (.+)$/m);
      const dataMatch = frame.match(/^data: (.+)$/m);
      if (!dataMatch) continue;

      const eventName = eventMatch?.[1]?.trim();
      const payload = JSON.parse(dataMatch[1]) as { delta?: string } & Partial<AskApiSuccess>;

      if (eventName === 'chunk' && payload.delta) {
        onDelta(payload.delta);
      } else if (eventName === 'done' && payload.answer) {
        finalAnswer = payload.answer;
      }
    }
  }

  return { answer: finalAnswer };
}
