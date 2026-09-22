export type UserRole =
  | 'Super Admin'
  | 'Direktur KSKK'
  | 'Executive'
  | 'Kasubdit'
  | 'Program Manager'
  | 'Koordinator Program / PIC'
  | 'Finance'
  | 'Bendahara / Tim Anggaran'
  | 'PIC'
  | 'Monitoring & Evaluator'
  | 'Reviewer'
  | 'Kanwil / Kankemenag'
  | 'Madrasah Admin'
  | 'Kepala Madrasah / Operator'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nip?: string;
  unit: string;
  avatar?: string;
}

export type ProjectStatus =
  | 'Draft'
  | 'Planning'
  | 'In Progress'
  | 'At Risk'
  | 'Delayed'
  | 'Completed'
  | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type SubditType =
  | 'Kurikulum & Evaluasi'
  | 'Sarana & Prasarana'
  | 'Kelembagaan & Kerjasama'
  | 'Kesiswaan'
  | 'Tata Usaha';

export interface Program {
  id: string;
  code: string;
  name: string;
  directorate: string; // e.g. "Direktorat KSKK Madrasah"
  subdit: SubditType;
  year: number;
  totalBudget: number;
  allocatedBudget: number;
  realizedBudget: number;
  targetProjectsCount: number;
  status: 'Active' | 'Completed' | 'Pending';
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedTo: string;
  assignee?: string;
  dueDate: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done' | 'Completed';
  priority: PriorityLevel;
}
export type TaskItem = Task;

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  weight: number; // in percentage
}

export interface RiskIssue {
  id: string;
  projectId: string;
  type: 'Risk' | 'Issue';
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  level?: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationPlan: string;
  mitigation?: string;
  status: 'Open' | 'Mitigated' | 'Resolved';
  reportedDate: string;
  owner: string;
}
export type RiskItem = RiskIssue;

export interface ProjectAttachment {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  fileType: string;
}

export interface ProjectActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  detail: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  programId: string;
  programName: string;
  subdit: string;
  picName: string;
  picNip: string;
  picEmail: string;
  startDate: string;
  endDate: string;
  budgetTotal: number;
  budgetRealized: number;
  progress: number; // 0 - 100
  status: ProjectStatus;
  priority: PriorityLevel;
  description: string;
  tasksCount: number;
  completedTasksCount: number;
  milestones: Milestone[];
  tasks: Task[];
  risks: RiskIssue[];
  attachments: ProjectAttachment[];
  activities: ProjectActivityLog[];
}

export type BudgetStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Reviewed'
  | 'Revision Required'
  | 'Revised'
  | 'Approved'
  | 'Rejected'
  | 'Realization';

export interface BudgetItem {
  id: string;
  budgetId: string;
  codeAkun: string; // e.g. "521211 - Belanja Bahan"
  code?: string;
  name?: string;
  description: string;
  volume: number;
  satuan: string;
  unit?: string;
  unitPrice: number;
  totalPrice: number;
  realizedAmount: number;
}

export type BudgetCategoryType =
  | 'Operasional'
  | 'Modal / Sarpras'
  | 'Bimbingan Teknis & Pelatihan'
  | 'Bantuan Pemerintah'
  | 'Publikasi & Humas'
  | 'Bantuan'
  | 'Pelatihan'
  | 'Sarpras'
  | 'Publikasi';

export interface BudgetProposal {
  id: string;
  proposalNumber: string;
  projectId: string;
  projectName: string;
  programName: string;
  subdit: string;
  picName: string;
  budgetCategory: BudgetCategoryType;
  requestedAmount: number;
  approvedAmount: number;
  realizedAmount: number;
  remainingAmount: number;
  submissionDate: string;
  status: BudgetStatus;
  approverName?: string;
  approverRole?: string;
  reviewNotes?: string;
  fiscalYear: number;
  items: BudgetItem[];
}

export type ApprovalDecision = 'Approved' | 'Rejected' | 'Revision Required' | 'Revision';
export type ApprovalStage = 'Draft' | 'Submitted' | 'Review' | 'Revision' | 'Approval' | 'Approved';

