import React, { useState, useMemo } from 'react';
import {
  School,
  Search,
  Filter,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Users,
  Award,
  Globe,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Madrasah, MadrasahJenjang, MadrasahStatus } from '../../types';
import { MadrasahDetailModal } from '../branding/MadrasahDetailModal';

export const MadrasahDatabase: React.FC = () => {
  const {
    madrasahs,
    selectedMadrasahId,
    setSelectedMadrasahId,
    addToast,
  } = useApp();

  // Filters
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('ALL');
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('ALL');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Extract unique provinces
  const provinces = useMemo(() => {
    return Array.from(new Set(madrasahs.map((m) => m.provinsi))).sort();
  }, [madrasahs]);

  // Extract kabupatens for selected province
  const kabupatens = useMemo(() => {
    if (selectedProvinsi === 'ALL') {
      return Array.from(new Set(madrasahs.map((m) => m.kabupatenKota))).sort();
    }
    return Array.from(
      new Set(
        madrasahs
          .filter((m) => m.provinsi === selectedProvinsi)
          .map((m) => m.kabupatenKota),
      ),
    ).sort();
  }, [madrasahs, selectedProvinsi]);

  // Filtered dataset
  const filteredMadrasahs = useMemo(() => {
    return madrasahs.filter((m) => {
      const matchProv = selectedProvinsi === 'ALL' || m.provinsi === selectedProvinsi;
      const matchKab = selectedKabupaten === 'ALL' || m.kabupatenKota === selectedKabupaten;
      const matchJenjang = selectedJenjang === 'ALL' || m.jenjang === selectedJenjang;
      const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nsm.includes(searchQuery) ||
        m.npsn.includes(searchQuery) ||
        m.kepalaMadrasah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());

      return matchProv && matchKab && matchJenjang && matchStatus && matchSearch;
    });
  }, [madrasahs, selectedProvinsi, selectedKabupaten, selectedJenjang, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredMadrasahs.length / itemsPerPage) || 1;
  const paginatedList = filteredMadrasahs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleExport = () => {
    addToast(
      'success',
      'Ekspor Berhasil',
      `Data ${filteredMadrasahs.length} madrasah telah diekspor ke format Excel/CSV.`,
    );
  };

  const handleImport = () => {
    addToast(
      'info',
      'Sinkronisasi EMIS',
      'Data madrasah tersinkronisasi otomatis dengan API EMIS 4.0 Kemenag.',
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Database & Direktori Madrasah Nasional
            </h2>
            <p className="text-xs text-slate-500">
              Hirarki wilayah: Provinsi → Kabupaten/Kota → Kecamatan → Satuan Pendidikan Madrasah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Sinkronisasi EMIS</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama madrasah, NSM, NPSN, atau Kepala Madrasah..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-teal-600"
            />
          </div>

          {/* Reset button */}
          {(selectedProvinsi !== 'ALL' ||
            selectedKabupaten !== 'ALL' ||
            selectedJenjang !== 'ALL' ||
            selectedStatus !== 'ALL' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedProvinsi('ALL');
                setSelectedKabupaten('ALL');
                setSelectedJenjang('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-xs text-rose-600 hover:underline px-2 py-1 font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* 4 Hierarchical Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              1. Provinsi
            </label>
            <select
              value={selectedProvinsi}
              onChange={(e) => {
                setSelectedProvinsi(e.target.value);
                setSelectedKabupaten('ALL');
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">Semua Provinsi</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              2. Kabupaten / Kota
            </label>
            <select
              value={selectedKabupaten}
              onChange={(e) => {
                setSelectedKabupaten(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">Semua Kab/Kota</option>
              {kabupatens.map((kab) => (
                <option key={kab} value={kab}>
                  {kab}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              3. Jenjang
            </label>
            <select
              value={selectedJenjang}
              onChange={(e) => {
                setSelectedJenjang(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="RA">RA</option>
              <option value="MI">MI</option>
              <option value="MTs">MTs</option>
              <option value="MA">MA</option>
              <option value="MAK">MAK</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              4. Status Lembaga
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">Semua Status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Madrasah Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">NSM & Nama Madrasah</th>
                <th className="py-3.5 px-4">Jenjang & Status</th>
                <th className="py-3.5 px-4">Wilayah (Kab/Prov)</th>
                <th className="py-3.5 px-4">Kepala Madrasah</th>
                <th className="py-3.5 px-4 text-center">Akreditasi</th>
                <th className="py-3.5 px-4 text-center">Siswa / Guru</th>
                <th className="py-3.5 px-4 text-center">Skor Branding</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedList.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedMadrasahId(m.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block mb-0.5 font-bold">
                      <span>NSM: {m.nsm}</span>
                      <span className="text-slate-400 font-normal">| NPSN: {m.npsn}</span>
                    </div>
                    <p className="font-bold text-slate-900 group-hover:text-teal-700 leading-snug">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{m.alamat}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{m.jenjang}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        m.status === 'Negeri' ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{m.kabupatenKota}</span>
                    <span className="text-[10px] text-slate-400">
                      Kec. {m.kecamatan}, {m.provinsi}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block leading-tight">
                      {m.kepalaMadrasah}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.kontak}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800 text-[11px]">
                      {m.akreditasi}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-900 block font-mono">
                      {m.jumlahSiswa.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.jumlahGuru} Guru</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        m.branding.totalScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.branding.totalScore >= 60
                          ? 'bg-sky-100 text-sky-800'
                          : m.branding.totalScore >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.branding.totalScore}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMadrasahId(m.id);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold text-teal-700 hover:bg-teal-50 rounded border border-teal-200"
                    >
                      Buka Profil
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ditemukan madrasah yang cocok dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan{' '}
            <strong className="text-slate-800">
              {filteredMadrasahs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredMadrasahs.length)}
            </strong>{' '}
            dari <strong className="text-slate-800">{filteredMadrasahs.length}</strong> madrasah
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
