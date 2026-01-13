import React, { useState } from "react";
import SafeImage from "../../components/SafeImage";
import { useNavigate } from "react-router-dom";
import { Send, Moon, Sun, ChevronLeft, Home, Settings } from "lucide-react";
import axios from "axios";

/* ================= Landing Page ================= */

const LandingPage = ({ onStartChat }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center z-0"
        style={{
          backgroundImage: `url('/img/chatai.jpg')`,
          backgroundPosition: "50% 65%",
        }}
      />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">

          <div className="absolute top-8 left-8 z-30">
            <div className=" bg-gradient-to-r from-[#46B6BD] to-[#205457] text-white px-4 py-2 rounded-lg shadow-md">
              Hi! I will help you
            </div>
          </div>

          <div className="absolute top-6 right-6 z-30">
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">◐</button>
          </div>

          <div className="absolute right-6 top-24 md:top-20 md:right-20 z-20">
            <SafeImage
              src="/img/chatai2.png"
              alt="AI Assistant"
              type="profile"
              className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
            />
          </div>

          <div className="mt-24 md:mt-20">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#46B6BD] to-[#205457] bg-clip-text text-transparent">Your AI Assistant</h1>
            <p className="text-xl text-black/90 mb-6">Experience Smart & Secure AI chat</p>

            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
              <span className="inline-flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-full">
                <span className="w-6 h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold">✓</span>
                Smart Conversations
              </span>
              <span className="inline-flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-full">
                <span className="w-6 h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold">✓</span>
                Instant Responses
              </span>
              <span className="inline-flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-full">
                <span className="w-6 h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold">✓</span>
                Secure & Private
              </span>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={onStartChat}
                className="bg-teal-600 text-white px-8 py-3 rounded-full text-lg flex items-center gap-3 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1h-3.586l-2 2H5a1 1 0 01-1-1V3z" clipRule="evenodd" />
                </svg>
                Start Chat
              </button>
            </div>
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
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-200"}`}>
      <div className="px-6 py-4 flex justify-between items-center bg-white shadow-md">
        <div className="flex items-center  gap-3">
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
                  ? " bg-gradient-to-r from-[#46B6BD] to-[#205457] text-white"
                  : "bg-white text-gray-800 shadow"
                }`}
            >
              {m.text}
              <div className="text-xs opacity-60 mt-1">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 shadow-lg px-6 py-4 bg-white">
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
            className="w-12 h-12  bg-gradient-to-r from-[#46B6BD] to-[#205457] rounded-full flex items-center justify-center"
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