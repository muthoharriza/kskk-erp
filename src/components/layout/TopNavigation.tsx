import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Plus,
  FilePlus,
  FolderPlus,
  FileSpreadsheet,
  Bot,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface TopNavigationProps {
  onOpenMobileSidebar: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onOpenMobileSidebar }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    activeMenu,
    setActiveMenu,
    setIsSearchOpen,
    notifications,
    markAllNotificationsRead,
    overallAbsorptionRate,
    projects,
    setSelectedProjectId,
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSectionTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'projects':
        return 'Project Management';
      case 'budget':
        return 'Pengelolaan Anggaran (RAB)';
      case 'approval':
        return 'Approval Workflow';
      case 'kpi-okr':
        return 'Strategic KPI & OKR';
      case 'madrasah-db':
        return 'Database Madrasah';
      case 'madrasah-branding':
        return 'Branding & Publikasi';
      case 'monitoring':
        return 'Monitoring Center';
      case 'documents':
        return 'Repository Dokumen';
      case 'reports':
        return 'Laporan Eksekutif';
      case 'admin-audit':
        return 'Audit Trail & Log';
      case 'ai-assistant':
        return 'KSKK AI Assistant';
      default:
        return 'KSKK ERP Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile trigger + Header Titles */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Buka Navigasi"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/70 hidden sm:inline-block tracking-wider">
              KSKK-IMS
            </span>
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed truncate">
              {getSectionTitle()}
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide leading-relaxed">
            Direktorat KSKK Madrasah • Tahun Anggaran 2026
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/80 tracking-wide min-h-[42px]"
          aria-label="Cari data"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="hidden lg:inline">Cari data proyek, RAB, madrasah...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-400 border border-slate-200 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Action Button: Create New */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all tracking-wide min-h-[42px]"
            aria-label="Buat Baru"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Create New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
          </button>

          {isCreateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Aksi Cepat
              </div>
              <button
                onClick={() => {
                  setActiveMenu('projects');
                  setIsCreateDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors tracking-wide"
              >
                <FolderPlus className="w-4 h-4 text-blue-600" />
                <span>Usulan Proyek Baru</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenu('budget');
                  setIsCreateDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors tracking-wide"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Pengajuan RAB Baru</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenu('documents');
                  setIsCreateDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors tracking-wide"
              >
                <FilePlus className="w-4 h-4 text-purple-600" />
                <span>Unggah Dokumen TOR/SK</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenu('ai-assistant');
                  setIsCreateDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors tracking-wide"
              >
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Konsultasi AI KSKK</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 min-h-[42px] min-w-[42px] flex items-center justify-center"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs font-mono">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notifikasi Terkini
                  </h3>
                  <p className="text-[11px] text-slate-500 tracking-wide mt-0.5">
                    {unreadNotifs.length} pesan belum dibaca
                  </p>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold tracking-wide"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                          notif.priority === 'high' ? 'bg-rose-500' : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold text-slate-800 truncate tracking-wide">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-loose tracking-wide line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveMenu('monitoring');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-xl transition-colors tracking-wide"
                >
                  Buka Monitoring Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 min-h-[42px]"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20 shadow-2xs shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-snug truncate max-w-[120px] tracking-wide">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px] tracking-wide">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-76 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-5 py-3 border-b border-slate-100">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Pengguna Aktif
                </p>
                <p className="text-xs font-bold text-slate-900 mt-1 tracking-wide leading-relaxed">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate tracking-wide leading-relaxed">
                  {currentUser.email}
                </p>
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200/70 tracking-wider">
                  {currentUser.role}
                </span>
              </div>

              <div className="px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-1 mb-2">
                  Simulasikan Peran (RBAC)
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs tracking-wide transition-colors flex items-center justify-between ${
                        currentUser.id === u.id
                          ? 'bg-blue-50 text-blue-800 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate font-medium">{u.name}</span>
                        <span className="text-[10px] text-slate-400 block">{u.role}</span>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
