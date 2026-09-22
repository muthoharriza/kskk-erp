import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Program,
  Project,
  BudgetProposal,
  ApprovalRequest,
  KPI,
  Objective,
  Madrasah,
  AppDocument,
  NotificationItem,
  AuditLog,
  MonitoringAlert,
  ApprovalDecision,
  BrandingTier,
  SubditDetail,
  SubditUploadItem,
  SubditAgendaItem,
  SubditAcademicItem,
  SuratMasukItem,
  SuratKeluarItem,
  DisposisiItem,
  ArsipTUItem,
} from '../types';
import {
  mockUsers,
  mockPrograms,
  mockProjects,
  mockBudgets,
  mockApprovals,
  mockKPIs,
  mockObjectives,
  mockMadrasahs,
  mockDocuments,
  mockAlerts,
  mockAuditLogs,
  mockNotifications,
} from '../data/mockData';
import {
  initialSubditsData,
  initialSuratMasukData,
  initialSuratKeluarData,
  initialDisposisiData,
  initialArsipTUData,
  GRAND_TOTAL_PAGU_KSKK,
} from '../data/subditData';

export type NavigationMenu =
  | 'dashboard'
  | 'subdit-kurikulum'
  | 'subdit-sarpras'
  | 'subdit-kelembagaan'
  | 'subdit-kesiswaan'
  | 'subdit-vokasi'
  | 'tata-usaha'
  | 'planning'
  | 'projects'
  | 'budget'
  | 'approval'
  | 'kpi-okr'
  | 'madrasah-db'
  | 'madrasah-branding'
  | 'monitoring'
  | 'documents'
  | 'reports'
  | 'admin-users'
  | 'admin-audit'
  | 'ai-assistant';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeMenu: NavigationMenu;
  setActiveMenu: (menu: NavigationMenu) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedMadrasahId: string | null;
  setSelectedMadrasahId: (id: string | null) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Notification
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: (open: boolean) => void;

  // Data Stores
  users: User[];
  programs: Program[];
  projects: Project[];
  budgets: BudgetProposal[];
  approvals: ApprovalRequest[];
  kpis: KPI[];
  objectives: Objective[];
  madrasahs: Madrasah[];
  documents: AppDocument[];
  alerts: MonitoringAlert[];
  auditLogs: AuditLog[];

  // Simplified Subdit & Tata Usaha Stores
  subdits: SubditDetail[];
  updateSubditBudget: (subditId: string, pagu: number, realisasi: number) => void;
  addUploadToSubdit: (subditId: string, upload: Partial<SubditUploadItem>) => void;
  addAgendaToSubdit: (subditId: string, agenda: Partial<SubditAgendaItem>) => void;
  addAcademicIndicator: (subditId: string, item: Partial<SubditAcademicItem>) => void;

  suratMasuk: SuratMasukItem[];
  addSuratMasuk: (surat: Partial<SuratMasukItem>) => void;
  suratKeluar: SuratKeluarItem[];
  addSuratKeluar: (surat: Partial<SuratKeluarItem>) => void;
  disposisiList: DisposisiItem[];
  addDisposisi: (disp: Partial<DisposisiItem>) => void;
  updateDisposisiStatus: (id: string, status: DisposisiItem['status']) => void;
  arsipTUList: ArsipTUItem[];
  addArsipTU: (arsip: Partial<ArsipTUItem>) => void;

  grandTotalPagu: number;
  grandTotalRealisasi: number;
  grandTotalSisa: number;
  grandTotalPersenSerapan: number;

  // Mutators & Workflows
  addProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  handleApprovalAction: (approvalId: string, decision: ApprovalDecision, comment: string) => void;
  addBudgetProposal: (proposal: Partial<BudgetProposal>) => void;
  updateKPI: (id: string, actual: number) => void;
  updateMadrasahBranding: (id: string, updates: Partial<Madrasah['branding']>) => void;
  addDocument: (doc: Partial<AppDocument>) => void;
  addAuditLog: (action: string, module: string, object: string, oldValue?: string, newValue?: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Quick stats
  totalBudget: number;
  totalRealized: number;
  overallAbsorptionRate: number;
  averageBrandingScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('kskk_active_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [activeMenu, setActiveMenu] = useState<NavigationMenu>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMadrasahId, setSelectedMadrasahId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Load / initialize collections
  const [users] = useState<User[]>(mockUsers);
  const [programs] = useState<Program[]>(mockPrograms);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('kskk_projects');
    return saved ? JSON.parse(saved) : mockProjects;
  });
  const [budgets, setBudgets] = useState<BudgetProposal[]>(() => {
    const saved = localStorage.getItem('kskk_budgets');
    return saved ? JSON.parse(saved) : mockBudgets;
  });
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const saved = localStorage.getItem('kskk_approvals');
    return saved ? JSON.parse(saved) : mockApprovals;
  });
  const [kpis, setKpis] = useState<KPI[]>(() => {
    const saved = localStorage.getItem('kskk_kpis');
    return saved ? JSON.parse(saved) : mockKPIs;
  });
  const [objectives] = useState<Objective[]>(mockObjectives);
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>(() => {
    const saved = localStorage.getItem('kskk_madrasahs');
    return saved ? JSON.parse(saved) : mockMadrasahs;
  });
  const [documents, setDocuments] = useState<AppDocument[]>(() => {
    const saved = localStorage.getItem('kskk_documents');
    return saved ? JSON.parse(saved) : mockDocuments;
  });
  const [alerts] = useState<MonitoringAlert[]>(mockAlerts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('kskk_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simplified Subdit & Tata Usaha Stores
  const [subdits, setSubdits] = useState<SubditDetail[]>(() => {
    const saved = localStorage.getItem('kskk_subdits');
    return saved ? JSON.parse(saved) : initialSubditsData;
  });

  const [suratMasuk, setSuratMasuk] = useState<SuratMasukItem[]>(() => {
    const saved = localStorage.getItem('kskk_surat_masuk');
    return saved ? JSON.parse(saved) : initialSuratMasukData;
  });

  const [suratKeluar, setSuratKeluar] = useState<SuratKeluarItem[]>(() => {
    const saved = localStorage.getItem('kskk_surat_keluar');
    return saved ? JSON.parse(saved) : initialSuratKeluarData;
  });

  const [disposisiList, setDisposisiList] = useState<DisposisiItem[]>(() => {
    const saved = localStorage.getItem('kskk_disposisi');
    return saved ? JSON.parse(saved) : initialDisposisiData;
  });

  const [arsipTUList, setArsipTUList] = useState<ArsipTUItem[]>(() => {
    const saved = localStorage.getItem('kskk_arsip_tu');
    return saved ? JSON.parse(saved) : initialArsipTUData;
  });

  // Persist important state
  useEffect(() => {
    localStorage.setItem('kskk_subdits', JSON.stringify(subdits));
  }, [subdits]);

  useEffect(() => {
    localStorage.setItem('kskk_surat_masuk', JSON.stringify(suratMasuk));
  }, [suratMasuk]);

  useEffect(() => {
    localStorage.setItem('kskk_surat_keluar', JSON.stringify(suratKeluar));
  }, [suratKeluar]);

  useEffect(() => {
    localStorage.setItem('kskk_disposisi', JSON.stringify(disposisiList));
  }, [disposisiList]);

  useEffect(() => {
    localStorage.setItem('kskk_arsip_tu', JSON.stringify(arsipTUList));
  }, [arsipTUList]);

  // Persist important state
  useEffect(() => {
    localStorage.setItem('kskk_active_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kskk_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('kskk_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('kskk_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('kskk_kpis', JSON.stringify(kpis));
  }, [kpis]);

  useEffect(() => {
    localStorage.setItem('kskk_madrasahs', JSON.stringify(madrasahs));
  }, [madrasahs]);

  useEffect(() => {
    localStorage.setItem('kskk_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('kskk_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Toast helper
  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add audit log
  const addAuditLog = (action: string, module: string, object: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.role,
      action,
      module,
      object,
      oldValue,
      newValue,
      ipAddress: '10.20.1.55',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Project Actions
  const addProject = (projectData: Partial<Project>) => {
    const id = `prj-${Date.now()}`;
    const newPrj: Project = {
      id,
      code: projectData.code || `KSKK-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: projectData.name || 'Proyek Baru KSKK',
      programId: projectData.programId || programs[0].id,
      programName: projectData.programName || programs[0].name,
      subdit: projectData.subdit || 'Kurikulum & Evaluasi',
      picName: projectData.picName || currentUser.name,
      picNip: projectData.picNip || currentUser.nip || '-',
      picEmail: projectData.picEmail || currentUser.email,
      startDate: projectData.startDate || new Date().toISOString().substring(0, 10),
      endDate: projectData.endDate || '2026-12-31',
      budgetTotal: projectData.budgetTotal || 5000000000,
      budgetRealized: 0,
      progress: 0,
      status: projectData.status || 'Planning',
      priority: projectData.priority || 'Medium',
      description: projectData.description || 'Deskripsi inisiatif proyek baru',
      tasksCount: 0,
      completedTasksCount: 0,
      milestones: projectData.milestones || [],
      tasks: projectData.tasks || [],
      risks: projectData.risks || [],
      attachments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: currentUser.name,
          action: 'Create Project',
          detail: `Proyek diinisiasi dengan pagu anggaran Rp ${(projectData.budgetTotal || 5000000000).toLocaleString('id-ID')}`,
        },
      ],
    };

    setProjects((prev) => [newPrj, ...prev]);
    addAuditLog('CREATE_PROJECT', 'Project', newPrj.name, undefined, `Status: ${newPrj.status}`);
    addToast('success', 'Proyek Dibuat', `Proyek ${newPrj.name} berhasil ditambahkan ke direktori.`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          addAuditLog(
            'UPDATE_PROJECT',
            'Project',
            p.name,
            `Status: ${p.status}, Progress: ${p.progress}%`,
            `Status: ${updated.status}, Progress: ${updated.progress}%`,
          );
          return updated;
        }
        return p;
      }),
    );
    addToast('info', 'Proyek Diperbarui', 'Data proyek berhasil disimpan dan diverifikasi.');
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE_PROJECT', 'Project', target.name, target.code, 'DELETED');
    addToast('warning', 'Proyek Dihapus', `Proyek ${target.name} telah dihapus.`);
  };

  // Approval Workflow
  const handleApprovalAction = (approvalId: string, decision: ApprovalDecision, comment: string) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id === approvalId) {
          const newStatus =
            decision === 'Approved' ? 'Approved' : decision === 'Rejected' ? 'Rejected' : 'Revision Required';
          const newStage = decision === 'Approved' ? 'Approved' : 'Revision';

          const newHistory = [
            ...appr.history,
            {
              id: `h-${Date.now()}`,
              approvalId,
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              decision,
              comment: comment || (decision === 'Approved' ? 'Disetujui sesuai regulasi dan ketersediaan anggaran.' : 'Diperlukan perbaikan dokumen.'),
            },
          ];

          addAuditLog('PROCESS_APPROVAL', 'Approval', appr.title, appr.status, newStatus);

          return {
            ...appr,
            status: newStatus,
            currentStage: newStage,
            history: newHistory,
          };
        }
        return appr;
      }),
    );

    addToast(
      decision === 'Approved' ? 'success' : decision === 'Rejected' ? 'error' : 'warning',
      `Approval: ${decision}`,
      `Keputusan ${decision} telah dicatat dalam jejak audit kementerian.`,
    );
  };

  // Budget proposal addition
  const addBudgetProposal = (proposalData: Partial<BudgetProposal>) => {
    const id = `bg-${Date.now()}`;
    const newProp: BudgetProposal = {
      id,
      proposalNumber: proposalData.proposalNumber || `RAB/KSKK/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      projectId: proposalData.projectId || projects[0]?.id || 'prj-01',
      projectName: proposalData.projectName || projects[0]?.name || 'Proyek KSKK',
      programName: proposalData.programName || programs[0]?.name || 'Program KSKK',
      subdit: proposalData.subdit || 'Kurikulum & Evaluasi',
      picName: proposalData.picName || currentUser.name,
      budgetCategory: proposalData.budgetCategory || 'Operasional',
      requestedAmount: proposalData.requestedAmount || 1000000000,
      approvedAmount: proposalData.approvedAmount || proposalData.requestedAmount || 1000000000,
      realizedAmount: 0,
      remainingAmount: proposalData.approvedAmount || proposalData.requestedAmount || 1000000000,
      submissionDate: new Date().toISOString().substring(0, 10),
      status: 'Submitted',
      fiscalYear: 2026,
      items: proposalData.items || [],
    };

    setBudgets((prev) => [newProp, ...prev]);

    // Also trigger approval item
    const newApproval: ApprovalRequest = {
      id: `appr-${Date.now()}`,
      title: `Usulan ${newProp.proposalNumber} - ${newProp.projectName}`,
      module: 'RAB',
      refNumber: newProp.proposalNumber,
      submittedBy: currentUser.name,
      submittedByRole: currentUser.role,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
      currentStage: 'Review',
      amount: newProp.requestedAmount,
      notes: `Pengajuan RAB kategori ${newProp.budgetCategory} untuk tahun anggaran ${newProp.fiscalYear}.`,
      history: [
        {
          id: `h-${Date.now()}`,
          approvalId: `appr-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          decision: 'Approved',
          comment: 'Usulan baru diajukan oleh PIC.',
        },
      ],
    };

    setApprovals((prev) => [newApproval, ...prev]);
    addAuditLog('SUBMIT_BUDGET', 'Anggaran', newProp.proposalNumber, undefined, `Jumlah: Rp ${newProp.requestedAmount.toLocaleString('id-ID')}`);
    addToast('success', 'RAB Diajukan', `Usulan ${newProp.proposalNumber} berhasil diajukan ke antrean approval.`);
  };

  // KPI update
  const updateKPI = (id: string, actual: number) => {
    setKpis((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const achievement = parseFloat(((actual / k.target) * 100).toFixed(1));
          const status =
            achievement >= 100 ? 'Achieved' : achievement >= 80 ? 'On Track' : achievement >= 60 ? 'Warning' : 'Critical';
          addAuditLog('UPDATE_KPI', 'KPI', k.name, `${k.actual} ${k.unit}`, `${actual} ${k.unit} (${achievement}%)`);
          return {
            ...k,
            actual,
            achievement,
            status,
          };
        }
        return k;
      }),
    );
    addToast('success', 'KPI Diperbarui', 'Realisasi KPI berhasil disimpan.');
  };

  // Madrasah branding update
  const updateMadrasahBranding = (id: string, updates: Partial<Madrasah['branding']>) => {
    setMadrasahs((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newBranding = { ...m.branding, ...updates };
          // Recalculate total if components changed
          const totalScore = Math.round(
            (newBranding.identityScore +
              newBranding.digitalPresenceScore +
              newBranding.contentScore +
              newBranding.visualQualityScore +
              newBranding.communicationScore +
              newBranding.engagementScore) /
              6,
          );
          const tier: BrandingTier =
            totalScore >= 80
              ? 'Strong'
              : totalScore >= 60
              ? 'Developing'
              : totalScore >= 40
              ? 'Needs Improvement'
              : 'Priority Support';

          const finalBranding = {
            ...newBranding,
            totalScore,
            tier,
            lastAssessedDate: new Date().toISOString().substring(0, 10),
          };

          addAuditLog('UPDATE_BRANDING', 'Branding', m.name, `Skor: ${m.branding.totalScore}`, `Skor: ${totalScore} (${tier})`);

          return {
            ...m,
            branding: finalBranding,
          };
        }
        return m;
      }),
    );
    addToast('success', 'Profil Branding Diperbarui', 'Skor digital branding madrasah telah dikalkulasi ulang.');
  };

  // Add Document
  const addDocument = (docData: Partial<AppDocument>) => {
    const id = `doc-${Date.now()}`;
    const newDoc: AppDocument = {
      id,
      title: docData.title || 'Dokumen Baru KSKK',
      docNumber: docData.docNumber || `DOC/KSKK/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      category: docData.category || 'Laporan',
      version: 'v1.0',
      owner: currentUser.name,
      unit: currentUser.unit,
      date: new Date().toISOString().substring(0, 10),
      fileSize: '2.5 MB',
      fileFormat: docData.fileFormat || 'PDF',
      status: 'Final',
      description: docData.description || 'Dokumen arsip resmi manajemen KSKK.',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('UPLOAD_DOCUMENT', 'Dokumen', newDoc.title, undefined, newDoc.docNumber);
    addToast('success', 'Dokumen Diunggah', `${newDoc.title} tersimpan di repository.`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi ditandai telah dibaca.');
  };

  // Calculate aggregates
  const totalBudget = programs.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalRealized = programs.reduce((sum, p) => sum + p.realizedBudget, 0);
  const overallAbsorptionRate = totalBudget > 0 ? parseFloat(((totalRealized / totalBudget) * 100).toFixed(1)) : 78.4;

  const averageBrandingScore =
    madrasahs.length > 0
      ? Math.round(madrasahs.reduce((sum, m) => sum + m.branding.totalScore, 0) / madrasahs.length)
      : 68;

  // Simplified Subdit and TU calculations & handlers
  const grandTotalPagu = subdits.reduce((acc, s) => acc + s.paguTotal, 0);
  const grandTotalRealisasi = subdits.reduce((acc, s) => acc + s.realisasiTotal, 0);
  const grandTotalSisa = grandTotalPagu - grandTotalRealisasi;
  const grandTotalPersenSerapan = grandTotalPagu > 0
    ? parseFloat(((grandTotalRealisasi / grandTotalPagu) * 100).toFixed(2))
    : 78.4;

  const updateSubditBudget = (subditId: string, pagu: number, realisasi: number) => {
    setSubdits((prev) => {
      const updated = prev.map((s) => {
        if (s.id === subditId) {
          const sisa = pagu - realisasi;
          const persen = pagu > 0 ? parseFloat(((realisasi / pagu) * 100).toFixed(2)) : 0;
          return {
            ...s,
            paguTotal: pagu,
            realisasiTotal: realisasi,
            sisaTotal: sisa,
            persenSerapan: persen,
          };
        }
        return s;
      });
      const newTotal = updated.reduce((sum, s) => sum + s.paguTotal, 0);
      return updated.map((s) => ({
        ...s,
        persenDariTotalAnggaran: newTotal > 0 ? parseFloat(((s.paguTotal / newTotal) * 100).toFixed(2)) : 0,
      }));
    });
    addToast('success', 'Anggaran Subdit Diperbarui', 'Pagu dan realisasi berhasil disinkronisasi ke Dashboard.');
  };

  const addUploadToSubdit = (subditId: string, upload: Partial<SubditUploadItem>) => {
    const newUpload: SubditUploadItem = {
      id: `up-${Date.now()}`,
      judul: upload.judul || 'Dokumen_Laporan_Subdit.pdf',
      kategori: upload.kategori || 'Keuangan',
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploader: upload.uploader || currentUser.name,
      ukuran: upload.ukuran || '2.8 MB',
      keterangan: upload.keterangan || '',
    };
    setSubdits((prev) =>
      prev.map((s) => (s.id === subditId ? { ...s, uploadsList: [newUpload, ...s.uploadsList] } : s))
    );
    addToast('success', 'File Laporan Terunggah', `${newUpload.judul} berhasil diarsipkan.`);
  };

  const addAgendaToSubdit = (subditId: string, agenda: Partial<SubditAgendaItem>) => {
    const newAgenda: SubditAgendaItem = {
      id: `ag-${Date.now()}`,
      judul: agenda.judul || 'Agenda Kegiatan Baru Subdit',
      tanggal: agenda.tanggal || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      waktu: agenda.waktu || '09:00 - 12:00 WIB',
      lokasi: agenda.lokasi || 'Kemenag RI Jakarta',
      pic: agenda.pic || currentUser.name,
      status: agenda.status || 'Akan Datang',
      keterangan: agenda.keterangan || '',
    };
    setSubdits((prev) =>
      prev.map((s) => (s.id === subditId ? { ...s, agendaList: [newAgenda, ...s.agendaList] } : s))
    );
    addToast('success', 'Agenda Terjadwal', `${newAgenda.judul} ditambahkan ke jadwal.`);
  };

  const addAcademicIndicator = (subditId: string, item: Partial<SubditAcademicItem>) => {
    const newItem: SubditAcademicItem = {
      id: `ak-${Date.now()}`,
      indikator: item.indikator || 'Indikator Capaian Baru',
      target: item.target || '100%',
      realisasi: item.realisasi || '0%',
      persentase: item.persentase || 0,
      status: item.status || 'On Track',
      catatan: item.catatan || '',
    };
    setSubdits((prev) =>
      prev.map((s) =>
        s.id === subditId
          ? {
              ...s,
              akademik: {
                ...s.akademik,
                indikatorList: [...s.akademik.indikatorList, newItem],
              },
            }
          : s
      )
    );
    addToast('success', 'Indikator Akademik Disimpan', 'Indikator performa akademik berhasil ditambahkan.');
  };

  const addSuratMasuk = (surat: Partial<SuratMasukItem>) => {
    const newSurat: SuratMasukItem = {
      id: `sm-${Date.now()}`,
      nomorSurat: surat.nomorSurat || `B-${Math.floor(1000 + Math.random() * 9000)}/TU/09/2026`,
      pengirim: surat.pengirim || 'Instansi Terkait',
      perihal: surat.perihal || 'Perihal Surat Masuk Baru',
      tanggalSurat: surat.tanggalSurat || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      tanggalDiterima: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      urgensi: surat.urgensi || 'Penting',
      status: 'Baru',
      fileAttachment: surat.fileAttachment || 'Lampiran_Surat_Masuk.pdf',
    };
    setSuratMasuk((prev) => [newSurat, ...prev]);
    addToast('success', 'Surat Masuk Tercatat', `Surat ${newSurat.nomorSurat} berhasil didaftarkan.`);
  };

  const addSuratKeluar = (surat: Partial<SuratKeluarItem>) => {
    const newSurat: SuratKeluarItem = {
      id: `sk-${Date.now()}`,
      nomorSurat: surat.nomorSurat || `B-${Math.floor(3000 + Math.random() * 2000)}/DJ.I/Dt.I.I/09/2026`,
      tujuan: surat.tujuan || 'Kepala Kanwil Kemenag se-Indonesia',
      perihal: surat.perihal || 'Penyampaian Informasi Resmi',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      penandatangan: surat.penandatangan || 'Direktur KSKK Madrasah',
      kategori: surat.kategori || 'Nota Dinas',
      status: surat.status || 'Terkirim',
    };
    setSuratKeluar((prev) => [newSurat, ...prev]);
    addToast('success', 'Surat Keluar Tercatat', `Surat ${newSurat.nomorSurat} berhasil diterbitkan.`);
  };

  const addDisposisi = (disp: Partial<DisposisiItem>) => {
    const newDisp: DisposisiItem = {
      id: `dsp-${Date.now()}`,
      suratMasukId: disp.suratMasukId,
      nomorSurat: disp.nomorSurat || 'Surat Masuk Terkait',
      asalSurat: disp.asalSurat || 'Pengirim Surat',
      perihal: disp.perihal || 'Tindak lanjut surat dinas',
      instruksiDirektur: disp.instruksiDirektur || 'Segera tindak lanjuti sesuai ketentuan.',
      tujuanSubdit: disp.tujuanSubdit || 'Semua Subdit',
      batasWaktu: disp.batasWaktu || '30 Sep 2026',
      status: 'Menunggu',
      catatanTindakLanjut: disp.catatanTindakLanjut || '',
    };
    setDisposisiList((prev) => [newDisp, ...prev]);
    addToast('success', 'Disposisi Diterbitkan', `Disposisi untuk surat ${newDisp.nomorSurat} berhasil dibuat.`);
  };

  const updateDisposisiStatus = (id: string, status: DisposisiItem['status']) => {
    setDisposisiList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    addToast('info', 'Status Disposisi Diperbarui', `Status kini: ${status}`);
  };

  const addArsipTU = (arsip: Partial<ArsipTUItem>) => {
    const newArsip: ArsipTUItem = {
      id: `ars-${Date.now()}`,
      nomorDokumen: arsip.nomorDokumen || `ARSIP-KSKK-${Date.now().toString().slice(-4)}/2026`,
      judul: arsip.judul || 'Dokumen Arsip Resmi KSKK',
      kategori: arsip.kategori || 'Keputusan Direktur / Dirjen',
      tahun: arsip.tahun || 2026,
      tanggalArsip: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: arsip.fileSize || '3.5 MB',
      uploader: currentUser.name,
    };
    setArsipTUList((prev) => [newArsip, ...prev]);
    addToast('success', 'Arsip Tersimpan', `${newArsip.judul} berhasil disimpan di Arsip TU.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeMenu,
        setActiveMenu,
        selectedProjectId,
        setSelectedProjectId,
        selectedMadrasahId,
        setSelectedMadrasahId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        isNotificationPanelOpen,
        setIsNotificationPanelOpen,
        users,
        programs,
        projects,
        budgets,
        approvals,
        kpis,
        objectives,
        madrasahs,
        documents,
        alerts,
        auditLogs,
        addProject,
        updateProject,
        deleteProject,
        handleApprovalAction,
        addBudgetProposal,
        updateKPI,
        updateMadrasahBranding,
        addDocument,
        addAuditLog,
        toasts,
        addToast,
        removeToast,
        totalBudget,
        totalRealized,
        overallAbsorptionRate,
        averageBrandingScore,
        // Simplified Subdit & Tata Usaha Exports
        subdits,
        updateSubditBudget,
        addUploadToSubdit,
        addAgendaToSubdit,
        addAcademicIndicator,
        suratMasuk,
        addSuratMasuk,
        suratKeluar,
        addSuratKeluar,
        disposisiList,
        addDisposisi,
        updateDisposisiStatus,
        arsipTUList,
        addArsipTU,
        grandTotalPagu,
        grandTotalRealisasi,
        grandTotalSisa,
        grandTotalPersenSerapan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
