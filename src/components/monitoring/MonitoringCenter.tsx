import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  TrendingDown,
  Wallet,
  Target,
  Star,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MonitoringAlert } from '../../types';

export const MonitoringCenter: React.FC = () => {
  const {
    alerts,
    setActiveMenu,
    setSelectedProjectId,
    setSelectedMadrasahId,
    addToast,
    addAuditLog,
  } = useApp();

  const [filterLevel, setFilterLevel] = useState<'ALL' | 'red' | 'yellow' | 'green'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const redAlerts = alerts.filter((a) => a.level === 'red');
  const yellowAlerts = alerts.filter((a) => a.level === 'yellow');
  const greenAlerts = alerts.filter((a) => a.level === 'green');

  const filteredAlerts = alerts.filter((a) => {
    const matchLevel = filterLevel === 'ALL' || a.level === filterLevel;
    const matchCategory = filterCategory === 'ALL' || a.category === filterCategory;
    return matchLevel && matchCategory;
  });

  const handleAction = (alert: MonitoringAlert) => {
    addAuditLog('ALERT_ACTION', 'Monitoring', alert.title, undefined, alert.actionText);
    addToast('info', 'Tindakan Diproses', `Mengalihkan ke ${alert.actionText}...`);

    if (alert.category === 'Project') {
      if (alert.targetId) setSelectedProjectId(alert.targetId);
      setActiveMenu('projects');
    } else if (alert.category === 'Approval') {
      setActiveMenu('approval');
    } else if (alert.category === 'KPI') {
      setActiveMenu('kpi-okr');
    } else if (alert.category === 'Madrasah' || alert.category === 'Branding') {
      if (alert.targetId) setSelectedMadrasahId(alert.targetId);
      setActiveMenu('madrasah-branding');
    } else if (alert.category === 'Budget') {
      setActiveMenu('budget');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
            <Activity className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Pusat Pengawasan & Sistem Peringatan Dini (Early Warning)
            </h2>
            <p className="text-xs text-slate-500">
              Deteksi otomatis anomali jadwal proyek, keterlambatan approval, deviasi anggaran, dan madrasah prioritas afirmasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            Sistem Aktif 24/7 (Real-time Audit)
          </span>
        </div>
      </div>

      {/* 3 Status Visual Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Red Alert */}
        <div
          onClick={() => setFilterLevel(filterLevel === 'red' ? 'ALL' : 'red')}
          className={`erp-card p-5 sm:p-6 cursor-pointer transition-all shadow-2xs min-w-0 ${
            filterLevel === 'red'
              ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-400'
              : 'border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 uppercase tracking-wider truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0"></span>
              <span className="truncate">Red Alert (Kritis)</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-900 tracking-tight shrink-0">{redAlerts.length}</span>
          </div>
          <p className="text-xs text-slate-600 leading-normal line-clamp-2">
            Perlu tindakan segera: Terlambat &gt;14 hari, serapan &lt;50%, approval macet.
          </p>
        </div>

        {/* Yellow Warning */}
        <div
          onClick={() => setFilterLevel(filterLevel === 'yellow' ? 'ALL' : 'yellow')}
          className={`erp-card p-5 sm:p-6 cursor-pointer transition-all shadow-2xs min-w-0 ${
            filterLevel === 'yellow'
              ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400'
              : 'border-amber-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">Yellow Warning</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-tight shrink-0">{yellowAlerts.length}</span>
          </div>
          <p className="text-xs text-slate-600 leading-normal line-clamp-2">
            Perlu pemantauan: Deviasi jadwal 5-10%, keterlambatan verifikasi berkas.
          </p>
        </div>

        {/* Green Normal */}
        <div
          onClick={() => setFilterLevel(filterLevel === 'green' ? 'ALL' : 'green')}
          className={`erp-card p-5 sm:p-6 cursor-pointer transition-all shadow-2xs min-w-0 ${
            filterLevel === 'green'
              ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400'
              : 'border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Green Normal</span>
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight shrink-0">{greenAlerts.length}</span>
          </div>
          <p className="text-xs text-slate-600 leading-normal line-clamp-2">
            Berjalan sesuai rencana kerja, output tepat waktu dan tertib administrasi.
          </p>
        </div>
      </div>

      {/* Filter Category Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Kategori:</span>
          {['ALL', 'Project', 'Budget', 'Approval', 'KPI', 'Madrasah'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {filterLevel !== 'ALL' && (
          <button
            onClick={() => setFilterLevel('ALL')}
            className="text-xs text-rose-600 hover:underline font-bold"
          >
            Tampilkan Semua Level
          </button>
        )}
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
              alert.level === 'red'
                ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                : alert.level === 'yellow'
                ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  alert.level === 'red'
                    ? 'bg-rose-100 text-rose-700'
                    : alert.level === 'yellow'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {alert.level === 'red' ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : alert.level === 'yellow' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.level === 'red'
                        ? 'bg-rose-200 text-rose-900'
                        : alert.level === 'yellow'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {alert.level} alert
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Kategori: {alert.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400">{alert.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{alert.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => handleAction(alert)}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  alert.level === 'red'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : alert.level === 'yellow'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>{alert.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
