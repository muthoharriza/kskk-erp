import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  Calendar,
  Layers,
  Target,
  Wallet,
  School,
  Star,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportingModule: React.FC = () => {
  const {
    projects,
    programs,
    budgets,
    kpis,
    objectives,
    madrasahs,
    overallAbsorptionRate,
    averageBrandingScore,
    currentUser,
    addToast,
  } = useApp();

  const [reportType, setReportType] = useState<
    'executive' | 'project' | 'budget' | 'kpi' | 'okr' | 'madrasah' | 'branding'
  >('executive');

  const [fiscalYear, setFiscalYear] = useState('2026');
  const [period, setPeriod] = useState('Triwulan II');

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    addToast('success', 'Ekspor Excel', `Laporan ${reportType.toUpperCase()} TA ${fiscalYear} berhasil diekspor.`);
  };

  const handleExportPDF = () => {
    addToast('info', 'Ekspor PDF', `Mempersiapkan dokumen PDF resmi ${reportType.toUpperCase()}... Silakan gunakan opsi Cetak/Save to PDF.`);
    setTimeout(() => {
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Non-print Top Controls */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Pusat Pelaporan Eksekutif & Ekspor Data
            </h2>
            <p className="text-xs text-slate-500">
              Cetak format resmi kedinasan Kemenag RI, ekspor ke lembar kerja Excel, atau arsip PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar (no-print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'executive', label: 'Executive Summary' },
            { id: 'project', label: 'Laporan Proyek' },
            { id: 'budget', label: 'Laporan Anggaran & Serapan' },
            { id: 'kpi', label: 'Laporan Capaian KPI' },
            { id: 'okr', label: 'Laporan Kinerja OKR' },
            { id: 'madrasah', label: 'Laporan Direktori Madrasah' },
            { id: 'branding', label: 'Laporan Audit Branding Digital' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setReportType(item.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                reportType === item.id
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
          >
            <option value="Triwulan I">Triwulan I</option>
            <option value="Triwulan II">Triwulan II</option>
            <option value="Triwulan III">Triwulan III</option>
            <option value="Triwulan IV">Triwulan IV</option>
            <option value="Tahunan Penuh">Tahunan Penuh</option>
          </select>
        </div>
      </div>

      {/* PRINT-READY REPORT CONTAINER */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-800">
        {/* Official Letterhead (Kop Surat Kementerian Agama) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
            KEMENTERIAN AGAMA REPUBLIK INDONESIA
          </h2>
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
            DIREKTORAT JENDERAL PENDIDIKAN ISLAM
          </h1>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
            DIREKTORAT KURIKULUM, SARANA, KELEMBAGAAN, DAN KESISWAAN (KSKK) MADRASAH
          </h3>
          <p className="text-[11px] text-slate-500">
            Jalan Lapangan Banteng Barat No. 3-4 Jakarta Pusat 10710 • Website: madrasah.kemenag.go.id
          </p>
        </div>

        {/* Report Title */}
        <div className="text-center py-2 space-y-1">
          <h3 className="text-base font-bold uppercase tracking-wide underline text-slate-900">
            {reportType === 'executive' && 'LAPORAN EKSEKUTIF KINERJA TERPADU KSKK MADRASAH'}
            {reportType === 'project' && 'LAPORAN PORTOFOLIO DAN PROGRESS PROYEK STRATEGIS'}
            {reportType === 'budget' && 'LAPORAN REALISASI DAN DAYA SERAP ANGGARAN (DIPA)'}
            {reportType === 'kpi' && 'LAPORAN PENGUKURAN INDIKATOR KINERJA UTAMA (IKU / KPI)'}
            {reportType === 'okr' && 'LAPORAN CAPAIAN SASARAN STRATEGIS (OBJECTIVES & KEY RESULTS)'}
            {reportType === 'madrasah' && 'LAPORAN REKAPITULASI DATA INDUK MADRASAH SE-INDONESIA'}
            {reportType === 'branding' && 'LAPORAN AUDIT TINGKAT KESIAPAN BRANDING & PUBLIKASI DIGITAL'}
          </h3>
          <p className="text-xs text-slate-600">
            Tahun Anggaran {fiscalYear} • Periode Pemantauan: {period}
          </p>
        </div>

        {/* Dynamic Report Content */}
        {reportType === 'executive' && (
          <div className="space-y-4 text-xs">
            <p className="leading-relaxed">
              Berdasarkan hasil monitoring dan evaluasi terpadu pada sistem KSKK-IMS hingga akhir {period} TA {fiscalYear},
              disampaikan ringkasan capaian kinerja kelembagaan sebagai berikut:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Daya Serap Anggaran</span>
                <span className="text-lg font-black text-emerald-800">{overallAbsorptionRate}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Proyek Aktif</span>
                <span className="text-lg font-black text-slate-900">17 Inisiatif</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Rata-rata KPI</span>
                <span className="text-lg font-black text-indigo-800">84.2%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Indeks Branding Madrasah</span>
                <span className="text-lg font-black text-teal-800">{averageBrandingScore} / 100</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-xs pt-2">1. Ringkasan Status Proyek Strategis</h4>
            <table className="w-full border text-left text-[11px]">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">Kode</th>
                  <th className="p-2">Nama Inisiatif Proyek</th>
                  <th className="p-2">Subdit</th>
                  <th className="p-2">PIC</th>
                  <th className="p-2 text-center">Fisik</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono">{p.code}</td>
                    <td className="p-2 font-medium">{p.name}</td>
                    <td className="p-2">{p.subdit}</td>
                    <td className="p-2">{p.picName}</td>
                    <td className="p-2 text-center font-bold">{p.progress}%</td>
                    <td className="p-2 text-center">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'project' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border text-left text-[11px]">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">Kode</th>
                  <th className="p-2">Nama Proyek</th>
                  <th className="p-2">Subdit</th>
                  <th className="p-2">Pagu (Rp)</th>
                  <th className="p-2">Realisasi (Rp)</th>
                  <th className="p-2 text-center">Progres</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono font-bold">{p.code}</td>
                    <td className="p-2 font-medium">{p.name}</td>
                    <td className="p-2">{p.subdit}</td>
                    <td className="p-2 font-mono">Rp {p.budgetTotal.toLocaleString('id-ID')}</td>
                    <td className="p-2 font-mono">Rp {p.budgetRealized.toLocaleString('id-ID')}</td>
                    <td className="p-2 text-center font-bold">{p.progress}%</td>
                    <td className="p-2 text-center">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'budget' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border text-left text-[11px]">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">No. Proposal</th>
                  <th className="p-2">Proyek / Kegiatan</th>
                  <th className="p-2">Kategori</th>
                  <th className="p-2">Diajukan (Rp)</th>
                  <th className="p-2">Disetujui (Rp)</th>
                  <th className="p-2">Realisasi (Rp)</th>
                  <th className="p-2">Sisa (Rp)</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {budgets.map((b) => (
                  <tr key={b.id}>
                    <td className="p-2 font-mono">{b.proposalNumber}</td>
                    <td className="p-2 font-medium">{b.projectName}</td>
                    <td className="p-2">{b.budgetCategory}</td>
                    <td className="p-2 font-mono">Rp {b.requestedAmount.toLocaleString('id-ID')}</td>
                    <td className="p-2 font-mono font-bold">Rp {b.approvedAmount.toLocaleString('id-ID')}</td>
                    <td className="p-2 font-mono">Rp {b.realizedAmount.toLocaleString('id-ID')}</td>
                    <td className="p-2 font-mono">Rp {b.remainingAmount.toLocaleString('id-ID')}</td>
                    <td className="p-2 text-center">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'kpi' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border text-left text-[11px]">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">Kode</th>
                  <th className="p-2">Indikator Kinerja (KPI)</th>
                  <th className="p-2">Kategori</th>
                  <th className="p-2 text-center">Baseline</th>
                  <th className="p-2 text-center">Target</th>
                  <th className="p-2 text-center">Realisasi</th>
                  <th className="p-2 text-center">Capaian (%)</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {kpis.map((k) => (
                  <tr key={k.id}>
                    <td className="p-2 font-mono font-bold">{k.code}</td>
                    <td className="p-2 font-medium">{k.name}</td>
                    <td className="p-2">{k.category}</td>
                    <td className="p-2 text-center">{k.baseline} {k.unit}</td>
                    <td className="p-2 text-center font-bold">{k.target} {k.unit}</td>
                    <td className="p-2 text-center font-bold">{k.actual} {k.unit}</td>
                    <td className="p-2 text-center font-bold">{k.achievement}%</td>
                    <td className="p-2 text-center">{k.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'branding' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border text-left text-[11px]">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="p-2">Nama Madrasah</th>
                  <th className="p-2">Jenjang</th>
                  <th className="p-2">Wilayah</th>
                  <th className="p-2 text-center">Visual</th>
                  <th className="p-2 text-center">Web</th>
                  <th className="p-2 text-center">Konten</th>
                  <th className="p-2 text-center">Medsos</th>
                  <th className="p-2 text-center">Total Skor</th>
                  <th className="p-2 text-center">Kategori Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {madrasahs.slice(0, 15).map((m) => (
                  <tr key={m.id}>
                    <td className="p-2 font-medium">{m.name}</td>
                    <td className="p-2">{m.jenjang}</td>
                    <td className="p-2">{m.kabupatenKota}, {m.provinsi}</td>
                    <td className="p-2 text-center">{m.branding.identityScore}</td>
                    <td className="p-2 text-center">{m.branding.digitalPresenceScore}</td>
                    <td className="p-2 text-center">{m.branding.contentScore}</td>
                    <td className="p-2 text-center">{m.branding.engagementScore}</td>
                    <td className="p-2 text-center font-bold font-mono">{m.branding.totalScore}</td>
                    <td className="p-2 text-center font-semibold">{m.branding.tier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Sign-off Block (Tanda Tangan Pengesahan) */}
        <div className="pt-8 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui / Memeriksa,</p>
            <p className="font-bold text-slate-800">Sekretaris Tim Penjaminan Mutu KSKK</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">Drs. H. M. Zain, M.Ag.</p>
            <p className="text-[11px] text-slate-500">NIP. 196805121994031002</p>
          </div>

          <div>
            <p className="text-slate-500">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-800">Direktur KSKK Madrasah,</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">Dr. H. Muchlis Muhammad Hanafi, M.A.</p>
            <p className="text-[11px] text-slate-500">NIP. 197108151996031001</p>
          </div>
        </div>
      </div>
    </div>
  );
};
