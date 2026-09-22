import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavigation } from './components/layout/TopNavigation';
import { ToastContainer } from './components/layout/ToastContainer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Modules
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SubditView } from './components/subdit/SubditView';
import { TataUsahaModule } from './components/tu/TataUsahaModule';
import { ProjectManagement } from './components/projects/ProjectManagement';
import { BudgetManagement } from './components/budget/BudgetManagement';
import { ApprovalWorkflow } from './components/approval/ApprovalWorkflow';
import { KpiOkrModule } from './components/kpi/KpiOkrModule';
import { MadrasahDatabase } from './components/madrasah/MadrasahDatabase';
import { MadrasahBrandingModule } from './components/branding/MadrasahBrandingModule';
import { MonitoringCenter } from './components/monitoring/MonitoringCenter';
import { DocumentManagement } from './components/documents/DocumentManagement';
import { ReportingModule } from './components/reports/ReportingModule';
import { AdminAuditPanel } from './components/admin/AdminAuditPanel';
import { AiAssistantModule } from './components/ai/AiAssistantModule';

// Modals
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { MadrasahDetailModal } from './components/branding/MadrasahDetailModal';

const MainShell: React.FC = () => {
  const {
    activeMenu,
    selectedProjectId,
    setSelectedProjectId,
    selectedMadrasahId,
    setSelectedMadrasahId,
  } = useApp();

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'subdit-kurikulum':
        return <SubditView subditId="kurikulum" />;
      case 'subdit-sarpras':
        return <SubditView subditId="sarpras" />;
      case 'subdit-kelembagaan':
        return <SubditView subditId="kelembagaan" />;
      case 'subdit-kesiswaan':
        return <SubditView subditId="kesiswaan" />;
      case 'subdit-vokasi':
        return <SubditView subditId="vokasi-inklusi" />;
      case 'tata-usaha':
        return <TataUsahaModule />;
      case 'planning':
      case 'projects':
        return <ProjectManagement />;
      case 'budget':
        return <BudgetManagement />;
      case 'approval':
        return <ApprovalWorkflow />;
      case 'kpi-okr':
        return <KpiOkrModule />;
      case 'madrasah-db':
        return <MadrasahDatabase />;
      case 'madrasah-branding':
        return <MadrasahBrandingModule />;
      case 'monitoring':
        return <MonitoringCenter />;
      case 'documents':
        return <DocumentManagement />;
      case 'reports':
        return <ReportingModule />;
      case 'admin-audit':
        return <AdminAuditPanel />;
      case 'ai-assistant':
        return <AiAssistantModule />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto lg:pl-72 bg-[#f4f6fa]">
        <TopNavigation onOpenMobileSidebar={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-full">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Interactive Elements */}
      <ToastContainer />
      <GlobalSearchModal />

      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {selectedMadrasahId && (
        <MadrasahDetailModal
          madrasahId={selectedMadrasahId}
          onClose={() => setSelectedMadrasahId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}
