import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Send,
  GitBranch,
  Archive,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  UserCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SuratMasukItem,
  SuratKeluarItem,
  DisposisiItem,
  ArsipTUItem,
} from '../../types';

export const TataUsahaModule: React.FC = () => {
  const {
    suratMasuk,
    addSuratMasuk,
    suratKeluar,
    addSuratKeluar,
    disposisiList,
    addDisposisi,
    updateDisposisiStatus,
    arsipTUList,
    addArsipTU,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'arsip' | 'surat-masuk' | 'surat-keluar' | 'disposisi'>('arsip');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isSuratMasukModalOpen, setIsSuratMasukModalOpen] = useState(false);
  const [isSuratKeluarModalOpen, setIsSuratKeluarModalOpen] = useState(false);
  const [isDisposisiModalOpen, setIsDisposisiModalOpen] = useState(false);
  const [isArsipModalOpen, setIsArsipModalOpen] = useState(false);

  // Selected item for Disposisi action
  const [selectedSuratMasuk, setSelectedSuratMasuk] = useState<SuratMasukItem | null>(null);

  // Form states: Surat Masuk
  const [smNomor, setSmNomor] = useState('');
  const [smPengirim, setSmPengirim] = useState('');
  const [smPerihal, setSmPerihal] = useState('');
  const [smUrgensi, setSmUrgensi] = useState<SuratMasukItem['urgensi']>('Penting');

  // Form states: Surat Keluar
  const [skNomor, setSkNomor] = useState('');
  const [skTujuan, setSkTujuan] = useState('');
  const [skPerihal, setSkPerihal] = useState('');
  const [skKategori, setSkKategori] = useState<SuratKeluarItem['kategori']>('Nota Dinas');
  const [skPenandatangan, setSkPenandatangan] = useState('Direktur KSKK Madrasah');

  // Form states: Disposisi
  const [dispNomor, setDispNomor] = useState('');
  const [dispAsal, setDispAsal] = useState('');
  const [dispPerihal, setDispPerihal] = useState('');
  const [dispInstruksi, setDispInstruksi] = useState('');
  const [dispTujuan, setDispTujuan] = useState('Semua Subdit & Subbag Tata Usaha');
  const [dispBatasWaktu, setDispBatasWaktu] = useState('28 Sep 2026');

  // Form states: Arsip
  const [arsipNomor, setArsipNomor] = useState('');
  const [arsipJudul, setArsipJudul] = useState('');
  const [arsipKategori, setArsipKategori] = useState<ArsipTUItem['kategori']>('Keputusan Direktur / Dirjen');
  const [arsipTahun, setArsipTahun] = useState('2026');

  // Handlers
  const handleSaveSuratMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smPerihal.trim()) return;
    addSuratMasuk({
      nomorSurat: smNomor || `B-${Math.floor(1000 + Math.random() * 9000)}/TU/09/2026`,
      pengirim: smPengirim || 'Kementerian / Instansi Terkait',
      perihal: smPerihal,
      urgensi: smUrgensi,
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      tanggalDiterima: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    setSmNomor('');
    setSmPengirim('');
    setSmPerihal('');
    setIsSuratMasukModalOpen(false);
  };

  const handleSaveSuratKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skPerihal.trim()) return;
    addSuratKeluar({
      nomorSurat: skNomor || `B-${Math.floor(3000 + Math.random() * 2000)}/DJ.I/Dt.I.I/09/2026`,
      tujuan: skTujuan || 'Kepala Kanwil Kemenag Provinsi se-Indonesia',
      perihal: skPerihal,
      kategori: skKategori,
      penandatangan: skPenandatangan,
      status: 'Terkirim',
    });
    setSkNomor('');
    setSkTujuan('');
    setSkPerihal('');
    setIsSuratKeluarModalOpen(false);
  };

  const handleSaveDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispInstruksi.trim()) return;
    addDisposisi({
      suratMasukId: selectedSuratMasuk?.id,
      nomorSurat: dispNomor || selectedSuratMasuk?.nomorSurat || 'B-1422/DJ.I/HM.01/09/2026',
      asalSurat: dispAsal || selectedSuratMasuk?.pengirim || 'Instansi Terkait',
      perihal: dispPerihal || selectedSuratMasuk?.perihal || 'Tindak lanjut surat',
      instruksiDirektur: dispInstruksi,
      tujuanSubdit: dispTujuan,
      batasWaktu: dispBatasWaktu,
      status: 'Dalam Proses',
      catatanTindakLanjut: 'Disposisi diteruskan ke subdit tujuan.',
    });
    setDispInstruksi('');
    setSelectedSuratMasuk(null);
    setIsDisposisiModalOpen(false);
  };

  const handleSaveArsip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arsipJudul.trim()) return;
    addArsipTU({
      nomorDokumen: arsipNomor || `ARSIP-KSKK-${Date.now().toString().slice(-4)}/2026`,
      judul: arsipJudul,
      kategori: arsipKategori,
      tahun: parseInt(arsipTahun) || 2026,
    });
    setArsipNomor('');
    setArsipJudul('');
    setIsArsipModalOpen(false);
  };

  // Open Disposisi from Surat Masuk
  const openDisposisiModalForSurat = (surat: SuratMasukItem) => {
    setSelectedSuratMasuk(surat);
    setDispNomor(surat.nomorSurat);
    setDispAsal(surat.pengirim);
    setDispPerihal(surat.perihal);
    setIsDisposisiModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 tracking-wide uppercase">
                Sekretariat & Tata Usaha
              </span>
              <span className="text-xs text-slate-400">• Pelayanan Administrasi Terpadu</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Subbag Tata Usaha Direktorat KSKK Madrasah
            </h1>
            <p className="text-sm text-slate-500">
              Pengelolaan tata persuratan dinas, arsip regulasi, disposisi pimpinan, dan fasilitasi administrasi operasional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSuratMasukModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Catat Surat Masuk
            </button>
            <button
              onClick={() => setIsSuratKeluarModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Buat Surat Keluar
            </button>
            <button
              onClick={() => setIsArsipModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              <Archive className="w-4 h-4 text-amber-600" />
              Simpan ke Arsip
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Dokumen Arsip</p>
            <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
              {arsipTUList.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">KMA, Juknis, DIPA & MoU</p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">Surat Masuk</p>
            <p className="text-xl font-bold text-blue-900 mt-1 font-mono">
              {suratMasuk.length}
            </p>
            <p className="text-[11px] text-blue-600 mt-0.5">
              {suratMasuk.filter((s) => s.status === 'Baru').length} belum didisposisikan
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <p className="text-xs text-indigo-700 font-medium">Surat Keluar</p>
            <p className="text-xl font-bold text-indigo-900 mt-1 font-mono">
              {suratKeluar.length}
            </p>
            <p className="text-[11px] text-indigo-600 mt-0.5">Nota dinas, SE, & undangan</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <p className="text-xs text-amber-800 font-medium">Disposisi Aktif</p>
            <p className="text-xl font-bold text-amber-900 mt-1 font-mono">
              {disposisiList.filter((d) => d.status !== 'Selesai').length}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Instruksi dalam pengawasan</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('arsip')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'arsip'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Archive className="w-4 h-4" />
          1. Arsip Dokumen ({arsipTUList.length})
        </button>
        <button
          onClick={() => setActiveTab('surat-masuk')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'surat-masuk'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          2. Surat Masuk ({suratMasuk.length})
        </button>
        <button
          onClick={() => setActiveTab('surat-keluar')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'surat-keluar'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          3. Surat Keluar ({suratKeluar.length})
        </button>
        <button
          onClick={() => setActiveTab('disposisi')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'disposisi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          4. Disposisi Direktur ({disposisiList.length})
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ARSIP DOKUMEN TU                              */}
      {/* ==================================================== */}
      {activeTab === 'arsip' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Arsip Resmi Tata Usaha</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Koleksi regulasi, KMA, salinan DIPA, Juknis nasional, dan nota kesepahaman (MoU)
              </p>
            </div>
            <button
              onClick={() => setIsArsipModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Tambah Dokumen Arsip
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Nomor Dokumen</th>
                  <th className="py-3 px-4">Judul Dokumen Arsip</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Tahun</th>
                  <th className="py-3 px-4">Diarsipkan Pada</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {arsipTUList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-xs text-blue-700">
                      {item.nomorDokumen}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.judul}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 text-xs">
                      {item.tahun}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.tanggalArsip}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Mengunduh dokumen arsip: ${item.judul}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh ({item.fileSize})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: SURAT MASUK                                   */}
      {/* ==================================================== */}
      {activeTab === 'surat-masuk' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Buku Register Surat Masuk</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Surat dinas yang masuk ke Direktorat KSKK Madrasah untuk ditindaklanjuti
              </p>
            </div>
            <button
              onClick={() => setIsSuratMasukModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Pendaftaran Surat Masuk
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">No. Surat & Tanggal</th>
                  <th className="py-3 px-4">Instansi Pengirim</th>
                  <th className="py-3 px-4">Perihal Surat</th>
                  <th className="py-3 px-4">Urgensi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Disposisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suratMasuk.map((sm) => (
                  <tr key={sm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-xs text-slate-900">{sm.nomorSurat}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Diterima: {sm.tanggalDiterima}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                      {sm.pengirim}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 max-w-xs leading-relaxed font-medium">
                      {sm.perihal}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          sm.urgensi === 'Sangat Segera'
                            ? 'bg-rose-100 text-rose-800'
                            : sm.urgensi === 'Segera'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sm.urgensi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sm.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sm.status === 'Didisposisikan' || sm.status === 'Diproses'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {sm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDisposisiModalForSurat(sm)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        Disposisikan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: SURAT KELUAR                                  */}
      {/* ==================================================== */}
      {activeTab === 'surat-keluar' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Buku Register Surat Keluar</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Surat dinas resmi yang diterbitkan oleh Direktorat KSKK Madrasah
              </p>
            </div>
            <button
              onClick={() => setIsSuratKeluarModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Penerbitan Surat Keluar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Nomor & Tanggal Surat</th>
                  <th className="py-3 px-4">Tujuan Surat</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Kategori Dokumen</th>
                  <th className="py-3 px-4">Penandatangan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suratKeluar.map((sk) => (
                  <tr key={sk.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-xs text-slate-900">{sk.nomorSurat}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{sk.tanggalSurat}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs">
                      {sk.tujuan}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 max-w-xs leading-relaxed font-medium">
                      {sk.perihal}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {sk.kategori}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {sk.penandatangan}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          sk.status === 'Terkirim'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sk.status === 'Menunggu TTD'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {sk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: DISPOSISI                                     */}
      {/* ==================================================== */}
      {activeTab === 'disposisi' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Monitoring Disposisi Direktur KSKK Madrasah
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengawasan tindak lanjut instruksi pimpinan kepada para Kasubdit dan Koordinator
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSuratMasuk(null);
                setDispNomor('');
                setDispAsal('');
                setDispPerihal('');
                setIsDisposisiModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Lembar Disposisi Baru
            </button>
          </div>

          <div className="space-y-4 mt-2">
            {disposisiList.map((disp) => (
              <div
                key={disp.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-200 transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {disp.nomorSurat}
                      </span>
                      <span className="text-xs text-slate-400">• Asal: <strong>{disp.asalSurat}</strong></span>
                      <span className="text-xs text-slate-400">• Batas Waktu: <strong className="text-rose-600">{disp.batasWaktu}</strong></span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {disp.perihal}
                    </h3>

                    {/* Direktur's Instruction */}
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
                        Instruksi Direktur KSKK Madrasah:
                      </p>
                      <p className="mt-1 font-medium leading-relaxed">
                        {disp.instruksiDirektur}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tujuan: <strong className="text-slate-800">{disp.tujuanSubdit}</strong></span>
                      </div>
                      {disp.catatanTindakLanjut && (
                        <div className="text-slate-500">
                          Tindak lanjut: <em>{disp.catatanTindakLanjut}</em>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        disp.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : disp.status === 'Dalam Proses'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {disp.status}
                    </span>

                    <div className="flex items-center gap-1.5 mt-2">
                      {disp.status !== 'Selesai' && (
                        <button
                          onClick={() => updateDisposisiStatus(disp.id, 'Selesai')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Tandai Selesai
                        </button>
                      )}
                      {disp.status === 'Menunggu' && (
                        <button
                          onClick={() => updateDisposisiStatus(disp.id, 'Dalam Proses')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Mulai Proses
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DAFTAR SURAT MASUK                            */}
      {/* ==================================================== */}
      {isSuratMasukModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Registrasi Surat Masuk Baru
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Daftarkan surat resmi yang diterima TU untuk agenda dan tindak lanjut pimpinan.
            </p>

            <form onSubmit={handleSaveSuratMasuk} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Surat Dinas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B-1422/DJ.I/HM.01/09/2026"
                  value={smNomor}
                  onChange={(e) => setSmNomor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asal Instansi / Pengirim
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sekretariat Jenderal Kemenag RI"
                  value={smPengirim}
                  onChange={(e) => setSmPengirim(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perihal Surat
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Isi ringkas perihal surat masuk..."
                  value={smPerihal}
                  onChange={(e) => setSmPerihal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Derajat Urgensi
                </label>
                <select
                  value={smUrgensi}
                  onChange={(e) => setSmUrgensi(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Segera">Segera</option>
                  <option value="Sangat Segera">Sangat Segera (Prioritas)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuratMasukModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Daftarkan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: PENERBITAN SURAT KELUAR                       */}
      {/* ==================================================== */}
      {isSuratKeluarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Penerbitan Surat Keluar Resmi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Catat nomor surat keluar dan tujuan surat dinas KSKK.
            </p>

            <form onSubmit={handleSaveSuratKeluar} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Surat Keluar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B-3829/DJ.I/Dt.I.I/PP.00/09/2026"
                  value={skNomor}
                  onChange={(e) => setSkNomor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tujuan Surat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kepala Kanwil Kemenag Provinsi se-Indonesia"
                  value={skTujuan}
                  onChange={(e) => setSkTujuan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perihal Surat
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Perihal surat keluar..."
                  value={skPerihal}
                  onChange={(e) => setSkPerihal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Surat
                  </label>
                  <select
                    value={skKategori}
                    onChange={(e) => setSkKategori(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Nota Dinas">Nota Dinas</option>
                    <option value="Surat Edaran">Surat Edaran</option>
                    <option value="Undangan">Undangan</option>
                    <option value="Surat Keputusan">Surat Keputusan</option>
                    <option value="Surat Tugas">Surat Tugas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penandatangan
                  </label>
                  <input
                    type="text"
                    value={skPenandatangan}
                    onChange={(e) => setSkPenandatangan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuratKeluarModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Terbitkan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: DISPOSISI DIREKTUR                            */}
      {/* ==================================================== */}
      {isDisposisiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Lembar Disposisi Direktur KSKK Madrasah
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Petunjuk dan instruksi pimpinan kepada unit kerja teknis pelaksana.
            </p>

            <form onSubmit={handleSaveDisposisi} className="mt-4 space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong>Nomor Surat:</strong> {dispNomor || 'Surat Terpilih'}</p>
                <p><strong>Asal:</strong> {dispAsal || 'Instansi Terkait'}</p>
                <p className="truncate"><strong>Perihal:</strong> {dispPerihal || 'Tindak lanjut surat dinas'}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instruksi / Catatan Direktur
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: 1. Segera koordinasikan dengan tim teknis; 2. Pelajari ketentuan dan laporkan hasilnya paling lambat minggu ini."
                  value={dispInstruksi}
                  onChange={(e) => setDispInstruksi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tujuan Disposisi Subdit
                  </label>
                  <select
                    value={dispTujuan}
                    onChange={(e) => setDispTujuan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Semua Subdit & Subbag Tata Usaha">Semua Subdit & Subbag TU</option>
                    <option value="Subdit Kurikulum dan Evaluasi">Subdit Kurikulum dan Evaluasi</option>
                    <option value="Subdit Sarana Prasarana">Subdit Sarana Prasarana</option>
                    <option value="Subdit Kelembagaan dan Kerjasama">Subdit Kelembagaan dan Kerjasama</option>
                    <option value="Subdit Kesiswaan">Subdit Kesiswaan</option>
                    <option value="Subdit Pendidikan Vokasi dan Inklusi">Subdit Pendidikan Vokasi dan Inklusi</option>
                    <option value="Subbag Tata Usaha">Subbag Tata Usaha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batas Waktu Penyelesaian
                  </label>
                  <input
                    type="text"
                    value={dispBatasWaktu}
                    onChange={(e) => setDispBatasWaktu(e.target.value)}
                    placeholder="28 Sep 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisposisiModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Kirim Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: TAMBAH DOKUMEN ARSIP                          */}
      {/* ==================================================== */}
      {isArsipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Simpan Dokumen ke Arsip TU
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Arsipkan KMA, Juknis, dokumen DIPA, atau MoU kemitraan.
            </p>

            <form onSubmit={handleSaveArsip} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Dokumen / SK
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KMA-No.450-TAHUN-2026"
                  value={arsipNomor}
                  onChange={(e) => setArsipNomor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Dokumen
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pedoman Kurikulum Madrasah Berbasis Cinta 2026"
                  value={arsipJudul}
                  onChange={(e) => setArsipJudul(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Arsip
                  </label>
                  <select
                    value={arsipKategori}
                    onChange={(e) => setArsipKategori(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Keputusan Direktur / Dirjen">Keputusan Direktur / Dirjen</option>
                    <option value="Juknis & Panduan">Juknis & Panduan</option>
                    <option value="Laporan Keuangan / DIPA">Laporan Keuangan / DIPA</option>
                    <option value="MoU & Kerjasama">MoU & Kerjasama</option>
                    <option value="Arsip Umum TU">Arsip Umum TU</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Dokumen
                  </label>
                  <input
                    type="number"
                    value={arsipTahun}
                    onChange={(e) => setArsipTahun(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsArsipModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
