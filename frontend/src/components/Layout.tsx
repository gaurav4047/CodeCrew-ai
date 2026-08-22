import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Workflow,
  Award,
  FileCheck,
  Building2,
  Newspaper,
  Share2,
  TrendingUp,
  Lightbulb,
  Bell,
  Target,
  FileText,
  Bookmark,
  Network,
  Settings,
  Menu,
  X,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import Chatbot from './Chatbot';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'AI Research', href: '/research', icon: Workflow },
    { name: 'Research Papers', href: '/papers', icon: Award },
    { name: 'Patents', href: '/patents', icon: FileCheck },
    { name: 'Competitors', href: '/competitors', icon: Building2 },
    { name: 'News Intelligence', href: '/news', icon: Newspaper },
    { name: 'Social Intelligence', href: '/social', icon: Share2 },
    { name: 'Trend Radar', href: '/trends', icon: TrendingUp },
    { name: 'Insights', href: '/insights', icon: Lightbulb },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Tracking Targets', href: '/tracking', icon: Target },
    { name: 'Reports & Export', href: '/reports', icon: FileText },
    { name: 'Collections', href: '/collections', icon: Bookmark },
    { name: 'Knowledge Graph', href: '/graph', icon: Network },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-slate-950 text-slate-100 shadow-2xl border-r border-slate-800">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <span className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              CodeCrew AI SaaS
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  location.pathname === item.href
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-4 h-4 mr-2.5 shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-slate-950 text-slate-100 border-r border-slate-800 shadow-xl">
          <div className="flex items-center h-16 px-4 border-b border-slate-800 justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              CodeCrew AI SaaS
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
              v4.0 Enterprise
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-xs font-medium rounded-xl transition-all ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2.5 shrink-0 text-cyan-400" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Role: Enterprise Admin • System Operational</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              LLM: Groq API (groq/compound)
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
              EA
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
