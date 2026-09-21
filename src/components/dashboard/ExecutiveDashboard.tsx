import React, { useState } from 'react';
import {
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  PieChart as PieIcon,
  Target,
  Star,
  School,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Calendar,
  Building,
  DollarSign,
  Layers,
  FileText,
  Activity,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExecutiveDashboard: React.FC = () => {
  const {
    currentUser,
    programs,
    projects,
    budgets,
    kpis,
    objectives,
    madrasahs,
    alerts,
    overallAbsorptionRate,
    averageBrandingScore,
    setActiveMenu,
    setSelectedProjectId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'projects' | 'branding' | 'alerts'>('overview');
  const [cashflowPeriod, setCashflowPeriod] = useState<'30days' | 'quarter' | 'year'>('30days');
  const [salesPeriod, setSalesPeriod] = useState<'30days' | 'currentYear'>('30days');
  const [plPeriod, setPlPeriod] = useState<'currentYear' | 'lastYear'>('currentYear');

  // Stats calculation
  const totalProgramsCount = 48;
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'Completed').length;
  const atRiskProjectsCount = projects.filter((p) => p.status === 'At Risk' || p.status === 'Delayed').length;

  const kpiAverage = Math.round(kpis.reduce((acc, k) => acc + k.achievement, 0) / (kpis.length || 1));
  const okrAverage = Math.round(objectives.reduce((acc, o) => acc + o.progress, 0) / (objectives.length || 1));

  // Financial aggregates (DIPA KSKK)
  const paguTotal = 1450000000000; // Rp 1.45 Triliun
  const realisasiTotal = 1136800000000; // Rp 1.136 Triliun
  const sisaTotal = paguTotal - realisasiTotal; // Rp 313.2 Miliar
  const komitmenReview = 185000000000; // Rp 185 Miliar under review

  // Monthly breakdown for Profit & Loss / Realisasi per Bulan bar chart (Deskera style)
  const monthlyRealization = [
    { month: 'Jan', value: 38, label: '38M' },
    { month: 'Feb', value: 85, label: '85M' },
    { month: 'Mar', value: 145, label: '145M' },
    { month: 'Apr', value: 210, label: '210M' },
    { month: 'Mei', value: 285, label: '285M' },
    { month: 'Jun', value: 198, label: '198M' },
    { month: 'Jul', value: 125, label: '125M' },
    { month: 'Ags', value: 30, label: '30M (Est)' },
    { month: 'Sep', value: 0, label: '-' },
    { month: 'Okt', value: 0, label: '-' },
    { month: 'Nov', value: 0, label: '-' },
    { month: 'Des', value: 0, label: '-' },
  ];

  // Subdirektorat allocation list (Deskera "Bank Account" style)
  const subditAccounts = [
    { name: 'Kurikulum & Evaluasi', pagu: 'Rp 385.0 M', realisasi: 'Rp 312.4 M', status: 'positive' },
    { name: 'Sarana & Prasarana', pagu: 'Rp 450.0 M', realisasi: 'Rp 368.5 M', status: 'positive' },
    { name: 'Kelembagaan & Kerjasama', pagu: 'Rp 260.0 M', realisasi: 'Rp 198.2 M', status: 'positive' },
    { name: 'Kesiswaan & Prestasi', pagu: 'Rp 220.0 M', realisasi: 'Rp 174.6 M', status: 'positive' },
    { name: 'Tata Usaha & Operasional', pagu: 'Rp 135.0 M', realisasi: 'Rp 83.1 M', status: 'neutral' },
  ];

  return (
    <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. TOP PORTFOLIO PERFORMANCE BANNER (KeroUI Style from erp2.webp) */}
      <div className="erp-card p-6 sm:p-8 lg:p-10 space-y-8 overflow-hidden">
        {/* Header & Sub-navigation Tabs */}
        <div className="space-y-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold tracking-wider uppercase leading-none">
              <span>Direktorat KSKK Madrasah</span>
              <span>•</span>
              <span className="text-blue-600 font-bold">Executive Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Performance Operational
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl">
              Pusat komando terintegrasi pemantauan program kerja, realisasi anggaran DIPA 2026, capaian KPI/OKR, dan reputasi digital madrasah se-Indonesia.
            </p>
          </div>

          {/* Sub Navigation Menu - Placed in its own row and fully contained inside the card */}
          <div className="w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto max-w-full">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'budget', label: 'Realisasi DIPA' },
                { id: 'projects', label: 'Proyek Strategis' },
                { id: 'branding', label: 'Branding Madrasah' },
                { id: 'alerts', label: 'Anomali & Mitigasi' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'budget') setActiveMenu('budget');
                    if (tab.id === 'projects') setActiveMenu('projects');
                    if (tab.id === 'branding') setActiveMenu('madrasah-branding');
                    if (tab.id === 'alerts') setActiveMenu('monitoring');
                  }}
                  className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl whitespace-nowrap transition-all duration-150 text-xs sm:text-sm font-semibold tracking-wide shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Prominent Stat Metric Circles (Portfolio Performance KeroUI erp2.webp style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Metric 1: Total Pagu */}
          <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold shrink-0 border border-amber-500/25">
              <DollarSign className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase leading-snug">
                Pagu Alokasi DIPA
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight my-1">
                Rp 1,45 Triliun
              </h3>
              <p className="text-xs sm:text-sm text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>100% Pagu Tersedia (APBN 2026)</span>
              </p>
            </div>
          </div>

          {/* Metric 2: Realisasi Anggaran */}
          <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold shrink-0 border border-rose-500/25">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase leading-snug">
                Realisasi Anggaran (SP2D)
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight my-1">
                Rp 1,14 Triliun
              </h3>
              <p className="text-xs sm:text-sm text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>+14.1% Serapan YoY ({overallAbsorptionRate}%)</span>
              </p>
            </div>
          </div>

          {/* Metric 3: Mutu Branding Madrasah */}
          <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-500/25">
              <School className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase leading-snug">
                Indeks Mutu Branding
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight my-1">
                84.8 <span className="text-lg sm:text-xl text-slate-400 font-bold">/ 100</span>
              </h3>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 shrink-0 fill-blue-600/20" />
                <span>Tier Kuat & Berkembang ({madrasahs.length} Madrasah)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Banner */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => setActiveMenu('reports')}
            className="px-8 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 tracking-wider min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Lihat Laporan Eksekutif Lengkap</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN ERP ROW 1: CASHFLOW + KOMPOSISI STATUS ANGGARAN (Balanced 7 : 5 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* A. CASHFLOW AREA CHART (lg:col-span-7) */}
        <div className="lg:col-span-7 erp-card p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
                Cashflow Realisasi DIPA
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-normal tracking-wide">
                Perbandingan Alokasi Pagu vs Realisasi SP2D Kumulatif
              </p>
            </div>

            <div className="self-start sm:self-center">
              <button
                onClick={() => setCashflowPeriod(cashflowPeriod === '30days' ? 'quarter' : '30days')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 tracking-wide min-h-[40px]"
              >
                <span>{cashflowPeriod === '30days' ? 'Last 30 days' : 'Tahunan 2026'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Legend Dots */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="tracking-wide">Pagu Terdistribusi</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="tracking-wide">Realisasi SP2D</span>
            </div>
          </div>

          {/* Area Chart Simulation (Curved area fill like Deskera Cashflow) */}
          <div className="relative pt-2">
            <div className="h-56 sm:h-64 w-full flex items-end justify-between relative border-b border-slate-200">
              {/* SVG Area Shapes */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="paguGradLoose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="realGradLoose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                {/* Pagu Area & Line */}
                <path
                  d="M 0,55 Q 16,50 33,42 T 66,35 T 100,20 L 100,100 L 0,100 Z"
                  fill="url(#paguGradLoose)"
                />
                <path
                  d="M 0,55 Q 16,50 33,42 T 66,35 T 100,20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Realisasi Area & Line */}
                <path
                  d="M 0,75 Q 16,68 33,52 T 66,45 T 100,28 L 100,100 L 0,100 Z"
                  fill="url(#realGradLoose)"
                />
                <path
                  d="M 0,75 Q 16,68 33,52 T 66,45 T 100,28"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Y Axis Guides */}
              <div className="absolute left-0 top-1 text-[10px] sm:text-xs font-mono text-slate-400">Rp 1.45T</div>
              <div className="absolute left-0 top-1/2 text-[10px] sm:text-xs font-mono text-slate-400">Rp 725M</div>
              <div className="absolute left-0 bottom-1 text-[10px] sm:text-xs font-mono text-slate-400">0</div>
            </div>

            {/* X Axis Months */}
            <div className="flex justify-between text-xs font-mono text-slate-400 pt-3 px-2 tracking-wider">
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>Mei</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Ags</span>
            </div>
          </div>

          {/* 3 Metrics Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Alokasi DIPA</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">Rp 1,45 T</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Realisasi SP2D</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-600 block mt-0.5">Rp 1,14 T</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Daya Serap</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-700 block mt-0.5">{overallAbsorptionRate}%</span>
            </div>
          </div>
        </div>

        {/* B. UPCOMING INVOICES / STATUS DIPA DONUT (lg:col-span-5) */}
        <div className="lg:col-span-5 erp-card p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
              Komposisi & Status Anggaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-normal tracking-wide">
              Rincian Alokasi DIPA Tahun Anggaran 2026
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Radial Donut Simulation */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="78, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-rose-500"
                  strokeDasharray="13, 100"
                  strokeDashoffset="-78"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total DIPA</span>
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">Rp 1.45T</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-3.5 text-xs sm:text-sm w-full sm:w-auto">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-slate-600 font-semibold">Realisasi SP2D (78.4%)</span>
                </div>
                <strong className="block pl-4.5 text-emerald-700 font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
                  Rp 1.136,8 M
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-slate-600 font-semibold">Dalam Review (12.8%)</span>
                </div>
                <strong className="block pl-4.5 text-rose-700 font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
                  Rp 185,0 M
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-slate-600 font-semibold">Sisa Pagu Terbuka (8.8%)</span>
                </div>
                <strong className="block pl-4.5 text-slate-800 font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
                  Rp 128,2 M
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveMenu('approval')}
            className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-bold transition-colors tracking-wide text-center min-h-[44px]"
          >
            Review Persetujuan Terbuka
          </button>
        </div>
      </div>

      {/* 3. MAIN ERP ROW 2: STATUS PENYERAPAN (PROGRESS BAR) + TREN REALISASI PER BULAN (Balanced 6 : 6 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* A. STATUS PENYERAPAN DIPA (lg:col-span-6) */}
        <div className="lg:col-span-6 erp-card p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
                Status Tagihan & Penyerapan (DIPA)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-normal tracking-wide">
                Komposisi Realisasi SP2D vs Sisa Pagu Terbuka
              </p>
            </div>

            <div className="self-start sm:self-center">
              <button
                onClick={() => setSalesPeriod(salesPeriod === '30days' ? 'currentYear' : '30days')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 tracking-wide min-h-[40px]"
              >
                <span>{salesPeriod === '30days' ? 'Last 30 days' : 'Tahun 2026'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Big Currency Metrics with Clean Proportions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <p className="text-xs text-blue-800 font-bold tracking-wider uppercase">Realisasi Diserap</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-700 tracking-tight leading-tight mt-1">
                Rp 1.136,8 M
              </h3>
              <span className="text-xs text-blue-600 font-semibold mt-0.5 block">78.4% dari Pagu DIPA</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Sisa Pagu Belum SP2D</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mt-1">
                Rp 313,2 M
              </h3>
              <span className="text-xs text-slate-500 font-semibold mt-0.5 block">21.6% Pagu Tersedia</span>
            </div>
          </div>

          {/* Horizontal Multi-color Progress Bar with ample breathing room */}
          <div className="space-y-4 pt-2">
            <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: '78.4%' }} title="Realisasi SP2D 78.4%"></div>
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: '14.5%' }} title="Dalam Proses 14.5%"></div>
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: '7.1%' }} title="Deviasi Jadwal 7.1%"></div>
            </div>

            {/* Legend beneath the bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
                <span>Terealisasi SP2D (78.4%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Verifikasi Kemenkeu (14.5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
                <span>Deviasi / At Risk (7.1%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* B. PROFIT & LOSS / MONTHLY BAR CHART (lg:col-span-6) */}
        <div className="lg:col-span-6 erp-card p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
                Tren Realisasi Anggaran per Bulan
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-normal tracking-wide">
                Distribusi Pembayaran SP2D (Januari - Desember 2026)
              </p>
            </div>

            <div className="self-start sm:self-center">
              <button
                onClick={() => setPlPeriod(plPeriod === 'currentYear' ? 'lastYear' : 'currentYear')}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 tracking-wide min-h-[40px]"
              >
                <span>{plPeriod === 'currentYear' ? 'Current Year' : 'Tahun Lalu'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Bar Chart Container with Horizontal Scroll on Small Phones */}
          <div className="relative pt-4 overflow-x-auto">
            <div className="min-w-[440px] sm:min-w-0">
              <div className="h-52 w-full flex items-end justify-between gap-2 px-2 border-b border-slate-200">
                {monthlyRealization.map((item, idx) => {
                  const heightPercent = item.value > 0 ? (item.value / 300) * 100 : 4;
                  const isCurrent = item.month === 'Jun' || item.month === 'Jul';
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-slate-700 mb-1.5">
                        {item.label}
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          isCurrent
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : item.value > 0
                            ? 'bg-blue-400/80 hover:bg-blue-500'
                            : 'bg-slate-100'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Months Axis */}
              <div className="flex justify-between text-xs font-mono text-slate-400 pt-3 px-1 tracking-wider">
                {monthlyRealization.map((item, idx) => (
                  <span key={idx} className="flex-1 text-center truncate">
                    {item.month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN ERP ROW 3: ALOKASI & KINERJA PER SUBDIREKTORAT (Dedicated Full Width Section) */}
      <div className="erp-card p-6 sm:p-8 lg:p-9 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
              Alokasi Anggaran & Serapan per Subdirektorat
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-normal tracking-wide mt-0.5">
              Monitoring Saldo Pagu DIPA 2026 dan Serapan SP2D per Unit Kerja Direktorat KSKK Madrasah
            </p>
          </div>
          <button
            onClick={() => setActiveMenu('budget')}
            className="self-start sm:self-center px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            Lihat Rincian Akun DIPA Lengkap →
          </button>
        </div>

        {/* 5 Subdit Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {subditAccounts.map((item, idx) => {
            const percentage = idx === 0 ? 81.1 : idx === 1 ? 81.9 : idx === 2 ? 76.2 : idx === 3 ? 79.4 : 61.6;
            const isOnTrack = percentage >= 75;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      Subdit 0{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isOnTrack ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isOnTrack ? 'On Track' : 'Perhatian'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 font-medium">Realisasi</span>
                    <span className="font-extrabold text-sm text-emerald-700">{item.realisasi}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-slate-500">
                    <span>Pagu Total</span>
                    <span className="font-semibold">{item.pagu}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOnTrack ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-500 font-mono">
                    {percentage}% Terserap
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM 4 KPI HIGHLIGHT CARDS (KeroUI Style from erp2.webp bottom cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Card 1: Proyek Aktif (Green bottom border) */}
        <div className="erp-card border-b-4 border-b-emerald-500 p-5 sm:p-6 space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
              Proyek Aktif
            </span>
            <span className="text-emerald-700 text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 shrink-0">
              38 Unit
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight my-1">
            38 <span className="text-base sm:text-lg font-bold text-slate-500">Proyek</span>
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            26 Selesai • 12 Sedang Berjalan
          </p>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 25">
              <path
                d="M 0,20 Q 25,5 50,18 T 100,6"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Daya Serap DIPA (Blue bottom border) */}
        <div className="erp-card border-b-4 border-b-blue-600 p-5 sm:p-6 space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
              Daya Serap DIPA
            </span>
            <span className="text-blue-700 text-xs font-extrabold px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 shrink-0">
              Target 75%
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 tracking-tight leading-tight my-1">
            {overallAbsorptionRate}%
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            Di atas target nasional (75%)
          </p>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 25">
              <path
                d="M 0,22 Q 25,12 50,8 T 100,4"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Capaian KPI (Amber/Yellow bottom border) */}
        <div className="erp-card border-b-4 border-b-amber-500 p-5 sm:p-6 space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
              Capaian KPI
            </span>
            <span className="text-amber-700 text-xs font-extrabold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 shrink-0">
              9/10 On Track
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-600 tracking-tight leading-tight my-1">
            {kpiAverage}%
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            9 dari 10 Indikator On Track
          </p>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 25">
              <path
                d="M 0,15 Q 30,22 60,10 T 100,7"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Database Madrasah (Rose/Red bottom border) */}
        <div className="erp-card border-b-4 border-b-rose-500 p-5 sm:p-6 space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">
              Madrasah Terekam
            </span>
            <span className="text-rose-700 text-xs font-extrabold px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 shrink-0">
              34 Provinsi
            </span>
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight my-1">
            4.820 <span className="text-base sm:text-lg font-bold text-slate-500">Lembaga</span>
          </h4>
          <p className="text-xs text-slate-500 leading-normal">
            34 Provinsi terintegrasi SIMPATIKA
          </p>
          <div className="h-6 w-full pt-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 25">
              <path
                d="M 0,18 Q 25,8 50,15 T 100,5"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 5. EARLY WARNING & DETEKSI ANOMALI */}
      <div className="erp-card p-6 sm:p-8 lg:p-9 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-wide leading-relaxed">
                Early Warning & Deteksi Anomali
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                Peringatan dini keterlambatan serapan, deviasi fisik, atau risiko madrasah
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveMenu('monitoring')}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 tracking-wider self-start sm:self-center min-h-[40px]"
          >
            <span>Buka Monitoring Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border flex items-start gap-4 transition-colors overflow-hidden ${
                alert.level === 'red'
                  ? 'bg-rose-50/50 border-rose-200'
                  : alert.level === 'orange'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-yellow-50/50 border-yellow-200'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  alert.level === 'red'
                    ? 'text-rose-600'
                    : alert.level === 'orange'
                    ? 'text-amber-600'
                    : 'text-yellow-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 truncate">
                    {alert.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{alert.timestamp}</span>
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {alert.title}
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-normal line-clamp-2">
                  {alert.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
