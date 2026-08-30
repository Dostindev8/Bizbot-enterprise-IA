import React from 'react';
import { useAppStore } from '../lib/store.js';
import { Button, UptimeBadge } from '@bizbot/ui';
import { Bot, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentModule, setCurrentModule, isAuthenticated, user, logout } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23304E]/80 bg-[#0B0F19]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setCurrentModule('intro')}
          className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
        >
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#00D4FF] via-[#7C3AED] to-transparent shadow-[0_0_25px_rgba(0,212,255,0.35)] group-hover:scale-105 transition-transform duration-300">
            <img
              src="/bizbot-logo.png"
              alt="BizBot AI Logo"
              className="w-full h-full object-contain rounded-[14px] bg-[#0B0F19]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#E8EEF8]">
                BizBot <span className="text-[#00D4FF]">AI</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/30">
                v3.0
              </span>
            </div>
            <p className="text-[11px] text-[#8B9BB8] font-medium hidden sm:block">
              Business Assistant Chatbot Enterprise
            </p>
          </div>
        </button>

        {/* Live System Indicator */}
        <div className="hidden md:flex items-center gap-4">
          <UptimeBadge uptime={99.98} />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant={currentModule === 'dashboard' ? 'primary' : 'glass'}
                size="sm"
                onClick={() => setCurrentModule('dashboard')}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentModule('chat')}
                leftIcon={<Bot className="w-4 h-4 text-[#00D4FF]" />}
              >
                Chat IA
              </Button>
              <div className="h-6 w-[1px] bg-[#23304E] mx-1 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] flex items-center justify-center font-bold text-xs text-[#0B0F19]">
                  {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-[#8B9BB8] hover:text-red-400 transition-colors font-medium ml-1 cursor-pointer"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentModule('intro')}
                className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentModule === 'intro' ? 'text-[#00D4FF]' : 'text-[#8B9BB8] hover:text-white'
                }`}
              >
                Inicio & Demo
              </button>
              <Button
                variant="glass"
                size="sm"
                onClick={() => setCurrentModule('login')}
                leftIcon={<LogIn className="w-3.5 h-3.5 text-[#00D4FF]" />}
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentModule('register')}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Empezar
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
