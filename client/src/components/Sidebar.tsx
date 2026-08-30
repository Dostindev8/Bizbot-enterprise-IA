import React from 'react';
import { useAppStore, NavModule } from '../lib/store.js';
import {
  LayoutDashboard,
  Bot,
  Calendar,
  Users,
  FileText,
  PhoneCall,
  GitFork,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  Shield,
} from 'lucide-react';

interface SidebarItem {
  id: NavModule;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { currentModule, setCurrentModule, user } = useAppStore();

  const menuItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Vista General',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'chat',
      label: 'Chat IA Multicanal',
      icon: <Bot className="w-5 h-5 text-[#00D4FF]" />,
      badge: 'RAG Live',
    },
    {
      id: 'agenda',
      label: 'Agenda & Citas',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'crm',
      label: 'CRM & Leads AI',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      badge: 'Scoring',
    },
    {
      id: 'documents',
      label: 'Documentos & Firma',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'call-center',
      label: 'Call Center & Voz',
      icon: <PhoneCall className="w-5 h-5 text-cyan-300" />,
      badge: 'Whisper',
    },
    {
      id: 'workflows',
      label: 'Workflow Engine',
      icon: <GitFork className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: 'analytics',
      label: 'Analíticas & SLA',
      icon: <BarChart3 className="w-5 h-5 text-teal-400" />,
    },
    {
      id: 'billing',
      label: 'Suscripción & Planes',
      icon: <CreditCard className="w-5 h-5 text-pink-400" />,
    },
    {
      id: 'settings',
      label: 'Configuración & Marca',
      icon: <Settings className="w-5 h-5 text-slate-400" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0E1424] border-r border-[#23304E] flex flex-col justify-between p-4 h-[calc(100vh-4.5rem)] sticky top-18">
      {/* Top Section */}
      <div className="flex flex-col gap-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#5F708F]">
          Módulos Core Enterprise
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentModule(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00D4FF]/15 to-[#7C3AED]/10 text-[#00D4FF] border border-[#00D4FF]/30 font-semibold shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                    : 'text-[#8B9BB8] hover:text-[#E8EEF8] hover:bg-[#131A2B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Tenant Badge */}
      <div className="pt-4 border-t border-[#23304E]/80 flex flex-col gap-2">
        <div className="p-3 rounded-xl bg-[#131A2B]/90 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-xs font-bold text-purple-300">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-[#E8EEF8] truncate">
                {user?.name || 'Administrador'}
              </div>
              <div className="text-[10px] text-[#39E58C] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39E58C] animate-pulse" />
                Org Isolated
              </div>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#00D4FF] shrink-0" />
        </div>
      </div>
    </aside>
  );
};
