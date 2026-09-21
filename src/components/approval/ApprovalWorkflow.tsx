import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Shield,
  FileText,
  UserCheck,
  ChevronRight,
  Filter,
  MessageSquare,
  Send,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApprovalRequest, ApprovalDecision, ApprovalStage } from '../../types';

export const ApprovalWorkflow: React.FC = () => {
  const { approvals, handleApprovalAction, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);

  // Decision Modal
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    decision: ApprovalDecision;
    item: ApprovalRequest | null;
  }>({
    open: false,
    decision: 'Approved',
    item: null,
  });
  const [decisionComment, setDecisionComment] = useState('');

  const pendingApprovals = approvals.filter((a) => a.status === 'Pending' || a.status === 'Revision Required');
  const historyApprovals = approvals.filter((a) => a.status === 'Approved' || a.status === 'Rejected');

  const openDecisionDialog = (item: ApprovalRequest, decision: ApprovalDecision) => {
    setDecisionModal({ open: true, decision, item });
    setDecisionComment(
      decision === 'Approved'
        ? 'Disetujui untuk diproses ke pencairan SP2D dan realisasi kegiatan.'
        : decision === 'Rejected'
        ? 'Ditolak karena tidak sesuai dengan standar biaya masukan (SBM).'
        : 'Mohon perbaiki dokumen rincian belanja dan KAK.',
    );
  };

  const handleConfirmDecision = () => {
    if (!decisionModal.item) return;
    handleApprovalAction(decisionModal.item.id, decisionModal.decision, decisionComment);
    setDecisionModal({ open: false, decision: 'Approved', item: null });
    if (selectedApproval?.id === decisionModal.item.id) {
      setSelectedApproval(null);
    }
  };

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const stagesOrder: ApprovalStage[] = ['Draft', 'Submitted', 'Review', 'Approval', 'Approved'];

  const getStageIndex = (stage: ApprovalStage) => {
    if (stage === 'Revision') return 2; // parallel to review
    return stagesOrder.indexOf(stage);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Approval Workflow & Disposisi
            </h2>
            <p className="text-xs text-slate-500">
              Mekanisme persetujuan berjenjang: Pengajuan Dokumen, Usulan Anggaran, dan Laporan Capaian
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <span>Antrean Masuk</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px]">
              {pendingApprovals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <span>Riwayat Disposisi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {historyApprovals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Alur Workflow Standar KSKK
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Draft', desc: 'Penyusunan Usulan' },
            { step: '2', title: 'Submitted', desc: 'Pengiriman Berkas' },
            { step: '3', title: 'Review', desc: 'Verifikasi Tim Teknis' },
            { step: '4', title: 'Revision', desc: 'Perbaikan Dokumen' },
            { step: '5', title: 'Approval', desc: 'Otorisasi Pimpinan' },
            { step: '6', title: 'Approved', desc: 'Pencairan / Terbit' },
          ].map((s, idx) => (
            <div
              key={s.title}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 relative"
            >
              <span className="inline-block w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {s.step}
              </span>
              <p className="font-bold text-slate-800">{s.title}</p>
              <p className="text-[10px] text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {(activeTab === 'pending' ? pendingApprovals : historyApprovals).map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    {item.refNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    Modul: {item.module}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">
                    Diajukan oleh: <strong className="text-slate-700">{item.submittedBy}</strong> ({item.submittedByRole})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>
              </div>

              <div className="flex flex-col sm:items-end shrink-0">
                {item.amount && (
                  <span className="text-sm font-extrabold text-slate-900 font-mono">
                    {formatRupiah(item.amount)}
                  </span>
                )}
                <span
                  className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : item.status === 'Revision Required'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {item.status} ({item.currentStage})
                </span>
              </div>
            </div>

            {/* Decision Actions Bar for Pending */}
            {item.status === 'Pending' && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Diajukan pada: {item.submittedAt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDecisionDialog(item, 'Revision')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Minta Revisi</span>
                  </button>

                  <button
                    onClick={() => openDecisionDialog(item, 'Rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>

                  <button
                    onClick={() => openDecisionDialog(item, 'Approved')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Setujui (Approve)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Decision History (Audit Trail) */}
            {item.history.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Jejak Disposisi & Catatan:
                </span>
                {item.history.map((h) => (
                  <div key={h.id} className="flex items-start gap-2 text-slate-600">
                    <span className="text-slate-400">•</span>
                    <div>
                      <span className="font-bold text-slate-800">{h.userName}</span> ({h.userRole}):{' '}
                      <span className="text-slate-700 font-medium">"{h.comment}"</span>{' '}
                      <span className="text-[10px] text-slate-400">({h.timestamp})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {(activeTab === 'pending' ? pendingApprovals : historyApprovals).length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Tidak ada dokumen dalam daftar ini.
          </div>
        )}
      </div>

      {/* CONFIRMATION / REASON MODAL */}
      {decisionModal.open && decisionModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Konfirmasi Keputusan: {decisionModal.decision}
              </h3>
              <button
                onClick={() => setDecisionModal({ open: false, decision: 'Approved', item: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">Pengajuan:</span>
                <p className="font-bold text-slate-800">{decisionModal.item.title}</p>
                <p className="text-[11px] text-slate-500">Nomor: {decisionModal.item.refNumber}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catatan Resmi Pejabat / Alasan Keputusan
                </label>
                <textarea
                  rows={4}
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600 text-xs leading-relaxed"
                  placeholder="Berikan instruksi revisi, klausul persetujuan, atau catatan regulasi..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionModal({ open: false, decision: 'Approved', item: null })}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecision}
                  className={`px-4 py-2 text-white rounded-xl font-bold ${
                    decisionModal.decision === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : decisionModal.decision === 'Rejected'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Konfirmasi Keputusan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
