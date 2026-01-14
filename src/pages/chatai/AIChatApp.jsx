import React, { useState } from "react";
import SafeImage from "../../components/SafeImage";
import { useNavigate } from "react-router-dom";
import { Send, Moon, Sun, ChevronLeft, Home, Settings, ArrowLeft } from "lucide-react";
import axios from "axios";

/* ================= Landing Page ================= */

const LandingPage = ({ onStartChat }) => {
  const navigate = useNavigate();
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full text-center">

          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-30">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/90 px-3 sm:px-4 py-2 rounded-lg shadow-md hover:bg-white transition-colors text-gray-800 text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="m15 18-6-6 6-6" /></svg>
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="mt-3 sm:mt-4 bg-gradient-to-r from-[#46B6BD] to-[#205457] text-white px-3 sm:px-4 py-2 rounded-lg shadow-md inline-block text-sm sm:text-base">
              Hi! I will help you
            </div>
          </div>

          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30">
            <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center shadow text-lg sm:text-xl">◐</button>
          </div>

          <div className="absolute right-4 top-20 sm:top-24 md:top-20 md:right-20 z-20">
            <SafeImage
              src="/img/chatai2.png"
              alt="AI Assistant"
              type="profile"
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
            />
          </div>

          <div className="mt-32 sm:mt-24 md:mt-20 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#46B6BD] to-[#205457] bg-clip-text text-transparent">Your AI Assistant</h1>
            <p className="text-base sm:text-lg md:text-xl text-black/90 mb-4 sm:mb-6">Experience Smart & Secure AI chat</p>

            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-teal-600 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">✓</span>
                Smart Conversations
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-teal-600 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">✓</span>
                Instant Responses
              </span>
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-teal-600 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-white text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">✓</span>
                Secure & Private
              </span>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={onStartChat}
                className="bg-teal-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg flex items-center gap-2 sm:gap-3 shadow-md hover:bg-teal-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
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
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-white shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onBackToLanding} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <span className="font-bold text-sm sm:text-base">AI Assistant</span>
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {isDarkMode ? <Sun size={20} className="sm:w-6 sm:h-6" /> : <Moon size={20} className="sm:w-6 sm:h-6" />}
          </button>
          <button onClick={() => navigate("/chatai")} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 mb-20 sm:mb-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-md ${m.sender === "user"
                ? " bg-gradient-to-r from-[#46B6BD] to-[#205457] text-white"
                : "bg-white text-gray-800 shadow"
                }`}
            >
              <div className="text-sm sm:text-base break-words">{m.text}</div>
              <div className="text-[10px] sm:text-xs opacity-60 mt-1">{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 shadow-lg px-4 sm:px-6 py-3 sm:py-4 bg-white">
        <div className="max-w-5xl mx-auto flex gap-2 sm:gap-3">
          <input
            value={inputMessage}
            disabled={isSending}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Ask anything..."
          />
          <button
            disabled={isSending}
            onClick={handleSendMessage}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-[#46B6BD] to-[#205457] rounded-full flex items-center justify-center flex-shrink-0 hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            <Send className="text-white" size={18} />
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
        "/ai-chat",
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