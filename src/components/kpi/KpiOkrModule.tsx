import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Award,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPI, Objective, KPICategory, KPIStatus } from '../../types';

export const KpiOkrModule: React.FC = () => {
  const { kpis, objectives, updateKPI } = useApp();

  const [activeTab, setActiveTab] = useState<'kpi' | 'okr'>('kpi');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for KPI Actual
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editActualVal, setEditActualVal] = useState<number>(0);

  const filteredKpis = kpis.filter((k) => {
    const matchesCat = filterCategory === 'ALL' || k.category === filterCategory;
    const matchesStat = filterStatus === 'ALL' || k.status === filterStatus;
    const matchesSearch =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.strategicObjective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  const handleStartEdit = (kpi: KPI) => {
    setEditingKpiId(kpi.id);
    setEditActualVal(kpi.actual);
  };

  const handleSaveActual = (kpiId: string) => {
    updateKPI(kpiId, editActualVal);
    setEditingKpiId(null);
  };

  const avgKpiAchievement = Math.round(
    kpis.reduce((acc, k) => acc + k.achievement, 0) / (kpis.length || 1),
  );
  const avgOkrProgress = Math.round(
    objectives.reduce((acc, o) => acc + o.progress, 0) / (objectives.length || 1),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Kinerja Strategis: KPI & OKR Terpadu
            </h2>
            <p className="text-xs text-slate-500">
              Pengukuran kinerja berbasis Sasaran Strategis Renstra Kemenag dan Key Results subdirektorat
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'kpi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>Key Performance Indicators ({kpis.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('okr')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'okr' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-violet-600" />
            <span>Objectives & Key Results ({objectives.length})</span>
          </button>
        </div>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Rata-Rata Capaian KPI</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 block tracking-tight leading-tight my-1 truncate">{avgKpiAchievement}%</span>
          <span className="text-xs text-emerald-600 font-bold block truncate">Status: Memenuhi Target</span>
        </div>
        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Progres Komposit OKR</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-900 block tracking-tight leading-tight my-1 truncate">{avgOkrProgress}%</span>
          <span className="text-xs text-indigo-600 font-bold block truncate">4 Sasaran Utama Berjalan</span>
        </div>
        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Indikator Terpenuhi</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-800 block tracking-tight leading-tight my-1 truncate">
            {kpis.filter((k) => k.status === 'Achieved').length} / {kpis.length}
          </span>
          <span className="text-xs text-slate-400 block truncate">Target ≥ 100%</span>
        </div>
        <div className="erp-card p-5 sm:p-6 space-y-1 min-w-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">Perlu Intervensi (Warning)</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-600 block tracking-tight leading-tight my-1 truncate">
            {kpis.filter((k) => k.status === 'Warning' || k.status === 'Critical').length}
          </span>
          <span className="text-xs text-amber-700 block truncate">Di bawah 80% capaian</span>
        </div>
      </div>

      {/* TAB 1: KPI MANAGEMENT */}
      {activeTab === 'kpi' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kode KPI, indikator, atau sasaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Strategic">Strategic KPI</option>
                <option value="Program">Program KPI</option>
                <option value="Project">Project KPI</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="Achieved">Achieved (≥100%)</option>
                <option value="On Track">On Track (80-99%)</option>
                <option value="Warning">Warning (60-79%)</option>
                <option value="Critical">Critical (&lt;60%)</option>
              </select>
            </div>
          </div>

          {/* KPI Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Kode & Indikator Kinerja (KPI)</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Sasaran Strategis</th>
                    <th className="py-3.5 px-4 text-center">Baseline</th>
                    <th className="py-3.5 px-4 text-center">Target</th>
                    <th className="py-3.5 px-4 text-center">Realisasi (Aktual)</th>
                    <th className="py-3.5 px-4">Capaian</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredKpis.map((kpi) => (
                    <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mb-0.5">
                          {kpi.code}
                        </span>
                        <p className="font-bold text-slate-900 leading-snug">{kpi.name}</p>
                        <p className="text-[10px] text-slate-400">Rumus: {kpi.calculationFormula}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {kpi.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed">{kpi.strategicObjective}</p>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {kpi.baseline} {kpi.unit}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                        {kpi.target} {kpi.unit}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {editingKpiId === kpi.id ? (
                          <div className="flex items-center gap-1 justify-center">
                            <input
                              type="number"
                              value={editActualVal}
                              onChange={(e) => setEditActualVal(parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-xs border border-indigo-500 rounded font-mono text-center focus:outline-hidden"
                            />
                            <button
                              onClick={() => handleSaveActual(kpi.id)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Simpan"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingKpiId(null)}
                              className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Batal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono font-extrabold text-indigo-900">
                            {kpi.actual} {kpi.unit}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-800">
                            <span>{kpi.achievement}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                kpi.achievement >= 100
                                  ? 'bg-emerald-600'
                                  : kpi.achievement >= 80
                                  ? 'bg-indigo-600'
                                  : kpi.achievement >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-600'
                              }`}
                              style={{ width: `${Math.min(100, kpi.achievement)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            kpi.status === 'Achieved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : kpi.status === 'On Track'
                              ? 'bg-indigo-100 text-indigo-800'
                              : kpi.status === 'Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {kpi.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleStartEdit(kpi)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Perbarui Capaian Aktual"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OKR MANAGEMENT */}
      {activeTab === 'okr' && (
        <div className="space-y-4">
          {objectives.map((obj) => (
            <div
              key={obj.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                      {obj.subdit}
                    </span>
                    <span className="text-[11px] text-slate-400">Periode: {obj.timeframe}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{obj.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Progres Rata-Rata</span>
                    <span className="text-base font-extrabold text-violet-900">{obj.progress}%</span>
                  </div>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full"
                      style={{ width: `${obj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Key Results Grid */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Key Results (KR) Terukur:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {obj.keyResults.map((kr) => (
                    <div
                      key={kr.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{kr.title}</h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            kr.confidenceLevel === 'High'
                              ? 'bg-emerald-100 text-emerald-800'
                              : kr.confidenceLevel === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Confidence: {kr.confidenceLevel}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>
                            Baseline: {kr.baseline} {kr.unit}
                          </span>
                          <span className="font-bold text-slate-900">
                            Aktual: {kr.current} / {kr.target} {kr.unit} ({kr.progress}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-600 rounded-full"
                            style={{ width: `${kr.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
