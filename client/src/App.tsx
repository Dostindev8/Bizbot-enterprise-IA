import { useAppStore } from './lib/store.js';
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

export function App() {
  const { currentModule } = useAppStore();

  const renderCurrentModule = () => {
    switch (currentModule) {
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

  const isPublicPage = currentModule === 'intro' || currentModule === 'login' || currentModule === 'register';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#E8EEF8] flex flex-col selection:bg-[#00D4FF]/30 selection:text-white">
      <Navbar />

      <div className="flex-1 flex">
        {!isPublicPage && <Sidebar />}

        <main className={`flex-1 ${!isPublicPage ? 'p-4 sm:p-6 md:p-8 max-w-7xl overflow-x-hidden' : 'w-full'}`}>
          {renderCurrentModule()}
        </main>
      </div>

      <WidgetEmbed />
    </div>
  );
}

export default App;
