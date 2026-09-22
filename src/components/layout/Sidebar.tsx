import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Building2,
  Network,
  GraduationCap,
  Cpu,
  Mail,
  Archive,
  Send,
  GitBranch,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  Layers,
  Bot,
  Activity,
  FolderKanban,
  Wallet,
  CheckSquare,
} from 'lucide-react';
import { useApp, NavigationMenu } from '../../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const {
    activeMenu,
    setActiveMenu,
    suratMasuk,
    disposisiList,
    subdits,
  } = useApp();

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isOtherModulesOpen, setIsOtherModulesOpen] = useState(false);

  const pendingSuratCount = suratMasuk.filter((s) => s.status === 'Baru').length;
  const activeDisposisiCount = disposisiList.filter((d) => d.status !== 'Selesai').length;

  const handleNav = (menu: NavigationMenu) => {
    setActiveMenu(menu);
    setIsMobileOpen(false);
  };

  const navItemClass = (menu: NavigationMenu) => {
    const isActive = activeMenu === menu;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm font-bold'
        : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#171e33] text-slate-200 border-r border-[#26314d] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Unit */}
        <div className="p-4 border-b border-[#242f4c]">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-[#212b48] hover:bg-[#283457] transition-colors cursor-pointer border border-[#2f3d64]"
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
            <div className="mt-2 p-2 rounded-xl bg-[#141a2e] border border-[#2c3859] space-y-1 text-xs">
              <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pilih Unit Langsung
              </p>
              <button
                onClick={() => {
                  handleNav('dashboard');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Dashboard Utama (Semua Subdit)
              </button>
              <button
                onClick={() => {
                  handleNav('subdit-kurikulum');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subdit Kurikulum dan Evaluasi
              </button>
              <button
                onClick={() => {
                  handleNav('subdit-sarpras');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subdit Sarana Prasarana
              </button>
              <button
                onClick={() => {
                  handleNav('subdit-kelembagaan');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subdit Kelembagaan dan Kerjasama
              </button>
              <button
                onClick={() => {
                  handleNav('subdit-kesiswaan');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subdit Kesiswaan
              </button>
              <button
                onClick={() => {
                  handleNav('subdit-vokasi');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subdit Pendidikan Vokasi dan Inklusi
              </button>
              <button
                onClick={() => {
                  handleNav('tata-usaha');
                  setIsWorkspaceOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Subbag Tata Usaha Direktorat
              </button>
            </div>
          )}
        </div>

        {/* Navigation List - RESTRUCTURED ACCORDING TO USER'S EXACT INSTRUCTIONS */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 text-xs">
          
          {/* ======================================================== */}
          {/* 1. MENU DASHBOARD (SEMUA LAPORAN, ANGGARAN, AKADEMIK)    */}
          {/* ======================================================== */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Utama
            </p>
            <button
              onClick={() => handleNav('dashboard')}
              className={navItemClass('dashboard')}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="text-left">
                  <span className="tracking-wide block font-bold">Dashboard KSKK</span>
                  <span className="text-[10px] text-slate-400 font-normal block">
                    Semua Laporan & Alokasi Anggaran
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* ======================================================== */}
          {/* 2. MENU SUB DIREKTORAT (5 SUBDIT SPESIFIK)               */}
          {/* ======================================================== */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu Sub Direktorat
              </p>
              <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">
                5 Subdit
              </span>
            </div>

            {/* Subdit Kurikulum dan Evaluasi */}
            <button
              onClick={() => handleNav('subdit-kurikulum')}
              className={navItemClass('subdit-kurikulum')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="tracking-wide truncate">Kurikulum & Evaluasi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {/* Subdit Sarana Prasarana */}
            <button
              onClick={() => handleNav('subdit-sarpras')}
              className={navItemClass('subdit-sarpras')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="tracking-wide truncate">Sarana Prasarana</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {/* Subdit Kelembagaan dan Kerjasama */}
            <button
              onClick={() => handleNav('subdit-kelembagaan')}
              className={navItemClass('subdit-kelembagaan')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Network className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="tracking-wide truncate">Kelembagaan & Kerjasama</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {/* Subdit Kesiswaan */}
            <button
              onClick={() => handleNav('subdit-kesiswaan')}
              className={navItemClass('subdit-kesiswaan')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="tracking-wide truncate">Kesiswaan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>

            {/* Subdit Pendidikan Vokasi dan Inklusi */}
            <button
              onClick={() => handleNav('subdit-vokasi')}
              className={navItemClass('subdit-vokasi')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="tracking-wide truncate">Pendidikan Vokasi & Inklusi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* 3. SUBBAG TATA USAHA DIREKTORAT (ARSIP, SM, SK, DISPOSISI)*/}
          {/* ======================================================== */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tata Usaha Direktorat
              </p>
            </div>

            <button
              onClick={() => handleNav('tata-usaha')}
              className={navItemClass('tata-usaha')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left min-w-0">
                  <span className="tracking-wide block truncate">Subbag Tata Usaha</span>
                  <span className="text-[10px] text-slate-400 font-normal block truncate">
                    Arsip • Surat Masuk • Keluar • Disposisi
                  </span>
                </div>
              </div>
              {activeDisposisiCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full font-mono shrink-0 ml-1">
                  {activeDisposisiCount}
                </span>
              )}
            </button>
          </div>

          {/* ======================================================== */}
          {/* 4. MODUL SISTEM TAMBAHAN (COLLAPSIBLE / OPTIONAL)        */}
          {/* ======================================================== */}
          <div className="pt-2 border-t border-[#26314d]">
            <button
              onClick={() => setIsOtherModulesOpen(!isOtherModulesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Modul Pendukung & AI</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isOtherModulesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOtherModulesOpen && (
              <div className="mt-1 space-y-1 pl-2">
                <button
                  onClick={() => handleNav('ai-assistant')}
                  className={navItemClass('ai-assistant')}
                >
                  <div className="flex items-center gap-2.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>KSKK AI Assistant</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('monitoring')}
                  className={navItemClass('monitoring')}
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    <span>Monitoring Center</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('projects')}
                  className={navItemClass('projects')}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                    <span>Project Management</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('budget')}
                  className={navItemClass('budget')}
                >
                  <div className="flex items-center gap-2.5">
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    <span>RAB & Usulan Anggaran</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('approval')}
                  className={navItemClass('approval')}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approval Workflow</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3.5 border-t border-[#26314d] bg-[#121626] text-[11px] text-slate-400 flex items-center justify-between tracking-wide">
          <span>KSKK Kemenag 2026</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};
