import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  FileSpreadsheet,
  FileCheck,
  FolderOpen,
  Plus,
  X,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppDocument, DocumentCategory } from '../../types';

export const DocumentManagement: React.FC = () => {
  const { documents, addDocument, currentUser, addToast } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('TOR / KAK');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('PDF');

  // Preview modal
  const [previewDoc, setPreviewDoc] = useState<AppDocument | null>(null);

  const categories: DocumentCategory[] = [
    'TOR / KAK',
    'RAB',
    'Proposal',
    'Surat Menyurat',
    'SK Tim',
    'Laporan',
    'Brand Guideline',
  ];

  const filteredDocs = documents.filter((d) => {
    const matchCat = filterCategory === 'ALL' || d.category === filterCategory;
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      title,
      category,
      description,
      fileFormat: format,
      fileSize: '3.4 MB',
      docNumber: `DOC/KSKK/2026/${Math.floor(100 + Math.random() * 900)}`,
    });

    setIsUploadOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleDownload = (doc: AppDocument) => {
    addToast('success', 'Mengunduh Dokumen', `Berkas ${doc.title}.${doc.fileFormat.toLowerCase()} sedang diunduh.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Repository Dokumen Resmi & Aset Digital
            </h2>
            <p className="text-xs text-slate-500">
              Penyimpanan terpusat KAK/TOR, RAB, Surat Keputusan Tim, Laporan BAST, dan Panduan Brand Identity
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari judul berkas, nomor dokumen, atau pemilik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterCategory === 'ALL'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({documents.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {doc.docNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  {doc.category}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {doc.title}
              </h4>

              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>Unit: <strong className="text-slate-700">{doc.unit}</strong></span>
                <span className="font-mono">{doc.version} • {doc.fileFormat} ({doc.fileSize})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Diunggah: {doc.date}</span>
                <span className="text-slate-700 font-semibold">{doc.owner}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Unggah Dokumen ke Repository KSKK</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Dokumen Resmi</label>
                <input
                  type="text"
                  placeholder="Contoh: KAK Petunjuk Teknis Pelaksanaan Robotik 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Berkas</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format Berkas</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="DOCX">DOCX (Word Document)</option>
                    <option value="XLSX">XLSX (Spreadsheet RAB)</option>
                    <option value="ZIP">ZIP (Arsip Berkas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan / Abstrak Dokumen</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan perihal, dasar hukum, dan tujuan diterbitkannya dokumen ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="font-bold text-slate-700 text-xs">Tarik berkas ke sini atau klik untuk memilih</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Maksimal ukuran file: 25 MB</p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan ke Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                  {previewDoc.docNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{previewDoc.title}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p><strong>Kategori:</strong> {previewDoc.category}</p>
                <p><strong>Unit Kerja:</strong> {previewDoc.unit}</p>
                <p><strong>Pemilik Dokumen:</strong> {previewDoc.owner}</p>
                <p><strong>Tanggal Terbit:</strong> {previewDoc.date}</p>
                <p><strong>Versi & Format:</strong> {previewDoc.version} ({previewDoc.fileFormat}, {previewDoc.fileSize})</p>
                <p><strong>Deskripsi:</strong> {previewDoc.description}</p>
              </div>

              <div className="p-8 border rounded-xl bg-slate-100/60 text-center space-y-2">
                <FileCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-800">Verifikasi Tanda Tangan Elektronik Sah</p>
                <p className="text-[11px] text-slate-500">
                  Dokumen ini telah dibubuhi segel digital Kementerian Agama RI dan sah digunakan dalam pelaporan kedinasan.
                </p>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Salinan Asli</span>
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
