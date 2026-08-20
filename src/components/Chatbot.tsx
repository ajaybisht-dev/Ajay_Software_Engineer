import { useState } from "react";
import type { FormEvent } from "react";
import { Bot, Send, X } from "lucide-react";
import { sendChat } from "../api/portfolioApi";

type Message = { role: "user" | "assistant"; content: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi 👋 Ask me about Ajay's skills, experience, projects or tech stack."
    }
  ]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendChat(text);
      setMessages((m) => [...m, {
        role: "assistant",
        content: result.answer || "I don't have that information."
      }]);
    } catch {
      setMessages((m) => [...m, {
        role: "assistant",
        content: "Sorry, the portfolio assistant is temporarily unavailable."
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="chat-launcher" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Bot />} {open ? "Close" : "Ask Ajay AI"}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div><strong>AJAY AI</strong><small>Portfolio Assistant</small></div>
            <button onClick={() => setOpen(false)}><X /></button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="chat-message assistant">Thinking…</div>}
          </div>

          <form className="chat-input" onSubmit={submit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Ajay..."
            />
            <button type="submit"><Send /></button>
          </form>
        </div>
      )}
    </>
  );
}
