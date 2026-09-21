import React, { useState } from 'react';
import {
  Star,
  Send,
  Bot,
  User,
  Zap,
  FileText,
  AlertTriangle,
  TrendingUp,
  School,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAssistantModule: React.FC = () => {
  const {
    projects,
    budgets,
    kpis,
    objectives,
    madrasahs,
    overallAbsorptionRate,
    averageBrandingScore,
    addToast,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Selamat datang di **KSKK AI Assistant**. Saya siap membantu menganalisis kinerja program KSKK, mendeteksi deviasi anggaran DIPA, merekomendasikan intervensi KPI, atau menyusun draft dokumen dinas seperti Kerangka Acuan Kerja (KAK).

Silakan pilih perintah cepat di bawah ini atau ajukan pertanyaan spesifik Anda.`,
      timestamp: 'Baru saja',
    },
  ]);

  const quickPrompts = [
    {
      title: 'Ringkasan Eksekutif & Bottleneck',
      prompt: 'Buatkan ringkasan eksekutif mingguan untuk Direktur KSKK Madrasah: sertakan status serapan DIPA, proyek yang mengalami deviasi jadwal, dan poin atensi penting.',
      taskType: 'executive_summary',
    },
    {
      title: 'Deteksi Anomali Anggaran',
      prompt: 'Analisis serapan anggaran pada seluruh program dan proyek KSKK. Identifikasi kegiatan dengan serapan rendah atau potensi sisa anggaran berlebih.',
      taskType: 'budget_analysis',
    },
    {
      title: 'Rekomendasi Intervensi KPI Warning',
      prompt: 'Periksa indikator KPI yang berstatus Warning atau di bawah target. Berikan rencana aksi taktis 30 hari untuk mencapai target Renstra.',
      taskType: 'kpi_recommendation',
    },
    {
      title: 'Afirmasi Branding Madrasah',
      prompt: 'Evaluasi hasil audit branding madrasah se-Indonesia. Berikan strategi pendampingan terfokus untuk madrasah kategori Priority Support dan Needs Improvement.',
      taskType: 'branding_strategy',
    },
  ];

  const handleSendMessage = async (textToSend?: string, taskType?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build real system context
      const context = {
        totalProjects: projects.length,
        criticalProjects: projects.filter((p) => p.status === 'Delayed').map((p) => p.name),
        budgetSummary: {
          overallAbsorptionRate: `${overallAbsorptionRate}%`,
          totalBudget: budgets.reduce((acc, b) => acc + b.requestedAmount, 0),
          realized: budgets.reduce((acc, b) => acc + b.realizedAmount, 0),
        },
        kpisAtWarning: kpis.filter((k) => k.status === 'Warning' || k.status === 'Critical').map((k) => ({
          code: k.code,
          name: k.name,
          achievement: `${k.achievement}%`,
        })),
        brandingNationalIndex: `${averageBrandingScore} / 100`,
        madrasahsPriorityCount: madrasahs.filter((m) => m.branding.tier === 'Priority Support').length,
      };

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context,
          taskType: taskType || 'general_query',
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Maaf, sistem tidak dapat memproses jawaban saat ini.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: 'Terjadi kendala saat menghubungi server AI. Pastikan koneksi aktif.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Teks Disalin', 'Tanggapan AI telah disalin ke clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
            <Star className="w-5 h-5 text-purple-700 fill-purple-700/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              KSKK Smart AI Assistant
            </h2>
            <p className="text-xs text-slate-500">
              Kecerdasan buatan berbasis data real-time untuk analisis eksekutif, deteksi anomali, dan drafting regulasi
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold self-start md:self-auto">
          Gemini Powered • Live Data Context
        </span>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.prompt, q.taskType)}
            disabled={isLoading}
            className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 text-left transition-all group disabled:opacity-50"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-900">{q.title}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {q.prompt}
            </p>
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col min-h-[480px]">
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-2 relative group ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-70">
                  <span className="font-bold">
                    {m.sender === 'user' ? 'Anda' : 'KSKK AI Assistant'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="absolute top-3 right-3 p-1 rounded bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200"
                    title="Salin Tanggapan"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600">
                Sedang menganalisis basis data terpadu KSKK...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ketik pertanyaan terkait data proyek, serapan DIPA, evaluasi KPI, atau instruksi KAK..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-purple-600 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
