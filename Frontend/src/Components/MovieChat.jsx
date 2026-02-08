// frontend/src/Components/MovieChat.jsx
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaComments, FaTimes } from "react-icons/fa";

export default function MovieChat({ movieContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi. I am Ovi, your MovieHub movie assistant. Ask me anything about "${movieContext.title}" such as plot, characters, themes, or interesting trivia.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_LINK}/api/chat/movie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // match the backend controller:
            question: trimmed,
            movieContext, // short for movieContext: movieContext
          }),
        }
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I am sorry, I could not generate a response right now.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while contacting the movie assistant. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-gradient-to-r from-[#7A0000] to-[#A00000] text-white shadow-lg hover:shadow-[0_0_12px_#FF0000] px-4 py-3 flex items-center gap-2"
        >
          <FaComments />
          <span className="hidden sm:inline text-sm font-semibold">
            Ask about this movie
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="
            fixed bottom-4 right-4 z-50
            w-[90vw] max-w-md
            bg-[#101010] border border-gray-800 rounded-2xl shadow-2xl
            flex flex-col
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#151515] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#7A0000] to-[#A00000] flex items-center justify-center">
                <FaRobot className="text-xs text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-100">
                  Ovi
                </span>
                <span className="text-[11px] text-gray-400">
                  Talking about {movieContext.title}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-400 transition"
              aria-label="Close chat"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="px-3 pt-3 pb-2 h-64 overflow-y-auto space-y-3 bg-[#050505]">
            <p className="text-[11px] text-gray-400 px-1">
              I use details from this page (title, cast, overview, ratings, and
              more) to answer your questions about{" "}
              <span className="font-semibold text-gray-200">
                {movieContext.title}
              </span>
              .
            </p>

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#7A0000] to-[#A00000] text-white"
                      : "bg-[#1a1a1a] text-gray-100 border border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] opacity-80">
                    {m.role === "user" ? (
                      <>
                        <FaUser />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <FaRobot />
                        <span>OvieHub AI</span>
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-[11px] text-gray-400 italic mt-1 px-1">
                Thinking about {movieContext.title}…
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-2 border-t border-gray-800 bg-[#101010] rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask something about "${movieContext.title}"...`}
              className="flex-1 px-3 py-2 rounded-lg bg-[#151515] border border-gray-700 text-xs sm:text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold ${
                loading || !input.trim()
                  ? "bg-[#333] text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7A0000] to-[#A00000] text-white hover:from-[#A00000] hover:to-[#C00000] hover:shadow-[0_0_10px_#FF0000]"
              }`}
            >
              <FaPaperPlane size={11} />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
