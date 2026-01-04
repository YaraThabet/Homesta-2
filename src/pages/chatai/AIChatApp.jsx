import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Moon, Sun, ChevronLeft, Home, Settings } from "lucide-react";
import axios from "axios";

/* ================= Landing Page ================= */

const LandingPage = ({ onStartChat }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url('/img/chatai.jpg')`,
          backgroundPosition: "50% 65%",
        }}
      />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="absolute top-20 right-8 md:right-20">
            <img
              src="/img/chatai2.png"
              alt="AI Assistant"
              className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl"
            />
          </div>

          <div className="absolute top-8 left-8 flex gap-4 z-20">
            <button
              onClick={() => navigate("/")}
              className="bg-white/10 p-3 rounded-full text-white"
            >
              <Home size={24} />
            </button>
            <button
              onClick={() => navigate("/chatai")}
              className="bg-white/10 p-3 rounded-full text-white"
            >
              <Settings size={24} />
            </button>
          </div>

          <div className="text-center mb-12 mt-32 md:mt-20">
            <h1 className="text-5xl font-bold text-white mb-4">
              Your AI Assistant
            </h1>
            <p className="text-xl text-white/90">
              Experience Smart & Secure AI chat
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={onStartChat}
              className="bg-teal-600 text-white px-8 py-4 rounded-full text-lg"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= Chat Page ================= */

const ChatPage = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isDarkMode,
  setIsDarkMode,
  onBackToLanding,
  isSending,
}) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLanding}>
            <ChevronLeft />
          </button>
          <button onClick={() => navigate("/")}>
            <Home />
          </button>
          <span className="font-bold">AI Assistant</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => navigate("/chatai")}>
            <Settings />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 mb-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-md ${m.sender === "user"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-800 shadow"
                }`}
            >
              {m.text}
              <div className="text-xs opacity-60 mt-1">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t px-6 py-4 bg-white">
        <div className="max-w-5xl mx-auto flex gap-3">
          <input
            value={inputMessage}
            disabled={isSending}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-6 py-3 rounded-full bg-gray-100"
            placeholder="Ask anything..."
          />
          <button
            disabled={isSending}
            onClick={handleSendMessage}
            className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center"
          >
            <Send className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= Main App ================= */

const AIChatApp = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage;
    setInputMessage("");
    setIsSending(true);

    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: crypto.randomUUID(),
      text: userText,
      sender: "user",
      time,
    };

    const botId = crypto.randomUUID();
    const botMsg = {
      id: botId,
      text: "...",
      sender: "bot",
      time,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    try {
      const resp = await axios.post(
        "https://tasabehahmed-chatbot-bert.hf.space/chat",
        null,
        { params: { message: userText }, timeout: 15000 }
      );

      const reply = resp?.data?.answer || "لم يتم العثور على رد.";

      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: reply } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: "حدث خطأ في الاتصال." } : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  return currentPage === "landing" ? (
    <LandingPage onStartChat={() => setCurrentPage("chat")} />
  ) : (
    <ChatPage
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      handleSendMessage={handleSendMessage}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      onBackToLanding={() => setCurrentPage("landing")}
      isSending={isSending}
    />
  );
};

export default AIChatApp;