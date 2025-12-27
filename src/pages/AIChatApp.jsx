import React, { useState } from "react";
import { Send, Moon, Sun, ChevronLeft } from "lucide-react";

const LandingPage = ({ onStartChat }) => (
  <div className="min-h-screen relative overflow-hidden">
    {/* Background Image - The robot hand with circles - Positioned slightly below center */}
    <div
      className="absolute inset-0 bg-cover"
      style={{
        backgroundImage: `url('/img/chatai.jpg')`,
        backgroundPosition: "50% 65%",
      }}
    />

    {/* Light overlay for better text readability */}
    <div className="absolute inset-0 bg-white/10" />

    {/* Content */}
    <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Small Astronaut Image - Positioned on the right */}
        <div className="absolute top-20 right-8 md:right-20">
          <img
            src="/img/chatai2.png"
            alt="AI Assistant"
            className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12 mt-32 md:mt-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">C</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your AI Assistant
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow">
            Experience Smart & Secure AI chat
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Start Conversations
            </h3>
            <p className="text-sm text-gray-600">
              Natural and intuitive chat experience
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Instant Responses
            </h3>
            <p className="text-sm text-gray-600">Get answers in real-time</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Secure & Private
            </h3>
            <p className="text-sm text-gray-600">Your data is protected</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onStartChat}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Chat
          </button>
        </div>

        {/* Greeting Badge */}
        <div className="absolute top-8 left-8 bg-teal-700/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg z-20">
          Hi! I will help you
        </div>
      </div>
    </div>
  </div>
);

const ChatPage = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isDarkMode,
  setIsDarkMode,
  onBackToLanding,
}) => (
  <div
    className={`min-h-screen ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    } transition-colors duration-300`}
  >
    {/* Header */}
    <div
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b px-6 py-4 flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToLanding}
          className={`${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } p-2 rounded-full transition-colors`}
        >
          <ChevronLeft
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
            size={24}
          />
        </button>
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h2
            className={`font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            AI Assistant
          </h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Online
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-colors`}
        >
          {isDarkMode ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-gray-600" size={20} />
          )}
        </button>
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          3 messages left
        </span>
      </div>
    </div>

    {/* Chat Messages */}
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 mb-24">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          } items-end gap-3`}
        >
          {message.sender === "bot" && (
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          )}
          <div
            className={`flex flex-col ${
              message.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-md px-5 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : isDarkMode
                  ? "bg-gray-800 text-white rounded-bl-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow-md"
              }`}
            >
              {message.text}
            </div>
            <span
              className={`text-xs mt-1 ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {message.time}
            </span>
          </div>
          {message.sender === "user" && (
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 text-sm font-bold">U</span>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Input Area */}
    <div
      className={`fixed bottom-0 left-0 right-0 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-t px-6 py-4`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask anything"
          className={`flex-1 px-6 py-3 rounded-full ${
            isDarkMode
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-teal-500`}
        />
        <button
          onClick={handleSendMessage}
          className="w-12 h-12 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <Send className="text-white" size={20} />
        </button>
      </div>
    </div>
  </div>
);

const AIChatApp = () => {
  const [currentPage, setCurrentPage] = useState("landing");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      time: "03:54 PM",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "bot",
      time: "03:01 PM",
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "user",
      time: "03:00 PM",
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "bot",
      time: "03:03 PM",
    },
    {
      id: 5,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "user",
      time: "03:02 PM",
    },
    {
      id: 6,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "bot",
      time: "03:05 PM",
    },
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet consectetur.",
      sender: "user",
      time: "03:04 PM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
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
    />
  );
};

export default AIChatApp;
