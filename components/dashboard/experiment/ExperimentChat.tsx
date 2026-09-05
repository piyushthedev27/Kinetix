"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Minus, Plus } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ExperimentChatProps {
  experimentTitle: string;
  experimentSummary: string;
  suggestedQuestions: string[];
}

export function ExperimentChat({ experimentTitle, experimentSummary, suggestedQuestions }: ExperimentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: `Hi! I'm Kinetix AI. Ask me anything about the "${experimentTitle}" experiment — how it works, why it behaves the way it does, or what to try next.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          experimentTitle,
          experimentSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error || "Sorry, I couldn't respond right now. Please try again." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't reach the AI assistant. Check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kx-chat-panel" data-minimized={minimized}>
      <div className="kx-chat-header">
        <div className="kx-chat-header-icon">
          <Sparkles size={16} />
        </div>
        <div className="kx-chat-header-text">
          <div className="kx-chat-header-title">Kinetix AI</div>
          <div className="kx-chat-header-subtitle">Your physics assistant</div>
        </div>
        <button type="button" className="kx-chat-minimize" onClick={() => setMinimized((v) => !v)} aria-label={minimized ? "Expand chat" : "Minimize chat"}>
          {minimized ? <Plus size={16} /> : <Minus size={16} />}
        </button>
      </div>

      {!minimized && (
        <>
          <div className="kx-chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className="kx-chat-bubble" data-role={m.role}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="kx-chat-bubble" data-role="assistant" data-loading="true">
                Thinking…
              </div>
            )}
          </div>

          {suggestedQuestions.length > 0 && (
            <div className="kx-chat-suggestions">
              {suggestedQuestions.map((q) => (
                <button key={q} type="button" className="kx-chat-suggestion-chip" onClick={() => send(q)} disabled={loading}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="kx-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              type="text"
              className="kx-chat-input"
              placeholder="Ask anything about this experiment…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="kx-chat-send" disabled={loading || !input.trim()} aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
