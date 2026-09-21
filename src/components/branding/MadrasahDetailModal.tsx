import React, { useState } from 'react';
import {
  X,
  School,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Award,
  Users,
  Star,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Madrasah } from '../../types';

interface MadrasahDetailModalProps {
  madrasahId: string;
  onClose: () => void;
}

export const MadrasahDetailModal: React.FC<MadrasahDetailModalProps> = ({
  madrasahId,
  onClose,
}) => {
  const { madrasahs, updateMadrasahBranding } = useApp();
  const madrasah = madrasahs.find((m) => m.id === madrasahId);

  const [activeTab, setActiveTab] = useState<'profile' | 'branding' | 'publications' | 'timeline'>(
    'profile',
  );

  // Edit scoring state
  const [identityScore, setIdentityScore] = useState(madrasah?.branding.identityScore || 70);
  const [digitalPresenceScore, setDigitalPresenceScore] = useState(
    madrasah?.branding.digitalPresenceScore || 70,
  );
  const [contentScore, setContentScore] = useState(madrasah?.branding.contentScore || 70);
  const [visualQualityScore, setVisualQualityScore] = useState(
    madrasah?.branding.visualQualityScore || 70,
  );
  const [communicationScore, setCommunicationScore] = useState(
    madrasah?.branding.communicationScore || 70,
  );
  const [engagementScore, setEngagementScore] = useState(
    madrasah?.branding.engagementScore || 70,
  );

  if (!madrasah) return null;

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    updateMadrasahBranding(madrasah.id, {
      identityScore,
      digitalPresenceScore,
      contentScore,
      visualQualityScore,
      communicationScore,
      engagementScore,
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Developing':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Needs Improvement':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Priority Support':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                NSM: {madrasah.nsm}
              </span>
              <span className="font-mono text-xs text-slate-500">NPSN: {madrasah.npsn}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">
                {madrasah.status} • {madrasah.jenjang} • Akreditasi {madrasah.akreditasi}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{madrasah.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {madrasah.alamat}, Kec. {madrasah.kecamatan}, {madrasah.kabupatenKota}, {madrasah.provinsi}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Branding Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Skor Total Branding</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-slate-900">{madrasah.branding.totalScore}</strong>
              <span className="text-slate-400">/ 100</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Kategori Tingkat Kesiapan</span>
            <span
              className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTierColor(
                madrasah.branding.tier,
              )}`}
            >
              {madrasah.branding.tier}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Kepala Madrasah</span>
            <strong className="text-slate-800 block truncate">{madrasah.kepalaMadrasah}</strong>
            <span className="text-[10px] text-slate-400">{madrasah.kontak}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Peserta Didik & Guru</span>
            <strong className="text-slate-800 block">
              {madrasah.jumlahSiswa.toLocaleString('id-ID')} Siswa • {madrasah.jumlahGuru} Guru
            </strong>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'profile', label: 'Profil Kelembagaan' },
            { id: 'branding', label: 'Analisis & Audit Branding' },
            { id: 'publications', label: `Publikasi & Medsos (${(madrasah.branding.publications || []).length})` },
            { id: 'timeline', label: 'Timeline Monitoring & Bantuan' },
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

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Identitas & Wilayah</h4>
                  <div className="space-y-1 text-slate-600">
                    <p>Provinsi: <strong className="text-slate-800">{madrasah.provinsi}</strong></p>
                    <p>Kabupaten/Kota: <strong className="text-slate-800">{madrasah.kabupatenKota}</strong></p>
                    <p>Kecamatan: <strong className="text-slate-800">{madrasah.kecamatan}</strong></p>
                    <p>Alamat Lengkap: <strong className="text-slate-800">{madrasah.alamat}</strong></p>
                    <p>Surel Resmi: <strong className="text-slate-800">{madrasah.email}</strong></p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Kanal Komunikasi Resmi</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-500">Website:</span>
                      <a
                        href={madrasah.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline font-medium"
                      >
                        {madrasah.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span className="text-slate-500">Instagram:</span>
                      <span className="font-mono text-slate-800">{madrasah.socialMedia?.instagram || madrasah.instagram || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span className="text-slate-500">YouTube:</span>
                      <span className="font-mono text-slate-800">{madrasah.socialMedia?.youtube || madrasah.youtube || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-500">Facebook:</span>
                      <span className="font-mono text-slate-800">{madrasah.socialMedia?.facebook || madrasah.facebook || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING AUDIT */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveScores} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">
                    Penilaian 6 Dimensi Branding KSKK (Skala 0 - 100)
                  </h4>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Perbarui Skor</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">1. Identitas Visual (Logo/Kop)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={identityScore}
                      onChange={(e) => setIdentityScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">2. Digital Presence (Web/SEO)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={digitalPresenceScore}
                      onChange={(e) => setDigitalPresenceScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">3. Kualitas Konten & Berita</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={contentScore}
                      onChange={(e) => setContentScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">4. Estetika Desain & Banner</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={visualQualityScore}
                      onChange={(e) => setVisualQualityScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">5. Komunikasi Publik & CS</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={communicationScore}
                      onChange={(e) => setCommunicationScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="font-semibold text-slate-700 block">6. Engagement Medsos</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={engagementScore}
                      onChange={(e) => setEngagementScore(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm border rounded font-mono font-bold"
                    />
                  </div>
                </div>
              </form>

              {/* Recommendations and Improvement Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Poin Perlu Perbaikan (Top Improvement Needs)
                  </h4>
                  <ul className="space-y-1 text-amber-950 pl-2">
                    {(madrasah.branding.improvementPoints || madrasah.branding.topImprovementNeeds || []).map((pt, i) => (
                      <li key={i}>• {pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Rekomendasi Tindakan Strategis KSKK
                  </h4>
                  <ul className="space-y-1 text-emerald-950 pl-2">
                    {(madrasah.branding.recommendedActions || []).map((act, i) => (
                      <li key={i}>• {act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PUBLICATIONS */}
          {activeTab === 'publications' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">Riwayat Publikasi & Konten Terakhir</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {(madrasah.branding.publications || []).map((pub) => (
                  <div key={pub.id} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {pub.channel}
                        </span>
                        <span className="text-[11px] text-slate-400">{pub.date}</span>
                      </div>
                      <p className="font-bold text-slate-800">{pub.title}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-500 font-mono text-[11px]">{pub.engagement}</span>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-emerald-700 hover:bg-emerald-50"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MONITORING TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">
                Siklus Dampingan: Assessment → Recommendation → Improvement → Monitoring → Reassessment
              </h4>
              <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <strong className="text-slate-900 block">Tahap 1: Initial Assessment (Audit Mandiri)</strong>
                  <p className="text-slate-600 text-[11px]">
                    Evaluasi identitas visual dan kanal website madrasah selesai dengan skor dasar{' '}
                    {madrasah.branding.totalScore}.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <strong className="text-slate-900 block">Tahap 2: Distribusi Modul & Brand Guidelines</strong>
                  <p className="text-slate-600 text-[11px]">
                    Pengiriman pedoman identitas visual Kemenag dan template medsos resmi kepada operator madrasah.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                  <strong className="text-slate-900 block">Tahap 3: Pendampingan & Monitoring Berkelanjutan</strong>
                  <p className="text-slate-600 text-[11px]">
                    Monitoring trafik portal dan pelatihan jurnalisme madrasah terjadwal Triwulan III 2026.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400">ID: {madrasah.id}</span>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
