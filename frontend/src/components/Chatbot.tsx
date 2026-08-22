import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Workflow,
  Brain,
  Sparkles,
  Bot
} from 'lucide-react';

interface AgentActivityItem {
  step: string;
  status: string;
  details?: string;
}

interface ContextMemory {
  is_followup?: boolean;
  context_used?: string;
  active_topic?: string;
  active_sources?: string[];
  memory_indicator?: string;
  prior_findings_count?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tool_used?: string;
  tool_params?: Record<string, any>;
  retrieved_data?: any;
  agents_involved?: string[];
  agent_activity?: AgentActivityItem[];
  context_memory?: ContextMemory;
  execution_time_ms?: number;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your Platform AI Assistant. Ask me anything about how to use the platform (Tracking, Research, Patents, Competitors, News, Trends, Reports) or ask any research topic inquiry—I will answer and retain context for you!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraceIndex, setExpandedTraceIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputValue;
    if (!queryText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: queryText,
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
        agents_involved: data.agents_involved,
        agent_activity: data.agent_activity,
        context_memory: data.context_memory,
        execution_time_ms: data.execution_time_ms
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error processing your question.';
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

  const toggleTraceExpand = (index: number) => {
    setExpandedTraceIndex((prev) => (prev === index ? null : index));
  };

  const platformSuggestions = [
    "How do I set up automated tracking for AI Medical Diagnosis?",
    "Explain how Context Memory retains topics across turns.",
    "What is the difference between Verified Facts and Social Signals?",
    "Summarize recent research papers and competitor patents found."
  ];

  return (
    <>
      {/* Floating Chat Button (Bottom Right Corner) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center space-x-2.5 border border-white/20"
          title="Open AI Platform Chatbot Assistant"
        >
          <div className="p-1 bg-white/20 rounded-full">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="font-semibold text-sm">AI Agent & Assistant</span>
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[480px] max-w-[94vw] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all border border-slate-200 overflow-hidden ${
            isMinimized ? 'h-14' : 'h-[620px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5">
                  Platform AI Assistant
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Powered by Groq LLM & Context Memory Engine
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/10 p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl shadow-xs ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      {/* Optional Context Memory Indicator */}
                      {message.role === 'assistant' && message.context_memory?.memory_indicator ? (
                        <div className="mb-2 p-2 bg-indigo-950 text-indigo-200 border border-indigo-800 rounded-xl flex items-center justify-between text-[11px]">
                          <div className="flex items-center space-x-1.5 font-medium">
                            <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>{message.context_memory.memory_indicator}</span>
                          </div>
                        </div>
                      ) : null}

                      {/* Main LLM Text Response */}
                      <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                        {message.content}
                      </div>

                      {/* Expandable Technical Trace Accordion */}
                      {message.role === 'assistant' && (message.agents_involved?.length || message.tool_used) ? (
                        <div className="mt-2.5 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => toggleTraceExpand(index)}
                            className="flex items-center justify-between w-full text-[10px] text-indigo-600 hover:text-indigo-800 font-mono font-medium"
                          >
                            <span className="flex items-center gap-1">
                              <Workflow className="w-3 h-3 text-cyan-600" />
                              {expandedTraceIndex === index ? 'Hide Agent Trace' : 'View Agent Execution Trace'}
                            </span>
                            {expandedTraceIndex === index ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {expandedTraceIndex === index && (
                            <div className="mt-2 p-2.5 bg-slate-900 text-slate-200 text-[10px] font-mono rounded-lg space-y-1">
                              <div className="text-cyan-400 font-bold">Sub-Agents: {message.agents_involved?.join(', ')}</div>
                              <div>Tools Executed: {message.tool_used}</div>
                              {message.execution_time_ms && <div>Execution Time: {message.execution_time_ms} ms</div>}
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Timestamp */}
                      <p
                        className={`text-[10px] mt-1.5 opacity-60 text-right ${
                          message.role === 'user' ? 'text-white' : 'text-slate-400'
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

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                        <span className="text-xs text-slate-500 font-mono">
                          AI Assistant thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggested Questions Chips */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-3.5 py-2.5 bg-white border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ask Assistant Quick Prompts:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {platformSuggestions.map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(promptText)}
                        className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors text-left font-medium flex items-center gap-1.5"
                      >
                        <span className="text-blue-600 font-bold">💬</span>
                        <span>{promptText}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask any platform or research question..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center shrink-0"
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