export interface ApprovalHistory {
  id: string;
  approvalId: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  decision: ApprovalDecision;
  comment: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  module: 'Anggaran' | 'Project' | 'RAB' | 'SK / Kebijakan' | 'SOP';
  refNumber: string;
  submittedBy: string;
  submittedByRole: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
  currentStage: ApprovalStage;
  amount?: number;
  notes: string;
  history: ApprovalHistory[];
}

export type KPIStatus = 'On Track' | 'Warning' | 'Critical' | 'Achieved';
export type KPICategory = 'Strategic' | 'Program' | 'Project';

export interface KPI {
  id: string;
  code: string;
  name: string;
  category: KPICategory;
  strategicObjective: string;
  baseline?: number;
  target: number;
  actual: number;
  unit: string;
  period: string; // e.g. "TW-1 2026", "Tahunan 2026"
  picName: string;
  weight: number; // Bobot percentage
  achievement: number; // (actual / target) * 100
  calculationFormula?: string;
  status: KPIStatus;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  progress: number;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  owner: string;
}

export interface Objective {
  id: string;
  title: string;
  owner: string;
  period: string;
  timeframe?: string;
  progress: number;
  subdit: string;
  keyResults: KeyResult[];
}

export type MadrasahJenjang = 'RA' | 'MI' | 'MTs' | 'MA' | 'MAK';
export type MadrasahStatus = 'Negeri' | 'Swasta';

export type BrandingTier = 'Strong' | 'Developing' | 'Needs Improvement' | 'Priority Support';

export interface MadrasahPublication {
  id: string;
  title: string;
  channel: 'Website' | 'Instagram' | 'YouTube' | 'Facebook';
  date: string;
  engagement: string;
  url: string;
}

export interface MadrasahBranding {
  identityScore: number; // 0-100 (Logo, Brand Guideline, Konsistensi)
  digitalPresenceScore: number; // 0-100 (Website, Medsos)
  contentScore: number; // 0-100 (Frekuensi, Mutu Konten, Edukasi)
  visualQualityScore: number; // 0-100 (Foto, Video, Grafis)
  communicationScore: number; // 0-100 (Kejelasan Info, Respon, Kontak)
  engagementScore: number; // 0-100 (Followers, Reach, Views)
  totalScore: number; // 0-100
  tier: BrandingTier;
  hasBrandGuideline: boolean;
  hasOfficialWebsite: boolean;
  publicationFrequencyWeekly: number;
  topImprovementNeeds: string[];
  improvementPoints?: string[];
  recommendedActions: string[];
  lastAssessedDate: string;
  publications?: MadrasahPublication[];
}

export interface Madrasah {
  id: string;
  nsm: string; // Nomor Statistik Madrasah
  npsn: string; // Nomor Pokok Sekolah Nasional
  name: string;
  jenjang: MadrasahJenjang;
  status: MadrasahStatus;
  provinsi: string;
  kabupatenKota: string;
  kecamatan: string;
  alamat: string;
  kepalaMadrasah: string;
  kontak?: string;
  kontakPublikasi: string;
  akreditasi?: string;
  jumlahSiswa: number;
  jumlahGuru: number;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  socialMedia?: {
    instagram: string;
    youtube: string;
    facebook: string;
  };
  email: string;
  branding: MadrasahBranding;
}

export type DocumentCategory =
  | 'TOR / KAK'
  | 'TOR'
  | 'RAB'
  | 'Proposal'
  | 'Surat Menyurat'
  | 'Surat'
  | 'SK Tim'
  | 'SK'
  | 'Laporan'
  | 'Dokumentasi'
  | 'Foto'
  | 'Video'
  | 'Materi'
  | 'Brand Guideline';

