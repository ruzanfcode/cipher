import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Zap } from "lucide-react";
import { AI_RESPONSES } from "@/data/mockData";
import { cx } from "@/app/lib/utils";

interface ChatMsg { id: number; role: "user" | "assistant"; text: string }

export function FloatingAIChat({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, role: "assistant", text: "Hi! I'm your CIPHER AI Assistant. Ask me about sentiment trends, attribute drivers, or product comparisons." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!visible) setOpen(false); }, [visible]);

  const send = () => {
    if (!input.trim() || typing) return;
    const userMsg: ChatMsg = { id: Date.now(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)] }]);
      setTyping(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, 900);
  };

  if (!visible) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden" style={{ height: 440 }}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0 bg-card">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center"><Zap size={13} className="text-primary" /></div>
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">AI Assistant</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={cx("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
                <div className={cx("w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5", msg.role === "assistant" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground")}>
                  {msg.role === "assistant" ? <Zap size={11} /> : "Y"}
                </div>
                <div className={cx("max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed", msg.role === "assistant" ? "bg-background border border-border text-foreground rounded-tl-sm" : "bg-primary text-white rounded-tr-sm")}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5"><Zap size={11} className="text-primary" /></div>
                <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-background border border-border flex gap-1 items-center">
                  {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-border shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask about sentiment..."
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
              />
              <button onClick={send} disabled={!input.trim() || typing} className="px-3 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition-all disabled:opacity-40">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className={cx(
          "fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
          open ? "bg-foreground text-background scale-95" : "bg-primary text-white hover:scale-110 hover:shadow-primary/30"
        )}
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
      </button>
    </>
  );
}
