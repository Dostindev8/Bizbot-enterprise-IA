import { useEffect } from 'react';
import { useAppStore, NavModule } from './lib/store.js';
import { api } from './lib/api.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { WidgetEmbed } from './components/WidgetEmbed.js';
import { IntroPage } from './modules/intro/IntroPage.js';
import { LoginPage } from './modules/auth/LoginPage.js';
import { RegisterPage } from './modules/auth/RegisterPage.js';
import { DashboardModule } from './modules/dashboard/DashboardModule.js';
import { ChatModule } from './modules/chat/ChatModule.js';
import { AgendaModule } from './modules/agenda/AgendaModule.js';
import { CrmModule } from './modules/crm/CrmModule.js';
import { DocumentsModule } from './modules/documents/DocumentsModule.js';
import { CallCenterModule } from './modules/call-center/CallCenterModule.js';
import { WorkflowsModule } from './modules/workflows/WorkflowsModule.js';
import { AnalyticsModule } from './modules/analytics/AnalyticsModule.js';
import { BillingModule } from './modules/billing/BillingModule.js';
import { SettingsModule } from './modules/settings/SettingsModule.js';

const PUBLIC_MODULES: NavModule[] = ['intro', 'login', 'register'];
const PRIVATE_MODULES: NavModule[] = [
  'dashboard',
  'chat',
  'agenda',
  'crm',
  'documents',
  'call-center',
  'workflows',
  'analytics',
  'billing',
  'settings',
];

export function App() {
  const { currentModule, isAuthenticated, isSidebarOpen, setCurrentModule, setAuth, logout, user } =
    useAppStore();

  const isPublicPage = PUBLIC_MODULES.includes(currentModule);
  const guardedModule =
    PRIVATE_MODULES.includes(currentModule) && !isAuthenticated ? 'login' : currentModule;

  useEffect(() => {
    if (PRIVATE_MODULES.includes(currentModule) && !isAuthenticated) {
      setCurrentModule('login');
    }
  }, [currentModule, isAuthenticated, setCurrentModule]);

  useEffect(() => {
    const token = localStorage.getItem('bizbot_access_token');
    if (!token || user || token.startsWith('mock_')) return;
    void api
      .getMe()
      .then((data) => {
        setAuth(data.user);
      })
      .catch(() => {
        logout();
      });
  }, [user, setAuth, logout]);

  const renderCurrentModule = () => {
    switch (guardedModule) {
      case 'intro':
        return <IntroPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <DashboardModule />;
      case 'chat':
        return <ChatModule />;
      case 'agenda':
        return <AgendaModule />;
      case 'crm':
        return <CrmModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'call-center':
        return <CallCenterModule />;
      case 'workflows':
        return <WorkflowsModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'billing':
        return <BillingModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <IntroPage />;
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#0B0F19] text-[#E8EEF8] flex flex-col selection:bg-[#00D4FF]/30 selection:text-white">
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar />

      <div className="flex-1 flex relative min-w-0">
        {!isPublicPage && isAuthenticated && <Sidebar />}

        {isAuthenticated && !isPublicPage && isSidebarOpen && (
          <button
            type="button"
            aria-label="Cerrar menú de navegación"
            className="fixed inset-0 z-30 bg-black/55 md:hidden"
            onClick={() => useAppStore.getState().toggleSidebar()}
          />
        )}

        <main
          id="contenido-principal"
          tabIndex={-1}
          className={`flex-1 min-w-0 ${
            !isPublicPage ? 'p-3 xs:p-4 sm:p-6 md:p-8 max-w-7xl overflow-x-hidden' : 'w-full'
          }`}
        >
          {renderCurrentModule()}
        </main>
      </div>

      <WidgetEmbed />
    </div>
  );
}

export default App;