export interface AppDocument {
  id: string;
  title: string;
  docNumber: string;
  category: DocumentCategory;
  version: string;
  owner: string;
  unit: string;
  relatedProject?: string;
  date: string;
  fileSize: string;
  fileFormat: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | 'MP4' | 'PNG' | string;
  status: 'Draft' | 'Final' | 'Archived';
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'budget' | 'project' | 'kpi' | 'okr' | 'document' | 'monitoring';
  timestamp: string;
  read: boolean;
  linkId?: string;
  priority: 'low' | 'normal' | 'high';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userName?: string;
  role: string;
  userRole?: string;
  action: string;
  module: string;
  targetEntity?: string;
  targetName?: string;
  object: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface MonitoringAlert {
  id: string;
  category: 'Project' | 'KPI' | 'Approval' | 'Budget' | 'Madrasah' | 'OKR' | 'Branding';
  level: 'red' | 'yellow' | 'orange' | 'green';
  title: string;
  detail: string;
  description?: string;
  timestamp: string;
  date?: string;
  targetModule: string;
  targetId?: string;
  actionNeeded: string;
  actionText?: string;
}

// ==========================================
// SIMPLIFIED SUBDIT & TATA USAHA DATA TYPES
// ==========================================

export interface SubditAcademicItem {
  id: string;
  indikator: string;
  target: string;
  realisasi: string;
  persentase: number;
  status: 'Tercapai' | 'On Track' | 'Perlu Perhatian';
  catatan?: string;
}

export interface SubditAgendaItem {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  pic: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  keterangan: string;
}

export interface SubditBudgetItem {
  id: string;
  namaProgram: string;
  kodeAkun: string;
  pagu: number;
  realisasi: number;
  sisa: number;
  persen: number;
}

export interface SubditUploadItem {
  id: string;
  judul: string;
  kategori: 'Keuangan' | 'Akademik' | 'Agenda' | 'Lainnya';
  tanggal: string;
  uploader: string;
  ukuran: string;
  fileUrl?: string;
  keterangan?: string;
}

export interface SubditDetail {
  id: string;
  nama: string;
  singkatan: string;
  kasubdit: string;
  nipKasubdit: string;
  email: string;
  paguTotal: number;
  realisasiTotal: number;
  sisaTotal: number;
  persenSerapan: number; // (realisasiTotal / paguTotal) * 100
  persenDariTotalAnggaran: number; // (paguTotal / grandTotalPagu) * 100
  itemsAnggaran: SubditBudgetItem[];
  akademik: {
    ringkasan: string;
    skorKinerjaAkademik: number; // 0 - 100
    indikatorList: SubditAcademicItem[];
  };
  agendaList: SubditAgendaItem[];
  uploadsList: SubditUploadItem[];
}

export interface SuratMasukItem {
  id: string;
  nomorSurat: string;
  pengirim: string;
  perihal: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  urgensi: 'Biasa' | 'Penting' | 'Segera' | 'Sangat Segera';
  status: 'Baru' | 'Didisposisikan' | 'Diproses' | 'Selesai';
  fileAttachment?: string;
}

export interface SuratKeluarItem {
  id: string;
  nomorSurat: string;
  tujuan: string;
  perihal: string;
  tanggalSurat: string;
  penandatangan: string;
  kategori: 'Nota Dinas' | 'Surat Edaran' | 'Undangan' | 'Surat Keputusan' | 'Surat Tugas';
  status: 'Konsep' | 'Menunggu TTD' | 'Terkirim' | 'Arsip';
}

export interface DisposisiItem {
  id: string;
  suratMasukId?: string;
  nomorSurat: string;
  asalSurat: string;
  perihal: string;
  instruksiDirektur: string;
  tujuanSubdit: string;
  batasWaktu: string;
  status: 'Menunggu' | 'Dalam Proses' | 'Selesai';
  catatanTindakLanjut?: string;
}

export interface ArsipTUItem {
  id: string;
  nomorDokumen: string;
  judul: string;
  kategori: 'Keputusan Direktur / Dirjen' | 'Juknis & Panduan' | 'Laporan Keuangan / DIPA' | 'MoU & Kerjasama' | 'Arsip Umum TU';
  tahun: number;
  tanggalArsip: string;
  fileSize: string;
  uploader: string;
}

