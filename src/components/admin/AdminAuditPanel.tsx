import React, { useState } from 'react';
import {
  Shield,
  Key,
  Users,
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AdminAuditPanel: React.FC = () => {
  const { auditLogs, currentUser, setCurrentUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'rbac'>('audit');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchAction = filterAction === 'ALL' || log.action === filterAction;
    const userName = log.userName || log.user || '';
    const targetEntity = log.targetEntity || log.module || '';
    const targetName = log.targetName || log.object || '';
    const matchSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAction && matchSearch;
  });

  const rolesList: { role: UserRole; desc: string; accessCount: string }[] = [
    { role: 'Super Admin', desc: 'Akses penuh seluruh konfigurasi, log, dan pengguna', accessCount: 'All Modules' },
    { role: 'Direktur KSKK', desc: 'Hak approval final, disposisi kebijakan, dan dashboard eksekutif', accessCount: 'All Modules' },
    { role: 'Kasubdit', desc: 'Verifikasi berkas, persetujuan teknis, manajemen subdirektorat', accessCount: 'Planning, Budget, Project' },
    { role: 'Koordinator Program / PIC', desc: 'Update progress fisik proyek, penyusunan RAB, laporan', accessCount: 'Projects, Tasks, Docs' },
    { role: 'Bendahara / Tim Anggaran', desc: 'Validasi SBM, verifikasi SP2D, monitoring daya serap DIPA', accessCount: 'Budget, Approval' },
    { role: 'Monitoring & Evaluator', desc: 'Audit KPI/OKR, pemantauan status peringatan dini', accessCount: 'Monitoring, KPI, Reports' },
    { role: 'Kanwil / Kankemenag', desc: 'Monitoring wilayah provinsi/kabupaten dan verifikasi madrasah', accessCount: 'Madrasah, Branding' },
    { role: 'Kepala Madrasah / Operator', desc: 'Akses profil madrasah, input publikasi, dan brand audit', accessCount: 'Madrasah Profile' },
  ];

  const permissionsMatrix = [
    { module: 'Dashboard Eksekutif', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: true, monev: true, kanwil: true, madrasah: false },
    { module: 'Manajemen Proyek & KAK', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: false, monev: true, kanwil: false, madrasah: false },
    { module: 'Anggaran & RAB (DIPA)', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: true, monev: true, kanwil: false, madrasah: false },
    { module: 'Approval & Disposisi', superAdmin: true, direktur: true, kasubdit: true, pic: false, bendahara: true, monev: false, kanwil: false, madrasah: false },
    { module: 'Kinerja KPI & OKR', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: false, monev: true, kanwil: false, madrasah: false },
    { module: 'Database Madrasah (EMIS)', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: false, monev: true, kanwil: true, madrasah: true },
    { module: 'Branding & Medsos Madrasah', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: false, monev: true, kanwil: true, madrasah: true },
    { module: 'Sistem Peringatan Dini (Alert)', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: true, monev: true, kanwil: false, madrasah: false },
    { module: 'Repository Dokumen Resmi', superAdmin: true, direktur: true, kasubdit: true, pic: true, bendahara: true, monev: true, kanwil: true, madrasah: true },
    { module: 'Audit Trail & Konfigurasi', superAdmin: true, direktur: true, kasubdit: false, pic: false, bendahara: false, monev: true, kanwil: false, madrasah: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
            <Shield className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Audit Trail, Keamanan & Tata Kelola Hak Akses (RBAC)
            </h2>
            <p className="text-xs text-slate-500">
              Pencatatan riwayat transaksi immutable dan matriks kewenangan per modul organisasi
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'rbac' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Matriks RBAC (8 Role)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari pelaku, entitas target, atau aksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
              >
                <option value="ALL">Semua Aksi</option>
                <option value="CREATE_PROJECT">CREATE_PROJECT</option>
                <option value="APPROVE_BUDGET">APPROVE_BUDGET</option>
                <option value="UPDATE_KPI">UPDATE_KPI</option>
                <option value="BRANDING_SCORE_AUDIT">BRANDING_SCORE_AUDIT</option>
                <option value="UPLOAD_DOCUMENT">UPLOAD_DOCUMENT</option>
                <option value="ALERT_ACTION">ALERT_ACTION</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Waktu (WIB)</th>
                    <th className="py-3 px-4">Pengguna & Role</th>
                    <th className="py-3 px-4">Aksi / Event</th>
                    <th className="py-3 px-4">Target Entitas</th>
                    <th className="py-3 px-4">Perubahan Nilai</th>
                    <th className="py-3 px-4">IP & Perangkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block leading-tight">{log.userName || log.user}</strong>
                        <span className="text-[10px] text-slate-400">{log.userRole || log.role}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] text-slate-400 block font-semibold">{log.targetEntity || log.module}</span>
                        <strong className="text-slate-800 line-clamp-1">{log.targetName || log.object}</strong>
                      </td>

                      <td className="py-3 px-4 font-mono text-[10px]">
                        {log.oldValue && log.newValue ? (
                          <span>
                            <span className="text-rose-600 line-through">{String(log.oldValue)}</span> →{' '}
                            <span className="text-emerald-700 font-bold">{String(log.newValue)}</span>
                          </span>
                        ) : log.newValue ? (
                          <span className="text-emerald-700 font-bold">{String(log.newValue)}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                        {log.ipAddress} • {log.userAgent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE-BASED ACCESS CONTROL (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* Roles Description Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rolesList.map((r) => (
              <div
                key={r.role}
                onClick={() => {
                  const userObj = {
                    id: 'usr-simulated',
                    name: `Simulasi (${r.role})`,
                    email: 'user@kemenag.go.id',
                    role: r.role,
                    unit: 'Direktorat KSKK',
                  };
                  setCurrentUser(userObj);
                  addToast('info', 'Role Diubah', `Sekarang Anda menjelajah sebagai ${r.role}`);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  currentUser.role === r.role
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800'
                    : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold leading-tight">{r.role}</h4>
                  {currentUser.role === r.role && (
                    <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] leading-relaxed mt-1 ${
                    currentUser.role === r.role ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {r.desc}
                </p>
                <span
                  className={`text-[10px] font-mono font-semibold block mt-2 ${
                    currentUser.role === r.role ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  Akses: {r.accessCount}
                </span>
              </div>
            ))}
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Matriks Hak Akses Modul Berdasarkan Peran (Role Permission Matrix)
              </h3>
              <p className="text-xs text-slate-500">
                Pengaturan kewenangan baca, tulis, eksekusi anggaran, dan persetujuan SK Dirjen
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4 text-left">Modul Sistem</th>
                    <th className="py-3 px-2">Super Admin</th>
                    <th className="py-3 px-2">Direktur</th>
                    <th className="py-3 px-2">Kasubdit</th>
                    <th className="py-3 px-2">PIC / Koordinator</th>
                    <th className="py-3 px-2">Bendahara</th>
                    <th className="py-3 px-2">Monev</th>
                    <th className="py-3 px-2">Kanwil</th>
                    <th className="py-3 px-2">Madrasah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionsMatrix.map((row) => (
                    <tr key={row.module} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-left font-semibold text-slate-800">{row.module}</td>
                      <td className="py-3 px-2">
                        {row.superAdmin ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.direktur ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.kasubdit ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.pic ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.bendahara ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.monev ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.kanwil ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {row.madrasah ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
