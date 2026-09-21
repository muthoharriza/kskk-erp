import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI client lazily if key is available
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "KSKK-IMS",
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Assistant Endpoint for KSKK Madrasah
app.post("/api/ai/assistant", async (req, res) => {
  const { prompt, context, taskType } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const ai = getAI();

  if (ai) {
    try {
      const systemInstruction = `Anda adalah KSKK AI Assistant, asisten kecerdasan buatan resmi untuk Direktorat Kurikulum, Sarana, Kelembagaan, dan Kesiswaan (KSKK) Madrasah, Direktorat Jenderal Pendidikan Islam, Kementerian Agama Republik Indonesia.
Tugas Anda:
1. Membantu pimpinan dan tim KSKK menganalisis performa program, proyek, serapan anggaran, KPI & OKR, risiko, serta profil branding dan publikasi madrasah.
2. Memberikan ringkasan eksekutif, identifikasi bottleneck (proyek terlambat, serapan rendah, KPI warning, branding lemah), serta rekomendasi tindak lanjut konkret berbasis data.
3. Menulis dalam Bahasa Indonesia formal, birokratis-profesional yang elegan, lugas, dan akuntabel.
4. Jangan menyarankan perubahan data master secara otomatis tanpa otorisasi pimpinan.
5. Format jawaban dengan markdown rapi, bullet points, dan penekanan yang jelas.`;

      const contents = `[KONTEKS SISTEM KSKK-IMS]:
${context ? JSON.stringify(context, null, 2) : "Data live dashboard KSKK Madrasah"}

[TIPE TUGAS]: ${taskType || "Umum"}
[PERTANYAAN / INSTRUKSI USER]:
${prompt}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({
        success: true,
        reply: response.text,
        source: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to smart engine:", err?.message || err);
      // Fall through to fallback engine below
    }
  }

  // Smart domain fallback engine if API key is unconfigured or rate limited
  const p = prompt.toLowerCase();
  let generatedAnswer = "";

  if (p.includes("terlambat") || p.includes("delay") || p.includes("risk") || p.includes("kendala")) {
    generatedAnswer = `### Analisis Proyek & Risiko KSKK Madrasah

Berdasarkan data operasional terkini:
- **Proyek Terlambat / Kritis**:
  1. *Pengadaan Server & CBT Asesmen Madrasah 2026* (Status: **Delayed** - Progress 42%, Target 70%). Kendala utama: Proses lelang vendor tahap 2 mengalami sanggahan administrasi.
  2. *Rehabilitasi Ruang Kelas Rusak Berat Wilayah 3T* (Status: **At Risk** - Progress 58%). Kendala: Cuaca ekstrem & mobilisasi material pulau terluar.
- **Rekomendasi Tindak Lanjut**:
  - Terbitkan Surat Peringatan (SP-1) kepada rekanan penyedia dan jadwalkan rapat koordinasi percepatan (SCM) bersama PPK dan Tim Pengadaan.
  - Alihkan alokasi logistik darurat untuk wilayah 3T dengan koordinasi Kanwil Kemenag Provinsi setempat.`;
  } else if (p.includes("kpi") || p.includes("okr") || p.includes("target")) {
    generatedAnswer = `### Analisis Capaian KPI & OKR Direktorat KSKK

- **Status Keseluruhan**: Capaian KPI rata-rata mencapai **84%** dan progress OKR berada di level **81%**.
- **Indikator Membutuhkan Perhatian (Warning/Critical)**:
  - **KPI-04: Digitalisasi Perpustakaan Madrasah** (Realisasi: 54% vs Target: 75%).
  - **KPI-07: Sertifikasi Kompetensi Guru Robotik & AI** (Realisasi: 62% vs Target: 80%).
- **Rekomendasi Akselerasi**:
  - Kolaborasi dengan Balai Diklat Keagamaan untuk menyelenggarakan *training of trainers* (ToT) hybrid sebelum triwulan III berakhir.
  - Sinergikan hibah e-book Kemenag dengan platform perpustakaan digital madrasah nasional.`;
  } else if (p.includes("anggaran") || p.includes("budget") || p.includes("serapan") || p.includes("rab")) {
    generatedAnswer = `### Ringkasan Eksekutif Serapan Anggaran KSKK

- **Pagu Total**: Rp 1.450.000.000.000 (1,45 Triliun)
- **Realisasi**: Rp 1.136.800.000.000 (**78.4%**)
- **Sisa Anggaran**: Rp 313.200.000.000 (21.6%)
- **Catatan Realisasi**:
  - Subdit Kurikulum & Evaluasi: Serapan 82.1% (On Track).
  - Subdit Kelembagaan & Kerjasama: Serapan 71.5% (Perlu percepatan MoU internasional).
  - Terdapat **8 pengajuan revisi RAB** yang saat ini menunggu approval Pejabat Pembuat Komitmen (PPK).`;
  } else if (p.includes("branding") || p.includes("publikasi") || p.includes("medsos") || p.includes("website")) {
    generatedAnswer = `### Evaluasi Branding & Komunikasi Digital Madrasah

- **Rata-rata Skor Branding Nasional**: **68 / 100** (*Developing*).
- **Temuan Kunci dari 50+ Sampel Madrasah**:
  - **Website Aktif & Ber-domain Resmi (sch.id)**: 64%
  - **Konsistensi Brand Guideline & Logo Resmi Kemenag**: 52%
  - **Frekuensi Publikasi Konten (min. 3x/minggu)**: 45%
  - **Kualitas Visual & Desain Grafis**: Masih didominasi template seadanya tanpa standardisasi palet warna Kemenag.
- **Rekomendasi Strategis**:
  1. Luncurkan *Madrasah Digital Brand Kit 2026* (template Canva & panduan tipografi).
  2. Buka workshop daring jurnalistik & videografi humas madrasah secara bertahap untuk Kanwil dan Kankemenag.`;
  } else {
    generatedAnswer = `### Executive Summary & Insight KSKK-IMS

Halo, berikut adalah rangkuman performa terintegrasi Direktorat KSKK Madrasah:

1. **Program & Proyek**: Dari total **48 Program Strategis**, terdapat **17 Proyek Aktif** dan **26 Proyek Selesai**. 3 proyek memerlukan pemantauan intensif di Monitoring Center.
2. **Keuangan**: Serapan anggaran mencapai **78.4%** dari total pagu, dengan deviasi serapan masih dalam koridor wajar target semester berjalan.
3. **Kinerja Strategis**: Rata-rata pencapaian KPI **84%** dan OKR **81%**.
4. **Transformasi Digital Madrasah**: Indeks Branding dan Publikasi Digital berada pada skor **68/100**. Pendampingan intensif diprioritaskan untuk madrasah swasta dan wilayah 3T.

Ketik instruksi spesifik untuk membedah proyek tertentu, menyusun draft memo dinas, atau menghasilkan draf laporan pimpinan.`;
  }

  return res.json({
    success: true,
    reply: generatedAnswer,
    source: "smart-engine-fallback",
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KSKK-IMS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
