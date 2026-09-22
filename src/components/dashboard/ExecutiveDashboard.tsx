import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BookOpen,
  Building2,
  Network,
  GraduationCap,
  Cpu,
  Mail,
  Calendar,
  Clock,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ArrowUpRight,
  Filter,
  Layers,
  Archive,
} from 'lucide-react';
import { useApp, NavigationMenu } from '../../context/AppContext';

export const ExecutiveDashboard: React.FC = () => {
  const {
    subdits,
    grandTotalPagu,
    grandTotalRealisasi,
    grandTotalSisa,
    grandTotalPersenSerapan,
    suratMasuk,
    suratKeluar,
    disposisiList,
    arsipTUList,
    setActiveMenu,
  } = useApp();

  const [filterKategori, setFilterKategori] = useState<'semua' | 'Keuangan' | 'Akademik' | 'Agenda'>('semua');

  // Format currency helper
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Subdit navigation mapping
  const getSubditRoute = (id: string): NavigationMenu => {
    switch (id) {
      case 'kurikulum':
        return 'subdit-kurikulum';
      case 'sarpras':
        return 'subdit-sarpras';
      case 'kelembagaan':
        return 'subdit-kelembagaan';
      case 'kesiswaan':
        return 'subdit-kesiswaan';
      case 'vokasi-inklusi':
        return 'subdit-vokasi';
      default:
        return 'dashboard';
    }
  };

  // Get Subdit Icon
  const getSubditIcon = (id: string) => {
    switch (id) {
      case 'kurikulum':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'sarpras':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'kelembagaan':
        return <Network className="w-5 h-5 text-emerald-600" />;
      case 'kesiswaan':
        return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'vokasi-inklusi':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  // Consolidate all uploads from all subdits and TU
  const allUploads = React.useMemo(() => {
    const list: Array<{
      id: string;
      unit: string;
      judul: string;
      kategori: string;
      tanggal: string;
      uploader: string;
      ukuran: string;
    }> = [];

    // From subdits
    subdits.forEach((s) => {
      s.uploadsList.forEach((up) => {
        list.push({
          id: up.id,
          unit: s.singkatan,
          judul: up.judul,
          kategori: up.kategori,
          tanggal: up.tanggal,
          uploader: up.uploader,
          ukuran: up.ukuran,
        });
      });
    });

    // From TU Arsip
    arsipTUList.forEach((ars) => {
      list.push({
        id: ars.id,
        unit: 'Tata Usaha',
        judul: ars.judul,
        kategori: ars.kategori.includes('Keuangan') ? 'Keuangan' : 'Regulasi / TU',
        tanggal: ars.tanggalArsip,
        uploader: ars.uploader,
        ukuran: ars.fileSize,
      });
    });

    return list;
  }, [subdits, arsipTUList]);

  // Consolidate upcoming agendas from all subdits
  const allAgendas = React.useMemo(() => {
    const list: Array<{
      id: string;
      unit: string;
      judul: string;
      tanggal: string;
      waktu: string;
      lokasi: string;
      pic: string;
      status: string;
    }> = [];

    subdits.forEach((s) => {
      s.agendaList.forEach((ag) => {
        list.push({
          id: ag.id,
          unit: s.singkatan,
          judul: ag.judul,
          tanggal: ag.tanggal,
          waktu: ag.waktu,
          lokasi: ag.lokasi,
          pic: ag.pic,
          status: ag.status,
        });
      });
    });

    return list;
  }, [subdits]);

  // Filtered uploads
  const filteredUploads = allUploads.filter((item) => {
    if (filterKategori === 'semua') return true;
    return item.kategori === filterKategori;
  });

  // Average academic score
  const avgAcademicScore = Math.round(
    subdits.reduce((acc, s) => acc + s.akademik.skorKinerjaAkademik, 0) / subdits.length
  );

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 tracking-wide uppercase">
                Executive Dashboard
              </span>
              <span className="text-xs text-slate-400">• DIPA 2026</span>
              <span className="text-xs text-slate-400">• Terpadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Laporan Anggaran & Akademik Direktorat KSKK
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              Pemantauan terpusat alokasi anggaran, persentase serapan tiap Subdirektorat, capaian kinerja akademik, dan arsip data upload dari seluruh Subdit & Subbag Tata Usaha.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                alert('Mengekspor Laporan Rekapitulasi Eksekutif KSKK TA 2026 (PDF & XLSX)');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Rekapitulasi KSKK
            </button>
            <button
              onClick={() => setActiveMenu('tata-usaha')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-600" />
              Buka Tata Usaha
            </button>
          </div>
        </div>

        {/* Grand Total Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pagu Anggaran KSKK
              </p>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1.5 font-mono">
              {formatRupiah(grandTotalPagu)}
            </p>
            <p className="text-xs text-blue-600 mt-1 font-medium">
              100% Pagu DIPA TA 2026
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Realisasi Keseluruhan
              </p>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-extrabold text-emerald-700 mt-1.5 font-mono">
              {formatRupiah(grandTotalRealisasi)}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(grandTotalPersenSerapan, 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-800 font-mono">
                {grandTotalPersenSerapan}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Sisa Anggaran Belum Terserap
              </p>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-extrabold text-amber-700 mt-1.5 font-mono">
              {formatRupiah(grandTotalSisa)}
            </p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              {(100 - grandTotalPersenSerapan).toFixed(2)}% sisa alokasi DIPA
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
                Indeks Kinerja Akademik
              </p>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-black text-indigo-700 font-mono">
                {avgAcademicScore}
              </span>
              <span className="text-xs text-indigo-500 font-bold">/ 100 Rata-rata</span>
            </div>
            <p className="text-xs text-indigo-600 mt-1 font-medium">
              Mutu & Kurikulum Terintegrasi
            </p>
          </div>
        </div>
      </div>

      {/* 2. TABEL KINERJA TIAP SUBDIT (PERSENTASE DARI TOTAL ANGGARAN & PERSENTASE KESELURUHAN) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Alokasi & Kinerja Tiap Subdirektorat
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Persentase porsi anggaran dari total KSKK dan persentase serapan realisasi masing-masing Subdit
            </p>
          </div>

          <span className="text-xs text-slate-400 font-medium self-start sm:self-auto">
            Klik nama Subdit untuk membuka laporan rinci
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Subdirektorat</th>
                <th className="py-3.5 px-4 text-right">Pagu Anggaran</th>
                <th className="py-3.5 px-4 text-center">Porsi dari Total KSKK (%)</th>
                <th className="py-3.5 px-4 text-right">Realisasi</th>
                <th className="py-3.5 px-4 text-center">Kinerja Serapan (%)</th>
                <th className="py-3.5 px-4 text-right">Sisa Anggaran</th>
                <th className="py-3.5 px-4 text-center">Skor Akademik</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subdits.map((subdit) => (
                <tr
                  key={subdit.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setActiveMenu(getSubditRoute(subdit.id))}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        {getSubditIcon(subdit.id)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {subdit.nama}
                        </p>
                        <p className="text-xs text-slate-500">
                          Kasubdit: {subdit.kasubdit}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatRupiah(subdit.paguTotal)}
                  </td>

                  {/* PERSENTASE DARI TOTAL ANGGARAN KSKK */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(subdit.persenDariTotalAnggaran * 2.5, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-blue-700 font-mono w-12 text-right">
                        {subdit.persenDariTotalAnggaran}%
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono font-semibold text-emerald-600">
                    {formatRupiah(subdit.realisasiTotal)}
                  </td>

                  {/* PERSENTASE REALISASI KINERJA TIAP SUBDIT */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-emerald-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${Math.min(subdit.persenSerapan, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 font-mono w-12 text-right">
                        {subdit.persenSerapan}%
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-amber-700 font-medium">
                    {formatRupiah(subdit.sisaTotal)}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {subdit.akademik.skorKinerjaAkademik} / 100
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(getSubditRoute(subdit.id));
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Buka Data
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* PERSENTASE KESELURUHAN (GRAND TOTAL ROW) */}
              <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-300 text-slate-900">
                <td className="py-4 px-4 uppercase tracking-wider text-xs">
                  TOTAL KESELURUHAN DIREKTORAT KSKK
                </td>
                <td className="py-4 px-4 text-right font-mono">
                  {formatRupiah(grandTotalPagu)}
                </td>
                <td className="py-4 px-4 text-center font-mono text-blue-800">
                  100.00%
                </td>
                <td className="py-4 px-4 text-right font-mono text-emerald-700">
                  {formatRupiah(grandTotalRealisasi)}
                </td>
                <td className="py-4 px-4 text-center font-mono text-emerald-800">
                  {grandTotalPersenSerapan}%
                </td>
                <td className="py-4 px-4 text-right font-mono text-amber-800">
                  {formatRupiah(grandTotalSisa)}
                </td>
                <td className="py-4 px-4 text-center font-mono text-indigo-800">
                  {avgAcademicScore} / 100
                </td>
                <td className="py-4 px-4 text-right text-xs text-slate-500 font-medium">
                  5 Subdit + TU
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. DUA KOLOM: FEED LAPORAN UPLOAD SUBDIT & TU + AGENDA TERDEKAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kiri: Pusat Unduh Laporan Upload dari Tiap Subdit & TU */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Laporan yang Di-Upload Subdit & TU
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arsip berkas keuangan & akademik terunggah
                </p>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 text-xs">
                {(['semua', 'Keuangan', 'Akademik'] as const).map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setFilterKategori(kat)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      filterKategori === kat
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {kat === 'semua' ? 'Semua' : kat}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {filteredUploads.map((file) => (
                <div
                  key={file.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-xs truncate">
                        {file.judul}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        <strong className="text-blue-700">{file.unit}</strong> • {file.kategori} • {file.tanggal} ({file.ukuran})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Mengunduh berkas: ${file.judul}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <span className="text-xs text-slate-500">
              Total {allUploads.length} dokumen tersinkronisasi dari Subdit & TU
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Agenda Terdekat Seluruh Subdit & TU */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Agenda Terdekat Lintas Subdit & TU
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Timeline rapat pleno, bimtek, supervisi, dan kegiatan penting
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {allAgendas.length} Jadwal Aktif
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {allAgendas.slice(0, 5).map((ag) => (
                <div
                  key={ag.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {ag.unit}
                    </span>
                    <span className="text-slate-500 font-mono font-bold">
                      {ag.tanggal} • {ag.waktu}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-2 leading-snug">
                    {ag.judul}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="truncate">Lokasi: {ag.lokasi}</span>
                    <span className="shrink-0 font-medium">PIC: {ag.pic}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <button
              onClick={() => setActiveMenu('subdit-kurikulum')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              Kelola Jadwal & Agenda Subdit
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
