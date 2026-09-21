import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  ChevronRight,
  ArrowUpRight,
  Send,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BudgetProposal, BudgetStatus, SubditType, BudgetItem } from '../../types';

export const BudgetManagement: React.FC = () => {
  const { budgets, projects, programs, addBudgetProposal, currentUser } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New RAB modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [subdit, setSubdit] = useState<SubditType>('Kurikulum & Evaluasi');
  const [category, setCategory] = useState<'Pelatihan' | 'Sarpras' | 'Operasional' | 'Bantuan' | 'Publikasi'>('Pelatihan');
  const [amount, setAmount] = useState('750000000');
  const [notes, setNotes] = useState('');

  const [detailProposal, setDetailProposal] = useState<BudgetProposal | null>(null);

  // Aggregates
  const totalRequested = budgets.reduce((sum, b) => sum + b.requestedAmount, 0);
  const totalApproved = budgets.reduce((sum, b) => sum + b.approvedAmount, 0);
  const totalRealized = budgets.reduce((sum, b) => sum + b.realizedAmount, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remainingAmount, 0);

  const filteredBudgets = budgets.filter((b) => {
    const matchesCat = filterCategory === 'ALL' || b.budgetCategory === filterCategory;
    const matchesStat = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesSearch =
      b.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.picName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === selectedProjectId);
    const requestedVal = parseFloat(amount) || 500000000;

    addBudgetProposal({
      proposalNumber: `RAB/KSKK/2026/${Math.floor(100 + Math.random() * 900)}`,
      projectId: selectedProjectId,
      projectName: proj ? proj.name : 'Inisiatif Program KSKK',
      programName: proj ? proj.programName : 'Program KSKK',
      subdit,
      picName: currentUser.name,
      budgetCategory: category,
      requestedAmount: requestedVal,
      approvedAmount: requestedVal,
      realizedAmount: 0,
      remainingAmount: requestedVal,
      status: 'Submitted',
      items: [
        {
          id: `item-${Date.now()}-1`,
          budgetId: '',
          codeAkun: '521211 - Belanja Bahan',
          code: '521211',
          name: 'Belanja Bahan & Konsumsi Rapat Koordinasi',
          description: 'Belanja Bahan & Konsumsi Rapat Koordinasi',
          volume: 50,
          satuan: 'Orang/Hari',
          unit: 'Orang/Hari',
          unitPrice: 150000,
          totalPrice: 7500000,
          realizedAmount: 0,
        },
        {
          id: `item-${Date.now()}-2`,
          budgetId: '',
          codeAkun: '524111 - Belanja Perjalanan Dinas',
          code: '524111',
          name: 'Belanja Perjalanan Dinas Paket Meeting',
          description: 'Belanja Perjalanan Dinas Paket Meeting',
          volume: 20,
          satuan: 'Orang',
          unit: 'Orang',
          unitPrice: 3500000,
          totalPrice: 70000000,
          realizedAmount: 0,
        },
        {
          id: `item-${Date.now()}-3`,
          budgetId: '',
          codeAkun: '522131 - Jasa Konsultan',
          code: '522131',
          name: 'Jasa Konsultan & Narasumber Ahli',
          description: 'Jasa Konsultan & Narasumber Ahli',
          volume: 4,
          satuan: 'Narasumber',
          unit: 'Narasumber',
          unitPrice: 10000000,
          totalPrice: 40000000,
          realizedAmount: 0,
        },
      ],
    });

    setIsModalOpen(false);
  };

  const formatCompactRupiah = (val: number) => {
    if (val >= 1000000000000) return `Rp ${(val / 1000000000000).toFixed(2)} T`;
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const formatRupiah = (val: number) => {
    if (val >= 1000000000000) return `Rp ${(val / 1000000000000).toFixed(2)} Triliun`;
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)} M`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-16 font-sans">
      {/* Title Header */}
      <div className="erp-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-100 text-blue-800 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide leading-tight">
              Pengelolaan Anggaran (RAB & Realisasi)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-normal mt-1">
              Integrasi siklus usulan, verifikasi DIPA, persetujuan belanja, dan serapan keuangan Direktorat
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs min-h-[44px] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Usulan RAB</span>
        </button>
      </div>

      {/* Aggregate Cards with Proportional Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="erp-card p-5 sm:p-6 space-y-1.5 min-w-0">
          <span className="text-xs text-slate-500 font-bold tracking-wider uppercase block truncate">Total Diajukan</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight leading-tight my-1 truncate" title={formatRupiah(totalRequested)}>
            {formatCompactRupiah(totalRequested)}
          </span>
          <span className="text-xs text-slate-400 block truncate">Usulan dari seluruh Subdit</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1.5 border-emerald-200 bg-emerald-50/20 min-w-0">
          <span className="text-xs text-emerald-800 font-bold tracking-wider uppercase block truncate">Total Disetujui</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block tracking-tight leading-tight my-1 truncate" title={formatRupiah(totalApproved)}>
            {formatCompactRupiah(totalApproved)}
          </span>
          <span className="text-xs text-emerald-700/80 block truncate">Pagu siap belanja</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1.5 min-w-0">
          <span className="text-xs text-slate-500 font-bold tracking-wider uppercase block truncate">Realisasi SP2D</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 block tracking-tight leading-tight my-1 truncate" title={formatRupiah(totalRealized)}>
            {formatCompactRupiah(totalRealized)}
          </span>
          <span className="text-xs text-slate-400 block truncate">Telah cair via KPPN</span>
        </div>

        <div className="erp-card p-5 sm:p-6 space-y-1.5 min-w-0">
          <span className="text-xs text-slate-500 font-bold tracking-wider uppercase block truncate">Sisa Anggaran</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-700 block tracking-tight leading-tight my-1 truncate" title={formatRupiah(totalApproved - totalRealized)}>
            {formatCompactRupiah(totalApproved - totalRealized)}
          </span>
          <span className="text-xs text-slate-400 block truncate">Pagu tersedia (TW-3 & TW-4)</span>
        </div>
      </div>

      {/* Visual Chart: Requested vs Approved vs Realized vs Remaining */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Visualisasi Alokasi: Diajukan vs Disetujui vs Realisasi vs Sisa
            </h3>
            <p className="text-xs text-slate-500">Keseimbangan likuiditas belanja modal dan operasional KSKK</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 1: Diajukan */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Total Usulan Diajukan (Proposal)</span>
              <span className="font-bold text-slate-900">{formatRupiah(totalRequested)} (100%)</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Row 2: Disetujui */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-emerald-800">Total Anggaran Disetujui (DIPA)</span>
              <span className="font-bold text-emerald-800">{formatRupiah(totalApproved)} (95.8%)</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '95.8%' }} />
            </div>
          </div>

          {/* Row 3: Realisasi */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-teal-800">Realisasi SP2D Cair</span>
              <span className="font-bold text-teal-800">{formatRupiah(totalRealized)} (75.2%)</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: '75.2%' }} />
            </div>
          </div>

          {/* Row 4: Sisa */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-800">Sisa Pagu Belum Terealisasi</span>
              <span className="font-bold text-amber-800">{formatRupiah(totalRemaining)} (24.8%)</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '24.8%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nomor proposal, nama proyek, atau PIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Pelatihan">Pelatihan</option>
            <option value="Sarpras">Sarpras</option>
            <option value="Operasional">Operasional</option>
            <option value="Bantuan">Bantuan</option>
            <option value="Publikasi">Publikasi</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Revised">Revised</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Budget Proposals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">No. Proposal & Tanggal</th>
                <th className="py-3.5 px-4">Proyek & Subdit</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Diajukan</th>
                <th className="py-3.5 px-4">Disetujui</th>
                <th className="py-3.5 px-4">Realisasi</th>
                <th className="py-3.5 px-4">Sisa Pagu</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBudgets.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setDetailProposal(b)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-slate-900 block">
                      {b.proposalNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">{b.submissionDate}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block leading-tight">{b.projectName}</span>
                    <span className="text-[11px] text-slate-500">
                      {b.subdit} • PIC: {b.picName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {b.budgetCategory}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                    {formatRupiah(b.requestedAmount)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    {formatRupiah(b.approvedAmount)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {formatRupiah(b.realizedAmount)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-amber-800 font-semibold">
                    {formatRupiah(b.remainingAmount)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Submitted'
                          ? 'bg-sky-100 text-sky-800'
                          : b.status === 'Reviewed'
                          ? 'bg-indigo-100 text-indigo-800'
                          : b.status === 'Revised'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailProposal(b);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL RAB */}
      {detailProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {detailProposal.proposalNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Rincian Anggaran Biaya (RAB) - {detailProposal.projectName}
                </h3>
              </div>
              <button
                onClick={() => setDetailProposal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Subdirektorat</span>
                  <strong className="text-slate-800">{detailProposal.subdit}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PIC Pengusul</span>
                  <strong className="text-slate-800">{detailProposal.picName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pagu Disetujui</span>
                  <strong className="text-emerald-800">{formatRupiah(detailProposal.approvedAmount)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status Usulan</span>
                  <strong className="text-slate-800">{detailProposal.status}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Item Rincian Belanja (Standar Biaya Masukan)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-2.5">Akun MAK</th>
                        <th className="p-2.5">Uraian Belanja</th>
                        <th className="p-2.5 text-center">Vol</th>
                        <th className="p-2.5 text-center">Satuan</th>
                        <th className="p-2.5 text-right">Harga Satuan</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailProposal.items.map((it) => (
                        <tr key={it.id}>
                          <td className="p-2.5 font-mono text-[11px] text-slate-600">{it.code}</td>
                          <td className="p-2.5 font-medium text-slate-800">{it.name}</td>
                          <td className="p-2.5 text-center">{it.volume}</td>
                          <td className="p-2.5 text-center text-slate-500">{it.unit}</td>
                          <td className="p-2.5 text-right font-mono">Rp {it.unitPrice.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                            Rp {it.totalPrice.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setDetailProposal(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Pengajuan Usulan Anggaran (RAB Baru)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Proyek Terkait</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subdirektorat</label>
                  <select
                    value={subdit}
                    onChange={(e) => setSubdit(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Kurikulum & Evaluasi">Kurikulum & Evaluasi</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Guru & Tenaga Kependidikan">Guru & Tenaga Kependidikan</option>
                    <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                    <option value="Kelembagaan & Kerjasama">Kelembagaan & Kerjasama</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Belanja</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Sarpras">Sarpras</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Bantuan">Bantuan</option>
                    <option value="Publikasi">Publikasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Yang Diajukan (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Kebutuhan</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan urgensi pembiayaan, lokasi pelaksanaan, serta rincian output kegiatan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Kirim Usulan RAB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
