import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FolderKanban,
  School,
  Target,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    projects,
    programs,
    madrasahs,
    kpis,
    documents,
    users,
    setActiveMenu,
    setSelectedProjectId,
    setSelectedMadrasahId,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items
  const matchedProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.picName.toLowerCase().includes(q),
      )
    : projects.slice(0, 3);

  const matchedPrograms = q
    ? programs.filter(
        (pr) => pr.name.toLowerCase().includes(q) || pr.code.toLowerCase().includes(q),
      )
    : [];

  const matchedMadrasahs = q
    ? madrasahs.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provinsi.toLowerCase().includes(q) ||
          m.kabupatenKota.toLowerCase().includes(q) ||
          m.nsm.includes(q),
      )
    : madrasahs.slice(0, 3);

  const matchedKpis = q
    ? kpis.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.code.toLowerCase().includes(q) ||
          k.strategicObjective.toLowerCase().includes(q),
      )
    : [];

  const matchedDocs = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.docNumber.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q),
      )
    : documents.slice(0, 2);

  const matchedUsers = q
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          (u.nip && u.nip.includes(q)),
      )
    : [];

  const hasResults =
    matchedProjects.length > 0 ||
    matchedPrograms.length > 0 ||
    matchedMadrasahs.length > 0 ||
    matchedKpis.length > 0 ||
    matchedDocs.length > 0 ||
    matchedUsers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari Proyek, Program, Madrasah, KPI, Dokumen, atau Pejabat KSKK..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-200/80 text-slate-600 hover:bg-slate-300 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!hasResults && query && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Tidak ditemukan hasil untuk kata kunci <span className="font-bold text-slate-700">"{query}"</span>.
            </div>
          )}

          {/* Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <FolderKanban className="w-3.5 h-3.5 text-emerald-600" />
                <span>Proyek ({matchedProjects.length})</span>
              </div>
              <div className="space-y-1">
                {matchedProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setActiveMenu('projects');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-50/60 hover:border-emerald-200 border border-transparent transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">
                          {p.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                          {p.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PIC: {p.picName} • Progres: {p.progress}% • Status: {p.status}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Madrasah */}
          {matchedMadrasahs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <School className="w-3.5 h-3.5 text-teal-600" />
                <span>Madrasah ({matchedMadrasahs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedMadrasahs.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMadrasahId(m.id);
                      setActiveMenu('madrasah-db');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-teal-50/60 hover:border-teal-200 border border-transparent transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                          {m.name}
                        </span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {m.status} • {m.jenjang}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        NSM: {m.nsm} • {m.kabupatenKota}, {m.provinsi} • Skor Branding: {m.branding.totalScore}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KPI */}
          {matchedKpis.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                <span>KPI & Kinerja ({matchedKpis.length})</span>
              </div>
              <div className="space-y-1">
                {matchedKpis.slice(0, 3).map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      setActiveMenu('kpi-okr');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-indigo-50/60 hover:border-indigo-200 border border-transparent transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded font-bold">
                          {k.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {k.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Target: {k.target} {k.unit} • Capaian: {k.achievement}% • Status: {k.status}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Dokumen Resmi ({matchedDocs.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDocs.slice(0, 3).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveMenu('documents');
                      setIsSearchOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-amber-50/60 hover:border-amber-200 border border-transparent transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                        {d.title}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {d.docNumber} • Kategori: {d.category} • Format: {d.fileFormat} ({d.fileSize})
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-slate-700">↓</kbd> untuk memilih</span>
          <span>KSKK Integrated Search Engine</span>
        </div>
      </div>
    </div>
  );
};
