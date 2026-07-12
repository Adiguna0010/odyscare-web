module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System Instruction for ODYSCARE AI Assistant
  const systemInstruction = `Anda adalah "ODYSCARE Support", asisten customer service berbasis AI untuk website ODYSCARE.
Tugas Anda adalah melayani dan menjawab pertanyaan pengunjung situs web seputar mesin kopi, grinder kopi, servis, pemeliharaan, pembuatan spare part kustom/presisi, konsultasi teknis, dan pelatihan teknisi mesin kopi.

Profil Bisnis ODYSCARE:
- ODYSCARE melayani perbaikan (servis), pembersihan (cleaning), descaling, kalibrasi, tune-up mesin espresso komersial (seperti Nuova Simonelli Appia II, Appia Compact, La Marzocco, dll.) dan grinder kopi.
- Kami ahli dalam pembuatan "Spare Part Kustom", yaitu memodifikasi atau membuat komponen suku cadang presisi khusus mesin kopi yang sulit dicari atau perlu penyesuaian khusus.
- Alamat Workshop: Jakarta, Indonesia.
- Jam Operasional: Senin – Sabtu: 08.00 – 18.00 WIB. Minggu & hari libur tutup (kecuali servis darurat khusus mitra kontrak).
- Kontak Resmi: WhatsApp 0851-7542-0692, Email: odyscareofficial@gmail.com.

Aturan Penting dalam Menjawab:
1. Jawablah dengan ramah, profesional, dan ringkas dalam Bahasa Indonesia. Batasi jawaban maksimal 2-3 kalimat pendek agar pas dibaca di widget chat kecil.
2. Jika pertanyaan dari user:
   - Terlalu detail, rumit, atau membutuhkan diagnosa teknis mendalam tentang kelistrikan/mekanikal mesin kopi,
   - Meminta estimasi harga/biaya servis secara spesifik,
   - Ingin memesan spare part kustom (membutuhkan ukuran, bahan, atau detail desain),
   - Ingin melakukan penjadwalan kunjungan teknisi untuk servis,
   - Atau jika Anda tidak tahu jawabannya dengan pasti,
   Maka Anda HARUS menyarankan mereka untuk langsung menghubungi tim teknisi kami via WhatsApp. Berikan link WhatsApp yang jelas dan menarik dalam format Markdown, misalnya: "Silakan hubungi teknisi kami langsung via [WhatsApp (0851-7542-0692)](https://wa.me/6285175420692) untuk mendapatkan bantuan lebih lanjut/jadwal servis."
3. Selalu pastikan format tautan Markdown ditulis dengan benar: [Teks Link](https://wa.me/6285175420692).`;

  // Fallback responses if GEMINI_API_KEY environment variable is not configured
  const fallbackResponses = [
    {
      keywords: ["harga", "biaya", "price", "ongkos", "berapa", "tarif"],
      reply: "Untuk informasi estimasi biaya servis atau harga spare part kustom secara spesifik, silakan langsung hubungi teknisi kami via [WhatsApp (0851-7542-0692)](https://wa.me/6285175420692) agar kami bisa hitung sesuai kebutuhan mesin Anda."
    },
    {
      keywords: ["alamat", "lokasi", "dimana", "bengkel", "workshop", "kantor", "toko"],
      reply: "Workshop ODYSCARE berlokasi di Jakarta, Indonesia. Kami buka Senin s.d Sabtu pukul 08.00-18.00 WIB. Hubungi kami lewat [WhatsApp](https://wa.me/6285175420692) untuk detail petunjuk arah."
    },
    {
      keywords: ["servis", "service", "rusak", "mati", "error", "kendala", "bantu", "perbaikan", "bocor", "tidak panas"],
      reply: "Kami melayani servis, pembersihan (cleaning), descaling, hingga perbaikan kendala kelistrikan/aliran air mesin kopi Anda. Konsultasikan kendala mesin Anda via [WhatsApp (0851-7542-0692)](https://wa.me/6285175420692) agar bisa segera didiagnosa oleh teknisi kami."
    },
    {
      keywords: ["spare part", "suku cadang", "custom", "kustom", "part", "portafilter", "basket", "seal"],
      reply: "ODYSCARE memiliki keahlian khusus dalam memodifikasi atau memproduksi spare part kustom presisi untuk mesin kopi yang sulit dicari. Silakan diskusikan kebutuhan part Anda via [WhatsApp](https://wa.me/6285175420692)."
    },
    {
      keywords: ["kelas", "pelatihan", "training", "belajar", "kursus", "edukasi"],
      reply: "Kami menyediakan kelas pelatihan teknisi mesin kopi profesional. Ingin mengetahui info program pelatihan terdekat? Silakan tanyakan tim admin kami melalui [WhatsApp](https://wa.me/6285175420692)."
    }
  ];

  const getFallbackReply = (msg) => {
    const msgLower = msg.toLowerCase();
    for (const item of fallbackResponses) {
      if (item.keywords.some(kw => msgLower.includes(kw))) {
        return item.reply;
      }
    }
    return "Halo! Ada yang bisa kami bantu mengenai servis, perawatan, atau spare part kustom mesin kopi Anda? Jika ada kendala spesifik, silakan langsung hubungi teknisi kami via [WhatsApp (0851-7542-0692)](https://wa.me/6285175420692).";
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured on Vercel. Falling back to local rules-based reply.");
    const reply = getFallbackReply(message);
    return res.status(200).json({ reply });
  }

  try {
    // Format Gemini contents payload
    // history is expected to be an array of { role: "user"|"model", message: string }
    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach(item => {
        if (item.role && item.message) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.message }]
          });
        }
      });
    }

    // Append the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 350
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const replyText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error("Empty response from Gemini API");
    }

    return res.status(200).json({ reply: replyText.trim() });

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    // Graceful degradation instead of returning 500 error page
    const fallbackReply = getFallbackReply(message);
    return res.status(200).json({ reply: fallbackReply, error: error.message });
  }
};
