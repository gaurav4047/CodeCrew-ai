import { Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, Target, Lightbulb, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Chatbot from './Chatbot';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Tracking', href: '/tracking', icon: Target },
    { name: 'Insights', href: '/insights', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-gray-900">Competitive Intel</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <span className="text-xl font-bold text-gray-900">Competitive Intel</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex items-center h-16 px-4 bg-white border-b lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-900">Competitive Intel</span>
        </div>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
