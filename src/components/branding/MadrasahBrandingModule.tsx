import React, { useState } from 'react';
import {
  Star,
  Award,
  TrendingUp,
  AlertTriangle,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  School,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Madrasah, BrandingTier } from '../../types';
import { MadrasahDetailModal } from './MadrasahDetailModal';

export const MadrasahBrandingModule: React.FC = () => {
  const {
    madrasahs,
    selectedMadrasahId,
    setSelectedMadrasahId,
    averageBrandingScore,
  } = useApp();

  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [filterJenjang, setFilterJenjang] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tier Counts
  const strongCount = madrasahs.filter((m) => m.branding.tier === 'Strong').length;
  const devCount = madrasahs.filter((m) => m.branding.tier === 'Developing').length;
  const needCount = madrasahs.filter((m) => m.branding.tier === 'Needs Improvement').length;
  const priorityCount = madrasahs.filter((m) => m.branding.tier === 'Priority Support').length;

  // Filtered
  const filteredList = madrasahs.filter((m) => {
    const matchTier = filterTier === 'ALL' || m.branding.tier === filterTier;
    const matchJenjang = filterJenjang === 'ALL' || m.jenjang === filterJenjang;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kabupatenKota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provinsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTier && matchJenjang && matchSearch;
  });

  // Leaderboard Top 5
  const leaderboard = [...madrasahs]
    .sort((a, b) => b.branding.totalScore - a.branding.totalScore)
    .slice(0, 5);

  // Bottom 5 priority
  const prioritySupportList = [...madrasahs]
    .sort((a, b) => a.branding.totalScore - b.branding.totalScore)
    .slice(0, 5);

  const getTierBadge = (tier: BrandingTier) => {
    switch (tier) {
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Developing':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Needs Improvement':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Priority Support':
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
            <Star className="w-5 h-5 text-teal-700 fill-teal-700/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Monitoring Branding & Publikasi Digital Madrasah
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi kepatuhan identitas visual, maturitas media digital, dan efektivitas komunikasi publik madrasah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-bold">
            Indeks Nasional: {averageBrandingScore} / 100
          </span>
        </div>
      </div>

      {/* 4 Tier Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Tier Strong */}
        <div className="erp-card p-5 sm:p-6 space-y-1 border-emerald-200 bg-emerald-50/20 shadow-2xs min-w-0">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
            <span className="truncate">Strong (80 - 100)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-950 block tracking-tight leading-tight my-1 truncate">
            {strongCount} <span className="text-sm sm:text-base font-bold text-emerald-700">Madrasah</span>
          </span>
          <p className="text-xs text-emerald-700 truncate">Branding mandiri & engagement tinggi</p>
        </div>

        {/* Tier Developing */}
        <div className="erp-card p-5 sm:p-6 space-y-1 border-sky-200 bg-sky-50/20 shadow-2xs min-w-0">
          <div className="flex items-center justify-between text-xs text-sky-800 font-bold mb-1">
            <span className="truncate">Developing (60 - 79)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0"></span>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sky-950 block tracking-tight leading-tight my-1 truncate">
            {devCount} <span className="text-sm sm:text-base font-bold text-sky-700">Madrasah</span>
          </span>
          <p className="text-xs text-sky-700 truncate">Website aktif, konten konsisten</p>
        </div>

        {/* Tier Needs Improvement */}
        <div className="erp-card p-5 sm:p-6 space-y-1 border-amber-200 bg-amber-50/20 shadow-2xs min-w-0">
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
            <span className="truncate">Needs Improvement (40-59)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950 block tracking-tight leading-tight my-1 truncate">
            {needCount} <span className="text-sm sm:text-base font-bold text-amber-700">Madrasah</span>
          </span>
          <p className="text-xs text-amber-700 truncate">Kanal pasif, identitas belum standar</p>
        </div>

        {/* Tier Priority Support */}
        <div className="erp-card p-5 sm:p-6 space-y-1 border-rose-200 bg-rose-50/20 shadow-2xs min-w-0">
          <div className="flex items-center justify-between text-xs text-rose-800 font-bold mb-1">
            <span className="truncate">Priority Support (&lt;40)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-rose-950 block tracking-tight leading-tight my-1 truncate">
            {priorityCount} <span className="text-sm sm:text-base font-bold text-rose-700">Madrasah</span>
          </span>
          <p className="text-xs text-rose-700 truncate">Belum memiliki kanal digital resmi</p>
        </div>
      </div>

      {/* Leaderboard & Strategic Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaderboard Top 5 (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Leaderboard Madrasah Terunggul Digital
              </h3>
              <p className="text-xs text-slate-500">Madrasah percontohan dengan skor publikasi tertinggi</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setSelectedMadrasahId(m.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 leading-snug">
                      {m.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {m.kabupatenKota}, {m.provinsi} • {m.jenjang}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900 font-mono">
                      {m.branding.totalScore}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ 100</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Improvement Needs & Recommended Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Poin Perbaikan Nasional (Top Improvement Needs)
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Isu paling sering ditemukan pada hasil assessment madrasah se-Indonesia
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">
                  1. Kepatuhan Logo Standar & Color Palette Kemenag
                </span>
                <span className="font-bold text-amber-700">72% Madrasah Belum Patuh</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">
                  2. Keamanan & Update Berkala Website (SSL / Malware)
                </span>
                <span className="font-bold text-rose-700">48% Website Tidak Terawat</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">
                  3. Kualitas Visual Desain Konten & Infografis
                </span>
                <span className="font-bold text-amber-700">65% Perlu Pendampingan Desain</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">
                  4. Penanganan Komentar / Layanan Respon Publik
                </span>
                <span className="font-bold text-slate-700">54% Waktu Respon &gt; 24 Jam</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rekomendasi Tindakan Strategis Direktorat KSKK
            </h3>
            <p className="text-xs text-slate-500 mb-2">Program afirmasi dan intervensi yang sedang berjalan</p>

            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                <span>
                  Distribusi <strong>Brand Kit & Template Medsos Resmi Kemenag</strong> ke seluruh Kanwil.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                <span>
                  Pelatihan <strong>Bimbingan Teknis Jurnalistik & Pengelolaan Portal Madrasah</strong> bagi 1,000 operator.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                <span>
                  Pemberian <strong>Afirmasi Domain madrasah.id & Cloud Hosting</strong> gratis untuk madrasah Tier Priority Support.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Madrasah Branding Explorer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Direktori Kesiapan Digital Madrasah</h3>
            <p className="text-xs text-slate-500">Klik madrasah untuk melihat rincian 6 dimensi penilaian dan riwayat konten</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Cari nama atau wilayah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            >
              <option value="ALL">Semua Tier</option>
              <option value="Strong">Strong</option>
              <option value="Developing">Developing</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Priority Support">Priority Support</option>
            </select>

            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="RA">RA</option>
              <option value="MI">MI</option>
              <option value="MTs">MTs</option>
              <option value="MA">MA</option>
              <option value="MAK">MAK</option>
            </select>
          </div>
        </div>

        {/* Grid of Madrasah Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMadrasahId(m.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer bg-slate-50/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {m.jenjang} • {m.status}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{m.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {m.kabupatenKota}, {m.provinsi}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getTierBadge(
                    m.branding.tier,
                  )}`}
                >
                  {m.branding.totalScore}
                </span>
              </div>

              {/* 6 Dimension Mini Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <div className="flex justify-between">
                  <span>Visual & Web:</span>
                  <span className="font-semibold text-slate-800">
                    {m.branding.identityScore} / {m.branding.digitalPresenceScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Konten & Engagement:</span>
                  <span className="font-semibold text-slate-800">
                    {m.branding.contentScore} / {m.branding.engagementScore}
                  </span>
                </div>
              </div>

              {/* Medsos icons strip */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <Youtube className="w-3.5 h-3.5 text-red-600" />
                </div>
                <span className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-0.5">
                  Audit <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL TRIGGER */}
      {selectedMadrasahId && (
        <MadrasahDetailModal
          madrasahId={selectedMadrasahId}
          onClose={() => setSelectedMadrasahId(null)}
        />
      )}
    </div>
  );
};
