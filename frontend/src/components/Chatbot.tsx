import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Workflow,
  Globe
} from 'lucide-react';

interface AgentActivityItem {
  step: string;
  status: string;
  details?: string;
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
  execution_time_ms?: number;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your 360° AI Multi-Agent Intelligence Orchestrator. Submit any query or topic—I will automatically search Research Papers, check Patent Filings, monitor News & Social Media, and analyze Competitor & Market Data for you.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedToolIndex, setExpandedToolIndex] = useState<number | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('🤖 AI Orchestrator analyzing query...');

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
        '🤖 AI Orchestrator deploying 360° agent delegation...',
        '🔬 Research Agent: Searching academic papers...',
        '📜 Patent Agent: Checking IP filings...',
        '📰 News & Social Agent: Monitoring media sentiment...',
        '🏢 Competitor Agent: Analyzing market & DB metrics...',
        '🌐 Performing 360° cross-agent analytical synthesis...'
      ];
      let stepIdx = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        stepIdx = (stepIdx + 1) % steps.length;
        setLoadingStep(steps[stepIdx]);
      }, 1000);
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
        agents_involved: data.agents_involved,
        agent_activity: data.agent_activity,
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
    "AI Medical Diagnosis (Search Papers, Patents, News, Competitors)",
    "Quantum Computing Transformers (Research + IP + News)",
    "Nvidia Blackwell GPU (Competitor + Patent + Market News)",
    "Search database for high priority insights"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center space-x-2"
          title="Open 360° AI Multi-Agent Assistant"
        >
          <Globe className="w-6 h-6 animate-pulse text-cyan-300" />
          <span className="font-semibold text-sm pr-1">360° AI Agent</span>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-[500px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all border border-gray-100 ${
            isMinimized ? 'h-14 overflow-hidden' : 'h-[650px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-3.5 rounded-t-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                <Workflow className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5">
                  360° Multi-Agent Intelligence
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-400/30 font-mono">
                    4 Pillars
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Research • Patents • News/Social • Competitors
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
                      className={`max-w-[92%] p-3.5 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}
                    >
                      {/* Agent Activity Section (360° Sub-agent trace checklist) */}
                      {message.role === 'assistant' && (message.agent_activity?.length || message.agents_involved?.length) ? (
                        <div className="mb-3 p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-sans shadow-inner border border-slate-800">
                          <div className="flex items-center justify-between font-semibold border-b border-slate-700/80 pb-1.5 mb-2 text-blue-400">
                            <span className="flex items-center gap-1.5 text-[11px] font-mono tracking-wide uppercase">
                              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                              Agent Activity & Multi-Source Trace
                            </span>
                            {message.execution_time_ms ? (
                              <span className="text-[10px] text-slate-400 font-mono flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {message.execution_time_ms}ms
                              </span>
                            ) : null}
                          </div>

                          {/* 4 Pillars Steps Checklist */}
                          <div className="grid grid-cols-1 gap-1 text-[11px] font-medium">
                            <div className="flex items-center text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                              <span>Orchestrator selected</span>
                            </div>

                            {(message.agents_involved?.includes('Research Intelligence Agent') || !message.agents_involved?.length) && (
                              <div className="flex items-center text-purple-300">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-purple-400" />
                                <span>Research Intelligence Agent (Papers)</span>
                              </div>
                            )}

                            {(message.agents_involved?.includes('Patent & IP Agent') || message.agents_involved?.includes('Competitive Intelligence Agent')) && (
                              <div className="flex items-center text-indigo-300">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-indigo-400" />
                                <span>Patent & IP Agent (Filings)</span>
                              </div>
                            )}

                            {message.agents_involved?.includes('News & Social Media Agent') && (
                              <div className="flex items-center text-sky-300">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-sky-400" />
                                <span>News & Social Media Agent (Sentiment)</span>
                              </div>
                            )}

                            {message.agents_involved?.includes('Competitor & Market Agent') && (
                              <div className="flex items-center text-amber-300">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-amber-400" />
                                <span>Competitor & Market Agent (Financials)</span>
                              </div>
                            )}

                            <div className="flex items-center text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-emerald-400" />
                              <span>Tools called ({message.tool_used || 'Multi-Domain Tools'})</span>
                            </div>

                            <div className="flex items-center text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-emerald-400" />
                              <span>Multi-source results retrieved</span>
                            </div>

                            <div className="flex items-center text-cyan-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0 text-cyan-400" />
                              <span>360° Cross-agent synthesis completed</span>
                            </div>
                          </div>

                          {/* Expandable Data Log */}
                          {message.retrieved_data && (
                            <div className="mt-2.5 pt-2 border-t border-slate-800">
                              <button
                                onClick={() => toggleToolExpand(index)}
                                className="flex items-center justify-between w-full text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                              >
                                <span>
                                  {expandedToolIndex === index ? 'Hide 360° Raw Retrieved Data' : 'View 360° Raw Retrieved Data Log'}
                                </span>
                                {expandedToolIndex === index ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {expandedToolIndex === index && (
                                <pre className="mt-2 p-2 bg-slate-950 text-slate-300 text-[10px] font-mono rounded-lg overflow-x-auto max-h-44 border border-slate-800">
                                  {JSON.stringify(message.retrieved_data, null, 2)}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null}

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

                {/* Loading indicator with multi-agent step updates */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 text-white border border-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm max-w-[90%]">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-xs font-mono text-cyan-300 animate-pulse">
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
                  <p className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    360° Intelligence Demo Queries:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputValue(question)}
                        className="text-[11px] bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors text-left font-medium"
                      >
                        🌐 {question}
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
                    placeholder="Enter query (Searches Papers, Patents, News, Competitors)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
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
