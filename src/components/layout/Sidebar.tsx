import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  CheckSquare,
  Target,
  School,
  Star,
  Activity,
  FileText,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Bot,
  ChevronDown,
  ChevronRight,
  Building2,
  Layers,
  X,
} from 'lucide-react';
import { useApp, NavigationMenu } from '../../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeMenu, setActiveMenu, alerts, approvals } = useApp();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const criticalAlertsCount = alerts.filter((a) => a.level === 'red').length;

  const handleNav = (menu: NavigationMenu) => {
    setActiveMenu(menu);
    setIsMobileOpen(false);
  };

  const navItemClass = (menu: NavigationMenu) => {
    const isActive = activeMenu === menu;
    return `w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
      isActive
        ? 'bg-blue-600/90 text-white shadow-sm font-bold'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1b233a] text-slate-200 border-r border-[#26314d] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Dropdown Header (Deskera "My Business" Style) */}
        <div className="p-4 border-b border-[#273250]">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-[#232d4b] hover:bg-[#2a365a] transition-colors cursor-pointer border border-[#313e66]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-400/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-white truncate tracking-wide leading-tight">
                    Direktorat KSKK
                  </p>
                  <p className="text-[11px] text-slate-400 truncate tracking-wide leading-tight">
                    Kemenag RI • DIPA 2026
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                  isWorkspaceOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Subdit Switcher Dropdown */}
          {isWorkspaceOpen && (
            <div className="mt-2 p-2 rounded-xl bg-[#161c30] border border-[#2c3859] space-y-1 text-xs">
              <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Unit / Subdirektorat
              </p>
              {[
                'Semua Subdirektorat (Direktorat KSKK)',
                'Kurikulum & Evaluasi',
                'Sarana & Prasarana',
                'Kelembagaan & Kerjasama',
                'Kesiswaan',
                'Tata Usaha',
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setIsWorkspaceOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 tracking-wide transition-colors truncate"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation List with Generous Vertical Rhythm */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 text-xs">
          {/* Main Dashboard */}
          <div>
            <button
              onClick={() => handleNav('dashboard')}
              className={navItemClass('dashboard')}
            >
              <div className="flex items-center gap-3.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span className="tracking-wide">Dashboard ERP</span>
              </div>
            </button>
          </div>

          {/* SECTION: PROGRAM & PROYEK */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Program & Proyek
            </p>
            <button
              onClick={() => handleNav('projects')}
              className={navItemClass('projects')}
            >
              <div className="flex items-center gap-3.5">
                <FolderKanban className="w-4 h-4" />
                <span className="tracking-wide">Project Management</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* SECTION: ANGGARAN & APPROVAL */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Keuangan & Approval
            </p>
            <button
              onClick={() => handleNav('budget')}
              className={navItemClass('budget')}
            >
              <div className="flex items-center gap-3.5">
                <Wallet className="w-4 h-4" />
                <span className="tracking-wide">Pengelolaan Anggaran (RAB)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={() => handleNav('approval')}
              className={navItemClass('approval')}
            >
              <div className="flex items-center gap-3.5">
                <CheckSquare className="w-4 h-4" />
                <span className="tracking-wide">Approval Workflow</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full font-mono">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </div>

          {/* SECTION: KINERJA & STRATEGIS */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Kinerja Strategis
            </p>
            <button
              onClick={() => handleNav('kpi-okr')}
              className={navItemClass('kpi-okr')}
            >
              <div className="flex items-center gap-3.5">
                <Target className="w-4 h-4" />
                <span className="tracking-wide">KPI & OKR Terpadu</span>
              </div>
            </button>
          </div>

          {/* SECTION: EKOSISTEM MADRASAH */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Ekosistem Madrasah
            </p>
            <button
              onClick={() => handleNav('madrasah-db')}
              className={navItemClass('madrasah-db')}
            >
              <div className="flex items-center gap-3.5">
                <School className="w-4 h-4" />
                <span className="tracking-wide">Database Madrasah</span>
              </div>
            </button>
            <button
              onClick={() => handleNav('madrasah-branding')}
              className={navItemClass('madrasah-branding')}
            >
              <div className="flex items-center gap-3.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span className="tracking-wide">Branding & Publikasi</span>
              </div>
            </button>
          </div>

          {/* SECTION: MONITORING & LAPORAN */}
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Pengawasan & Laporan
            </p>
            <button
              onClick={() => handleNav('monitoring')}
              className={navItemClass('monitoring')}
            >
              <div className="flex items-center gap-3.5">
                <Activity className="w-4 h-4" />
                <span className="tracking-wide">Monitoring Center</span>
              </div>
              {criticalAlertsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full font-mono animate-pulse">
                  {criticalAlertsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('documents')}
              className={navItemClass('documents')}
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-4 h-4" />
                <span className="tracking-wide">Manajemen Dokumen</span>
              </div>
            </button>
            <button
              onClick={() => handleNav('reports')}
              className={navItemClass('reports')}
            >
              <div className="flex items-center gap-3.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="tracking-wide">Pelaporan Eksekutif</span>
              </div>
            </button>
          </div>

          {/* AI ASSISTANT INTELLIGENCE */}
          <div className="pt-2">
            <button
              onClick={() => handleNav('ai-assistant')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                activeMenu === 'ai-assistant'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                  : 'bg-[#232d4b] text-emerald-300 border-[#324068] hover:bg-[#2b375b] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="tracking-wide">KSKK AI Assistant</span>
              </div>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md font-bold">
                Smart
              </span>
            </button>
          </div>

          {/* ADMINISTRASI & AUDIT */}
          <div className="space-y-1.5 pt-2 border-t border-[#26314d]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
              Administrasi & Audit
            </p>
            <button
              onClick={() => handleNav('admin-audit')}
              className={navItemClass('admin-audit')}
            >
              <div className="flex items-center gap-3.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="tracking-wide">Audit Trail & RBAC</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3.5 border-t border-[#26314d] bg-[#14192b] text-[11px] text-slate-400 flex items-center justify-between tracking-wide">
          <span>KSKK-IMS v2.4 (2026)</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Terhubung
          </span>
        </div>
      </aside>
    </>
  );
};
