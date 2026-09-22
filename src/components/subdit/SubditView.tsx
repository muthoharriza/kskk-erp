import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  User,
  Plus,
  ArrowUpRight,
  PieChart,
  Download,
  Search,
  Filter,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubditDetail } from '../../types';

interface SubditViewProps {
  subditId: string;
}

export const SubditView: React.FC<SubditViewProps> = ({ subditId }) => {
  const {
    subdits,
    grandTotalPagu,
    updateSubditBudget,
    addUploadToSubdit,
    addAgendaToSubdit,
    addAcademicIndicator,
    currentUser,
  } = useApp();

  const subdit = subdits.find((s) => s.id === subditId) || subdits[0];

  const [activeTab, setActiveTab] = useState<'keuangan' | 'akademik' | 'agenda' | 'upload'>('keuangan');
  
  // Modals
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Budget form state
  const [formPagu, setFormPagu] = useState(subdit.paguTotal.toString());
  const [formRealisasi, setFormRealisasi] = useState(subdit.realisasiTotal.toString());

  // Agenda form state
  const [agendaJudul, setAgendaJudul] = useState('');
  const [agendaTanggal, setAgendaTanggal] = useState('');
  const [agendaWaktu, setAgendaWaktu] = useState('09:00 - 12:00 WIB');
  const [agendaLokasi, setAgendaLokasi] = useState('');
  const [agendaPIC, setAgendaPIC] = useState(currentUser.name);
  const [agendaKeterangan, setAgendaKeterangan] = useState('');

  // Academic form state
  const [akademikIndikator, setAkademikIndikator] = useState('');
  const [akademikTarget, setAkademikTarget] = useState('');
  const [akademikRealisasi, setAkademikRealisasi] = useState('');
  const [akademikPersen, setAkademikPersen] = useState('90');
  const [akademikStatus, setAkademikStatus] = useState<'Tercapai' | 'On Track' | 'Perlu Perhatian'>('On Track');
  const [akademikCatatan, setAkademikCatatan] = useState('');

  // Upload form state
  const [uploadJudul, setUploadJudul] = useState('');
  const [uploadKategori, setUploadKategori] = useState<'Keuangan' | 'Akademik' | 'Agenda' | 'Lainnya'>('Keuangan');
  const [uploadKet, setUploadKet] = useState('');

  // Calculations
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const pagu = parseFloat(formPagu) || subdit.paguTotal;
    const realisasi = parseFloat(formRealisasi) || subdit.realisasiTotal;
    updateSubditBudget(subdit.id, pagu, realisasi);
    setIsBudgetModalOpen(false);
  };

  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaJudul.trim()) return;
    addAgendaToSubdit(subdit.id, {
      judul: agendaJudul,
      tanggal: agendaTanggal || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      waktu: agendaWaktu,
      lokasi: agendaLokasi || 'Kemenag RI',
      pic: agendaPIC,
      keterangan: agendaKeterangan,
      status: 'Akan Datang',
    });
    setAgendaJudul('');
    setAgendaTanggal('');
    setAgendaLokasi('');
    setAgendaKeterangan('');
    setIsAgendaModalOpen(false);
  };

  const handleSaveAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!akademikIndikator.trim()) return;
    addAcademicIndicator(subdit.id, {
      indikator: akademikIndikator,
      target: akademikTarget || '100%',
      realisasi: akademikRealisasi || '90%',
      persentase: parseFloat(akademikPersen) || 90,
      status: akademikStatus,
      catatan: akademikCatatan,
    });
    setAkademikIndikator('');
    setAkademikTarget('');
    setAkademikRealisasi('');
    setAkademikCatatan('');
    setIsAcademicModalOpen(false);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadJudul.trim()) return;
    addUploadToSubdit(subdit.id, {
      judul: uploadJudul.endsWith('.pdf') || uploadJudul.endsWith('.xlsx') ? uploadJudul : `${uploadJudul}.pdf`,
      kategori: uploadKategori,
      uploader: currentUser.name,
      ukuran: '3.4 MB',
      keterangan: uploadKet,
    });
    setUploadJudul('');
    setUploadKet('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Profile Unit */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 tracking-wide uppercase">
                Subdirektorat KSKK
              </span>
              <span className="text-xs text-slate-400">• DIPA TA 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {subdit.nama}
            </h1>
            <p className="text-sm text-slate-500">
              Kasubdit: <strong className="text-slate-700">{subdit.kasubdit}</strong> (NIP: {subdit.nipKasubdit}) • {subdit.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Laporan Subdit
            </button>
            <button
              onClick={() => {
                setFormPagu(subdit.paguTotal.toString());
                setFormRealisasi(subdit.realisasiTotal.toString());
                setIsBudgetModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer border border-slate-200"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Update Anggaran
            </button>
          </div>
        </div>

        {/* Highlight 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-medium text-slate-500">Pagu Anggaran Subdit</p>
            <p className="text-lg font-bold text-slate-900 mt-1 font-mono">
              {formatRupiah(subdit.paguTotal)}
            </p>
            <p className="text-xs text-blue-600 mt-1 font-medium">
              {subdit.persenDariTotalAnggaran}% dari total anggaran KSKK
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
            <p className="text-xs font-medium text-emerald-800">Realisasi Anggaran</p>
            <p className="text-lg font-bold text-emerald-700 mt-1 font-mono">
              {formatRupiah(subdit.realisasiTotal)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(subdit.persenSerapan, 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {subdit.persenSerapan}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <p className="text-xs font-medium text-amber-800">Sisa Anggaran Belum Terserap</p>
            <p className="text-lg font-bold text-amber-700 mt-1 font-mono">
              {formatRupiah(subdit.sisaTotal)}
            </p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              {(100 - subdit.persenSerapan).toFixed(2)}% sisa alokasi
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70">
            <p className="text-xs font-medium text-indigo-800">Indeks Kinerja Akademik</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-700 font-mono">
                {subdit.akademik.skorKinerjaAkademik}
              </span>
              <span className="text-xs text-indigo-500 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-indigo-600 mt-1 font-medium">
              {subdit.akademik.indikatorList.length} Indikator Terpantau
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('keuangan')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'keuangan'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Laporan Keuangan & Anggaran
        </button>
        <button
          onClick={() => setActiveTab('akademik')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'akademik'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Laporan Akademik & Capaian
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'agenda'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Agenda Terdekat Subdit ({subdit.agendaList.length})
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Berkas & Arsip Upload ({subdit.uploadsList.length})
        </button>
      </div>

      {/* TAB CONTENT: KEUANGAN */}
      {activeTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rincian Alokasi Program & Akun Belanja
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar program belanja, target serapan, dan sisa anggaran operasional Subdit
                </p>
              </div>
              <button
                onClick={() => {
                  setFormPagu(subdit.paguTotal.toString());
                  setFormRealisasi(subdit.realisasiTotal.toString());
                  setIsBudgetModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Sesuaikan Pagu / Realisasi
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Program / Kegiatan</th>
                    <th className="py-3 px-4">Kode Akun</th>
                    <th className="py-3 px-4 text-right">Pagu</th>
                    <th className="py-3 px-4 text-right">Realisasi</th>
                    <th className="py-3 px-4 text-right">Sisa Anggaran</th>
                    <th className="py-3 px-4 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subdit.itemsAnggaran.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.namaProgram}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        {item.kodeAkun}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                        {formatRupiah(item.pagu)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600">
                        {formatRupiah(item.realisasi)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-600">
                        {formatRupiah(item.sisa)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.persen >= 80 ? 'bg-emerald-500' : item.persen >= 65 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(item.persen, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 font-mono w-10 text-right">
                            {item.persen}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                    <td className="py-3.5 px-4 text-slate-900" colSpan={2}>
                      TOTAL KESELURUHAN SUBDIT
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-900">
                      {formatRupiah(subdit.paguTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700">
                      {formatRupiah(subdit.realisasiTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700">
                      {formatRupiah(subdit.sisaTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-blue-700">
                      {subdit.persenSerapan}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AKADEMIK */}
      {activeTab === 'akademik' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Laporan Capaian Kinerja Akademik
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fokus substansi, indikator mutu pendidikan, target vs realisasi
                </p>
              </div>
              <button
                onClick={() => setIsAcademicModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Indikator Capaian
              </button>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl mb-6">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Ringkasan Kebijakan & Mutu Subdit:
              </p>
              <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                {subdit.akademik.ringkasan}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Indikator Mutu / Kinerja</th>
                    <th className="py-3 px-4">Target DIPA</th>
                    <th className="py-3 px-4">Realisasi Capaian</th>
                    <th className="py-3 px-4 text-center">Persentase</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Catatan Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subdit.akademik.indikatorList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.indikator}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {item.target}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                        {item.realisasi}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {item.persentase}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Tercapai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'On Track'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status === 'Tercapai' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {item.status === 'On Track' && <Clock className="w-3.5 h-3.5" />}
                          {item.status === 'Perlu Perhatian' && <AlertCircle className="w-3.5 h-3.5" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {item.catatan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AGENDA */}
      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Agenda Terdekat Subdit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jadwal rapat, bimbingan teknis, supervisi lapangan, dan koordinasi instansi
                </p>
              </div>
              <button
                onClick={() => setIsAgendaModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Tambah Agenda Kegiatan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subdit.agendaList.map((agenda) => (
                <div
                  key={agenda.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3" />
                        {agenda.status}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {agenda.tanggal}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {agenda.judul}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {agenda.keterangan}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{agenda.waktu}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{agenda.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">PIC: {agenda.pic}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: UPLOAD BERKAS */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Pusat Upload Laporan & Dokumen Subdit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unggah berkas keuangan, laporan akademik, dan SPJ kegiatan langsung ke server KSKK
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                Unggah Berkas Baru
              </button>
            </div>

            {/* Drag and Drop Zone Banner */}
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-8 text-center cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Klik untuk unggah atau seret berkas laporan ke sini
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mendukung format PDF, XLSX, DOCX, CSV (Maksimal 25 MB per dokumen)
              </p>
            </div>

            {/* Uploaded List */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Riwayat Berkas yang Diunggah ({subdit.uploadsList.length})
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {subdit.uploadsList.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{file.judul}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Kategori: <strong className="text-slate-700">{file.kategori}</strong> • {file.ukuran} • Diunggah {file.tanggal} oleh {file.uploader}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`#download-${file.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Mengunduh berkas resmi: ${file.judul}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Unduh
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: UPDATE ANGGARAN SUBDIT                        */}
      {/* ==================================================== */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Update Anggaran {subdit.singkatan}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perbarui nilai pagu definitif dan realisasi terkini untuk disinkronisasi ke Dashboard.
            </p>

            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pagu Total Subdit (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={formPagu}
                  onChange={(e) => setFormPagu(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Realisasi Saat Ini (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={formRealisasi}
                  onChange={(e) => setFormRealisasi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                Sisa Otomatis: <strong className="text-amber-700 font-mono">{formatRupiah((parseFloat(formPagu) || 0) - (parseFloat(formRealisasi) || 0))}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: TAMBAH AGENDA SUBDIT                          */}
      {/* ==================================================== */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Tambah Agenda Kegiatan {subdit.singkatan}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Catat jadwal kegiatan penting agar tampil pada timeline eksekutif.
            </p>

            <form onSubmit={handleSaveAgenda} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kegiatan / Agenda
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Koordinasi Kurikulum Madrasah"
                  value={agendaJudul}
                  onChange={(e) => setAgendaJudul(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    placeholder="25 Sep 2026"
                    value={agendaTanggal}
                    onChange={(e) => setAgendaTanggal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu
                  </label>
                  <input
                    type="text"
                    value={agendaWaktu}
                    onChange={(e) => setAgendaWaktu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lokasi / Tempat
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Gedung Kemenag RI / Zoom"
                    value={agendaLokasi}
                    onChange={(e) => setAgendaLokasi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIC / Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={agendaPIC}
                    onChange={(e) => setAgendaPIC(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan agenda..."
                  value={agendaKeterangan}
                  onChange={(e) => setAgendaKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAgendaModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: TAMBAH INDIKATOR AKADEMIK                     */}
      {/* ==================================================== */}
      {isAcademicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Tambah Indikator Capaian Akademik
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan indikator target dan capaian untuk {subdit.singkatan}.
            </p>

            <form onSubmit={handleSaveAcademic} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Indikator Mutu / Kinerja
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Persentase Siswa Mengikuti Ujian Berbasis Komputer"
                  value={akademikIndikator}
                  onChange={(e) => setAkademikIndikator(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 100% atau 10.000 Siswa"
                    value={akademikTarget}
                    onChange={(e) => setAkademikTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Realisasi Capaian
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 8.500 Siswa"
                    value={akademikRealisasi}
                    onChange={(e) => setAkademikRealisasi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Persentase (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={akademikPersen}
                    onChange={(e) => setAkademikPersen(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={akademikStatus}
                    onChange={(e) => setAkademikStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="On Track">On Track</option>
                    <option value="Tercapai">Tercapai</option>
                    <option value="Perlu Perhatian">Perlu Perhatian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tindak Lanjut
                </label>
                <input
                  type="text"
                  placeholder="Catatan progres lapangan..."
                  value={akademikCatatan}
                  onChange={(e) => setAkademikCatatan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAcademicModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Indikator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: UPLOAD LAPORAN SUBDIT                         */}
      {/* ==================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Upload Berkas Laporan {subdit.singkatan}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data yang diunggah akan tersinkronisasi ke Dashboard Eksekutif.
            </p>

            <form onSubmit={handleSaveUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Dokumen / File Laporan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan_Realisasi_Q3.pdf"
                  value={uploadJudul}
                  onChange={(e) => setUploadJudul(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Dokumen
                </label>
                <select
                  value={uploadKategori}
                  onChange={(e) => setUploadKategori(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Keuangan">Laporan Keuangan & Anggaran</option>
                  <option value="Akademik">Laporan Akademik & Capaian</option>
                  <option value="Agenda">Dokumen Agenda & Notulensi</option>
                  <option value="Lainnya">Dokumen Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi isi dokumen..."
                  value={uploadKet}
                  onChange={(e) => setUploadKet(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                Berkas akan otomatis disimpan di arsip KSKK atas nama: <strong>{currentUser.name}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Unggah Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
