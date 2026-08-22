import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  Wrench,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  Sparkles,
  Database,
  Search,
  FileText,
  Building2,
  Newspaper,
  ShieldCheck
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tool_used?: string;
  tool_params?: Record<string, any>;
  retrieved_data?: any;
  execution_time_ms?: number;
}

const getToolIcon = (toolName?: string) => {
  if (!toolName) return <Wrench className="w-3.5 h-3.5" />;
  switch (toolName) {
    case 'NewsSearchTool':
      return <Newspaper className="w-3.5 h-3.5 text-blue-500" />;
    case 'ResearchPaperTool':
      return <FileText className="w-3.5 h-3.5 text-purple-500" />;
    case 'CompanyInfoTool':
      return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
    case 'DatabaseInsightTool':
      return <Database className="w-3.5 h-3.5 text-amber-500" />;
    case 'PatentSearchTool':
      return <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />;
    default:
      return <Search className="w-3.5 h-3.5 text-sky-500" />;
  }
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your Autonomous Intelligence Assistant. Submit any research, company, market, or patent query—I will automatically understand your intent, dynamically select the most relevant tool/API, execute data retrieval, and analyze the results for you.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedToolIndex, setExpandedToolIndex] = useState<number | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('🧠 Analyzing query & intent...');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      const steps = [
        '🧠 Analyzing query intent...',
        '⚡ Dynamically selecting & calling relevant tool/API...',
        '📊 Analyzing retrieved data & synthesizing results...'
      ];
      let stepIdx = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        stepIdx = (stepIdx + 1) % steps.length;
        setLoadingStep(steps[stepIdx]);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        tool_used: data.tool_used,
        tool_params: data.tool_params,
        retrieved_data: data.retrieved_data,
        execution_time_ms: data.execution_time_ms
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error processing your request.';
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleToolExpand = (index: number) => {
    setExpandedToolIndex((prev) => (prev === index ? null : index));
  };

  const suggestedQuestions = [
    "What are the latest news articles on AI chips?",
    "Find research papers on quantum transformer models",
    "Analyze Tesla company financial info & competitors",
    "Search database for high priority insights"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center space-x-2"
          title="Open AI Autonomous Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-semibold text-sm pr-1">AI Agent</span>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[440px] max-w-[92vw] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all border border-gray-100 ${
            isMinimized ? 'h-14 overflow-hidden' : 'h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-3.5 rounded-t-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5">
                  Autonomous AI Agent
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    Dynamic Tools
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Auto query routing & multi-source analysis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/10 p-1.5 rounded-lg text-gray-300 hover:text-white transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}
                    >
                      {/* Tool Execution Card (if assistant used a tool) */}
                      {message.role === 'assistant' && message.tool_used && (
                        <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                              {getToolIcon(message.tool_used)}
                              <span>Dynamically Called:</span>
                              <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[11px]">
                                {message.tool_used}
                              </span>
                            </div>
                            {message.execution_time_ms ? (
                              <div className="flex items-center text-[10px] text-gray-400 font-mono">
                                <Clock className="w-3 h-3 mr-0.5" />
                                {message.execution_time_ms}ms
                              </div>
                            ) : null}
                          </div>

                          {/* Tool Parameters */}
                          {message.tool_params && Object.keys(message.tool_params).length > 0 && (
                            <div className="mt-1.5 text-[11px] text-slate-500 font-mono">
                              Params: {JSON.stringify(message.tool_params)}
                            </div>
                          )}

                          {/* Retrieved Data Accordion */}
                          {message.retrieved_data && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60">
                              <button
                                onClick={() => toggleToolExpand(index)}
                                className="flex items-center justify-between w-full text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                              >
                                <span>
                                  {expandedToolIndex === index ? 'Hide Retrieved Data' : 'View Retrieved Data Log'}
                                </span>
                                {expandedToolIndex === index ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {expandedToolIndex === index && (
                                <pre className="mt-2 p-2 bg-slate-900 text-slate-200 text-[10px] font-mono rounded-lg overflow-x-auto max-h-40">
                                  {JSON.stringify(message.retrieved_data, null, 2)}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Message Content */}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>

                      {/* Timestamp */}
                      <p
                        className={`text-[10px] mt-1.5 opacity-60 text-right ${
                          message.role === 'user' ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading indicator with step updates */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm max-w-[85%]">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-xs font-medium text-slate-700 animate-pulse">
                          {loadingStep}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-4 py-2 bg-white border-t border-gray-100">
                  <p className="text-[11px] font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValue(question)}
                        className="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition-colors text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter query (AI will select tool & analyze data)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
