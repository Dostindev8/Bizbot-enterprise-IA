import React from 'react';
import { useAppStore } from '../lib/store.js';
import { Button, UptimeBadge } from '@bizbot/ui';
import { Bot, LogIn, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentModule, setCurrentModule, isAuthenticated, user, logout, isSidebarOpen, toggleSidebar } =
    useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23304E]/80 bg-[#0B0F19]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {isAuthenticated && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-expanded={isSidebarOpen}
              aria-controls="bizbot-sidebar"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#23304E] text-[#E8EEF8] hover:border-[#00D4FF]/50 focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Abrir o cerrar menú</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setCurrentModule(isAuthenticated ? 'dashboard' : 'intro')}
            className="flex items-center gap-2 sm:gap-3 group text-left focus-visible:ring-2 focus-visible:ring-[#00D4FF] rounded-xl min-w-0"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#00D4FF] via-[#7C3AED] to-transparent shadow-[0_0_25px_rgba(0,212,255,0.35)] group-hover:scale-105 transition-transform duration-300">
              <img
                src="/bizbot-logo.png"
                alt="BizBot AI"
                className="w-full h-full object-contain rounded-[14px] bg-[#0B0F19]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#E8EEF8] truncate">
                  BizBot <span className="text-[#00D4FF]">AI</span>
                </span>
                <span className="hidden xs:inline text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-[#7C3AED]/20 text-[#C4B5FD] border border-[#7C3AED]/30">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-[#8B9BB8] font-medium hidden lg:block">
                Business Assistant Chatbot Enterprise
              </p>
            </div>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <UptimeBadge uptime={99.98} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <Button
                variant={currentModule === 'dashboard' ? 'primary' : 'glass'}
                size="sm"
                onClick={() => setCurrentModule('dashboard')}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentModule('chat')}
                leftIcon={<Bot className="w-4 h-4 text-[#00D4FF]" />}
                aria-label="Chat IA"
              >
                <span className="hidden sm:inline">Chat IA</span>
              </Button>
              <div className="h-6 w-[1px] bg-[#23304E] mx-1 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] flex items-center justify-center font-bold text-xs text-[#0B0F19]"
                  aria-hidden
                >
                  {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-[#8B9BB8] hover:text-red-400 transition-colors font-medium"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCurrentModule('intro')}
                className={`hidden xs:inline text-xs font-semibold px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                  currentModule === 'intro' ? 'text-[#00D4FF]' : 'text-[#8B9BB8] hover:text-white'
                }`}
              >
                Demo
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
                className="hidden sm:inline-flex"
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
