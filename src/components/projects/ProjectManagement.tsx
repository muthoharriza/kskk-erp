import React, { useState } from 'react';
import {
  FolderKanban,
  List,
  Kanban,
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus, SubditType, PriorityLevel } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';

export const ProjectManagement: React.FC = () => {
  const {
    projects,
    programs,
    selectedProjectId,
    setSelectedProjectId,
    addProject,
    updateProject,
    currentUser,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'timeline'>('table');
  const [filterSubdit, setFilterSubdit] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Project Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCode, setNewCode] = useState(`KSKK-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newName, setNewName] = useState('');
  const [newSubdit, setNewSubdit] = useState<SubditType>('Kurikulum & Evaluasi');
  const [newProgramId, setNewProgramId] = useState(programs[0]?.id || '');
  const [newPicName, setNewPicName] = useState(currentUser.name);
  const [newBudget, setNewBudget] = useState('5000000000');
  const [newStartDate, setNewStartDate] = useState('2026-03-01');
  const [newEndDate, setNewEndDate] = useState('2026-11-30');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');
  const [newDescription, setNewDescription] = useState('');

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const matchesSubdit = filterSubdit === 'ALL' || p.subdit === filterSubdit;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || p.priority === filterPriority;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.picName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubdit && matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const prog = programs.find((pr) => pr.id === newProgramId);

    addProject({
      code: newCode,
      name: newName,
      subdit: newSubdit,
      programId: newProgramId,
      programName: prog ? prog.name : 'Program Strategis KSKK',
      picName: newPicName,
      budgetTotal: parseFloat(newBudget) || 1000000000,
      startDate: newStartDate,
      endDate: newEndDate,
      priority: newPriority,
      description: newDescription || 'Inisiasi program penguatan madrasah terintegrasi.',
      status: 'Planning',
    });

    setIsCreateOpen(false);
    setNewName('');
    setNewDescription('');
    setNewCode(`KSKK-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  const formatRupiah = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const kanbanColumns: { status: ProjectStatus; title: string; color: string }[] = [
    { status: 'Planning', title: 'Perencanaan', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { status: 'In Progress', title: 'Pelaksanaan (On Track)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { status: 'At Risk', title: 'Berisiko (At Risk)', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    { status: 'Delayed', title: 'Terlambat (Delayed)', color: 'bg-rose-50 text-rose-800 border-rose-300' },
    { status: 'Completed', title: 'Selesai (Completed)', color: 'bg-sky-50 text-sky-800 border-sky-300' },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-16 font-sans">
      {/* Title & Actions Bar */}
      <div className="erp-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3.5">
            <span className="p-3 rounded-2xl bg-blue-100 text-blue-800">
              <FolderKanban className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide leading-relaxed">
                Project Management & Portofolio
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-loose tracking-wide mt-1">
                Monitoring pelaksanaan inisiatif program kerja di lingkungan Direktorat KSKK Madrasah
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch View Buttons */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Timeline</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Inisiasi Proyek</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards with Proportional Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Total Proyek</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 block tracking-tight leading-tight my-1 truncate">
            {projects.length} <span className="text-sm sm:text-base font-bold text-slate-400">Unit</span>
          </span>
          <span className="text-xs text-slate-400 block truncate">Lintas 5 Subdirektorat</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1 border-emerald-200 bg-emerald-50/15 min-w-0">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block truncate">Selesai 100%</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-800 block tracking-tight leading-tight my-1 truncate">
            {projects.filter((p) => p.status === 'Completed').length} <span className="text-sm sm:text-base font-bold text-emerald-600">Proyek</span>
          </span>
          <span className="text-xs text-emerald-700/80 block truncate">Output terlaksana penuh</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block truncate">Dalam Pelaksanaan</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 block tracking-tight leading-tight my-1 truncate">
            {projects.filter((p) => p.status === 'In Progress').length} <span className="text-sm sm:text-base font-bold text-blue-500">Proyek</span>
          </span>
          <span className="text-xs text-slate-400 block truncate">Sesuai milestone jadwal</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1 border-amber-200 bg-amber-50/15 min-w-0">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block truncate">Perlu Perhatian</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-700 block tracking-tight leading-tight my-1 truncate">
            {projects.filter((p) => p.status === 'At Risk' || p.status === 'Delayed').length} <span className="text-sm sm:text-base font-bold text-amber-600">Proyek</span>
          </span>
          <span className="text-xs text-amber-700/80 block truncate">Deviasi & kendala berkas</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode proyek, nama, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subdit Filter */}
          <select
            value={filterSubdit}
            onChange={(e) => setFilterSubdit(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Subdirektorat</option>
            <option value="Kurikulum & Evaluasi">Kurikulum & Evaluasi</option>
            <option value="Kesiswaan">Kesiswaan</option>
            <option value="Guru & Tenaga Kependidikan">Guru & Tenaga Kependidikan</option>
            <option value="Sarana & Prasarana">Sarana & Prasarana</option>
            <option value="Kelembagaan & Kerjasama">Kelembagaan & Kerjasama</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(filterSubdit !== 'ALL' || filterStatus !== 'ALL' || filterPriority !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setFilterSubdit('ALL');
                setFilterStatus('ALL');
                setFilterPriority('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:underline px-2 py-1 font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Kode & Proyek</th>
                  <th className="py-3.5 px-4">Subdit / Unit</th>
                  <th className="py-3.5 px-4">PIC</th>
                  <th className="py-3.5 px-4">Pagu / Realisasi</th>
                  <th className="py-3.5 px-4">Jadwal</th>
                  <th className="py-3.5 px-4">Progres</th>
                  <th className="py-3.5 px-4">Prioritas</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mb-0.5">
                        {p.code}
                      </div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.programName}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {p.subdit}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{p.picName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.picNip}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{formatRupiah(p.budgetTotal)}</span>
                      <span className="text-[10px] text-emerald-700">
                        Serap: {formatRupiah(p.budgetRealized)} ({((p.budgetRealized / p.budgetTotal) * 100).toFixed(0)}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {p.startDate.substring(5)} s/d {p.endDate.substring(5)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{p.progress}%</span>
                          <span className="text-slate-400 text-[10px]">{p.completedTasksCount}/{p.tasksCount}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : p.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          p.status === 'Completed'
                            ? 'bg-sky-100 text-sky-800'
                            : p.status === 'In Progress'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'At Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : p.status === 'Delayed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(p.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Buka Detail Proyek"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colProjects = filteredProjects.filter((p) => p.status === col.status);
            return (
              <div key={col.status} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/90 flex flex-col min-w-[250px]">
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${col.color}`}>
                  <span className="font-bold text-xs">{col.title}</span>
                  <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                    {colProjects.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                  {colProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">
                          {p.code}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            p.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {p.name}
                      </h4>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Progres</span>
                          <span className="font-bold text-slate-800">{p.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="truncate max-w-[120px]">{p.picName}</span>
                        <span className="font-bold text-slate-800">{formatRupiah(p.budgetTotal)}</span>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                      Tidak ada proyek
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: TIMELINE / GANTT VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 overflow-hidden">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800">Visualisasi Jadwal Pelaksanaan (Gantt Chart 2026)</h3>
            <p className="text-xs text-slate-500">Rentang waktu pelaksanaan proyek per bulan dalam Tahun Anggaran 2026</p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[750px]">
              {/* Month Header */}
              <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-slate-500 uppercase pb-2 border-b border-slate-200 text-center">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>Mei</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Agu</span>
                <span>Sep</span>
                <span>Okt</span>
                <span>Nov</span>
                <span>Des</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 py-2">
                {filteredProjects.slice(0, 10).map((p) => {
                  // Rough month indices from dates (e.g. 2026-02-01 -> month 2)
                  const startM = parseInt(p.startDate.split('-')[1], 10);
                  const endM = parseInt(p.endDate.split('-')[1], 10);
                  const colSpan = Math.max(1, endM - startM + 1);

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className="py-2.5 hover:bg-slate-50 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">
                            {p.code}
                          </span>
                          <span className="font-bold text-slate-800 group-hover:text-emerald-700">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          {p.progress}% • {p.startDate} s/d {p.endDate}
                        </span>
                      </div>

                      {/* Bar Grid */}
                      <div className="grid grid-cols-12 gap-1 h-5 bg-slate-50 rounded-lg p-0.5 relative">
                        <div
                          className="h-full rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 text-[10px] text-white font-bold flex items-center px-2 truncate shadow-2xs"
                          style={{
                            gridColumnStart: startM,
                            gridColumnEnd: `span ${colSpan}`,
                          }}
                        >
                          {p.status} ({p.progress}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Inisiasi Usulan Proyek Baru KSKK</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Proyek</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subdirektorat</label>
                  <select
                    value={newSubdit}
                    onChange={(e) => setNewSubdit(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Kurikulum & Evaluasi">Kurikulum & Evaluasi</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Guru & Tenaga Kependidikan">Guru & Tenaga Kependidikan</option>
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Kelembagaan & Kerjasama">Kelembagaan & Kerjasama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Inisiatif Proyek</label>
                <input
                  type="text"
                  placeholder="Contoh: Digitalisasi Laboratorium Robotik dan Coding Madrasah Aliyah"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Program Induk (Renstra)</label>
                  <select
                    value={newProgramId}
                    onChange={(e) => setNewProgramId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    {programs.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.code} - {pr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIC Penanggung Jawab</label>
                  <input
                    type="text"
                    value={newPicName}
                    onChange={(e) => setNewPicName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pagu Anggaran (Rp)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tingkat Prioritas</label>
                <div className="flex gap-4">
                  {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((pri) => (
                    <label key={pri} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        checked={newPriority === pri}
                        onChange={() => setNewPriority(pri)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Prioritas {pri}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan & Tujuan Proyek</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan latar belakang, sasaran output, dan dampak strategis proyek ini bagi madrasah..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan & Daftarkan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL MODAL TRIGGER */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
