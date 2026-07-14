# ravin

## Resume chat widget

Component: `components/ui/ResumeChatWidget.tsx`. Connected to the real backend via
`NEXT_PUBLIC_RESUME_CHAT_API_URL` in `.env` (base URL only, e.g.
`https://ravin-assistant-backend-1.onrender.com`) — the widget POSTs to
`${NEXT_PUBLIC_RESUME_CHAT_API_URL}/api/public/ask` with `{ "question": string }`
and reads `{ success, answer }` from the RAG backend (Express + pgvector +
Gemini 2.5 Flash). See `.env.example` for the full contract. If the env var is
unset, requests fall back to the local placeholder at `app/api/resume-chat/route.ts`.

`lib/resumeChat.ts` calls the same endpoint with `Accept: text/event-stream`;
the backend responds with SSE (`event: chunk` / `data: {"delta": string}`,
terminated by `event: done` / `data: { success, question, answer, audio }`), and
the UI renders each delta into the assistant bubble as it arrives. If a
response isn't `text/event-stream` (e.g. the local placeholder route), it
transparently falls back to parsing a single JSON body instead.