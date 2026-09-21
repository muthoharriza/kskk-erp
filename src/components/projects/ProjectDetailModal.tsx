import React, { useState } from 'react';
import {
  X,
  Calendar,
  UserCheck,
  Building,
  Wallet,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  Shield,
  Layers,
  Flag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, TaskItem, Milestone, RiskItem } from '../../types';

interface ProjectDetailModalProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ projectId, onClose }) => {
  const { projects, updateProject, currentUser } = useApp();
  const project = projects.find((p) => p.id === projectId);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'tasks' | 'budget' | 'kpi' | 'documents' | 'risks' | 'activity'
  >('overview');

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Risk form state
  const [newRiskDesc, setNewRiskDesc] = useState('');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');
  const [newRiskLevel, setNewRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  if (!project) return null;

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = project.tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });

    const completed = updatedTasks.filter((t) => t.status === 'Completed').length;
    const progress = Math.round((completed / (updatedTasks.length || 1)) * 100);

    updateProject(project.id, {
      tasks: updatedTasks,
      completedTasksCount: completed,
      progress,
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      projectId: project.id,
      title: newTaskTitle,
      assignedTo: newTaskAssignee || currentUser.name,
      assignee: newTaskAssignee || currentUser.name,
      dueDate: newTaskDueDate || '2026-09-30',
      status: 'Todo',
      priority: 'Medium',
    };

    const updatedTasks = [...project.tasks, newTask];
    updateProject(project.id, {
      tasks: updatedTasks,
      tasksCount: updatedTasks.length,
    });

    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskDesc.trim()) return;

    const newRisk: RiskItem = {
      id: `risk-${Date.now()}`,
      projectId: project.id,
      type: 'Risk',
      title: newRiskDesc.slice(0, 40),
      description: newRiskDesc,
      severity: newRiskLevel,
      level: newRiskLevel,
      mitigationPlan: newRiskMitigation || 'Koordinasi intensif dengan satuan kerja terkait.',
      mitigation: newRiskMitigation || 'Koordinasi intensif dengan satuan kerja terkait.',
      status: 'Open',
      reportedDate: new Date().toISOString().substring(0, 10),
      owner: currentUser.name,
    };

    updateProject(project.id, {
      risks: [...project.risks, newRisk],
    });

    setNewRiskDesc('');
    setNewRiskMitigation('');
  };

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {project.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{project.programName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600 font-semibold">{project.subdit}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {project.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">PIC Penanggung Jawab</span>
            <strong className="text-slate-800 font-semibold">{project.picName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Jadwal Pelaksanaan</span>
            <strong className="text-slate-800 font-semibold">
              {project.startDate} s/d {project.endDate}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pagu Anggaran</span>
            <strong className="text-emerald-700 font-bold">{formatRupiah(project.budgetTotal)}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Progres Fisik</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <strong className="text-slate-800 font-bold">{project.progress}%</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Ringkasan & Overview' },
            { id: 'tasks', label: `Tugas & Milestone (${project.tasks.length})` },
            { id: 'budget', label: 'Rincian Anggaran' },
            { id: 'risks', label: `Risiko & Isu (${project.risks.length})` },
            { id: 'documents', label: 'Dokumen / Lampiran' },
            { id: 'activity', label: 'Jejak Aktivitas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-1 text-sm">Deskripsi Inisiatif</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-bold text-slate-800">Detail Organisasi</h4>
                  <div className="space-y-1 text-slate-600">
                    <p>Subdirektorat: <strong className="text-slate-800">{project.subdit}</strong></p>
                    <p>Program Kerja: <strong className="text-slate-800">{project.programName}</strong></p>
                    <p>NIP PIC: <strong className="font-mono text-slate-800">{project.picNip}</strong></p>
                    <p>Email: <strong className="text-slate-800">{project.picEmail}</strong></p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-bold text-slate-800">Status & Prioritas</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Status Operasional:</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Tingkat Prioritas:</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {project.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Tugas Diselesaikan:</span>
                      <span className="font-semibold text-slate-800">
                        {project.completedTasksCount} dari {project.tasksCount} item
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones list */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Milestone Kunci Proyek</h4>
                <div className="space-y-2">
                  {project.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            m.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{m.title}</p>
                          <p className="text-[11px] text-slate-400">Target: {m.targetDate}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Add task form */}
              <form onSubmit={handleAddTask} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  placeholder="Nama tugas baru..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                <input
                  type="text"
                  placeholder="PIC..."
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-32 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-36 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </form>

              {/* Task list */}
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => {}}
                        className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                      />
                      <div>
                        <p
                          className={`font-semibold text-slate-800 ${
                            task.status === 'Completed' ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          PIC: {task.assignee} • Jatuh Tempo: {task.dueDate}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500">Pagu Total</span>
                  <p className="text-base font-extrabold text-slate-900">{formatRupiah(project.budgetTotal)}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800">Realisasi SP2D</span>
                  <p className="text-base font-extrabold text-emerald-900">{formatRupiah(project.budgetRealized)}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[11px] text-amber-800">Sisa Anggaran</span>
                  <p className="text-base font-extrabold text-amber-900">
                    {formatRupiah(project.budgetTotal - project.budgetRealized)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Penyerapan Anggaran Terhadap Fisik</h4>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Rasio realisasi anggaran proyek ini tercatat sebesar{' '}
                  <strong className="text-emerald-700">
                    {((project.budgetRealized / project.budgetTotal) * 100).toFixed(1)}%
                  </strong>{' '}
                  berbanding lurus dengan capaian progres fisik di angka{' '}
                  <strong className="text-slate-900">{project.progress}%</strong>.
                </p>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(project.budgetRealized / project.budgetTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RISKS & ISSUES */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <form onSubmit={handleAddRisk} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Identifikasi Risiko / Isu Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Deskripsi potensi risiko..."
                    value={newRiskDesc}
                    onChange={(e) => setNewRiskDesc(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                  <select
                    value={newRiskLevel}
                    onChange={(e) => setNewRiskLevel(e.target.value as any)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Low">Tingkat: Rendah</option>
                    <option value="Medium">Tingkat: Sedang</option>
                    <option value="High">Tingkat: Tinggi (Kritis)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Rencana mitigasi dan tindakan penanganan..."
                    value={newRiskMitigation}
                    onChange={(e) => setNewRiskMitigation(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                  >
                    Catat Risiko
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {project.risks.map((risk) => (
                  <div key={risk.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{risk.description}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.level === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : risk.level === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {risk.level} Risk
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      <strong>Mitigasi:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="font-bold text-slate-700">Lampiran Resmi Proyek</p>
                <p className="text-[11px] text-slate-500">
                  Kerangka Acuan Kerja (KAK / TOR), RAB, SK Tim, dan Berita Acara
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="font-bold text-slate-800">KAK-TOR_{project.code}_Final.pdf</p>
                      <p className="text-[11px] text-slate-400">Diunggah: {project.startDate} • 2.4 MB</p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200">
                    Unduh
                  </button>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-teal-700" />
                    <div>
                      <p className="font-bold text-slate-800">RAB_Rincian_Kebutuhan_{project.code}.xlsx</p>
                      <p className="text-[11px] text-slate-400">Diunggah: {project.startDate} • 1.1 MB</p>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:bg-teal-50 rounded border border-teal-200">
                    Unduh
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs">Jejak Aktivitas & Perubahan</h4>
              <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                {project.activities.map((act) => (
                  <div key={act.id} className="relative pb-2">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                    <div className="text-slate-800 font-semibold">{act.action}</div>
                    <div className="text-[11px] text-slate-500">{act.detail}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {act.timestamp} oleh <strong className="text-slate-600">{act.user}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Kode Sistem: {project.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
