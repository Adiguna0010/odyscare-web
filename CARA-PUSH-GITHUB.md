# 📤 Cara Push ODYSCARE ke GitHub

## Metode 1: Klik Dua Kali File .bat (PALING MUDAH)

### Langkah 1: Buka Folder Project
```
Buka File Explorer → 
D:\BASE CORE\Business\ODYHSCOFF\ODYSCARE PROJECT\odyscare-web
```

### Langkah 2: Klik Dua Kali File
```
Cari file: push-to-github.bat
└── Klik dua kali (double click)
```

### Langkah 3: Izinkan Windows (Jika Muncul)
```
Windows SmartScreen mungkin muncul:
  ┌─────────────────────────────┐
  │ Windows protected your PC   │
  │ [More info]                 │
  └─────────────────────────────┘
  
Klik "More info" → lalu klik "Run anyway"
```

### Langkah 4: Ikuti Instruksi Terminal
```
========================================
     PUSH ODYSCARE KE GITHUB
========================================

[OK] GitHub CLI ditemukan.

[STEP 1] Login ke GitHub...
[INFO] Browser akan terbuka untuk autentikasi.

(Tunggu browser terbuka...)
```

### Langkah 5: Login di Browser
```
Browser terbuka dengan halaman GitHub:
  ┌─────────────────────────────┐
  │ Enter activation code:      │
  │ XXXX-XXXX                   │
  │ [Continue]                  │
  │ [ctrl+c to copy]            │
  └─────────────────────────────┘
  
Klik "Continue" → Login akun GitHub Anda → 
Klik "Authorize GitHub CLI" → 
Kembali ke terminal
```

### Langkah 6: Tunggu Push Selesai
```
[OK] Login berhasil!

[INFO] GitHub Username: nama_anda

[STEP 2] Membuat repository 'odyscare-web'...

✓ Created repository nama_anda/odyscare-web on GitHub
✓ Added remote https://github.com/nama_anda/odyscare-web.git
✓ Pushed commits to https://github.com/nama_anda/odyscare-web

========================================
     PUSH SELESAI!
========================================

Website Anda sudah online di:
https://github.com/nama_anda/odyscare-web

(Tekan Enter untuk keluar)
```

---

## Metode 2: Run PowerShell Script

Klik kanan file **`push-to-github.ps1`** → Pilih **"Run with PowerShell"**

Ikuti instruksi yang sama seperti di atas.

---

## Metode 3: Manual via Terminal (Jika Script Error)

Buka terminal di folder project, ketik perintah satu per satu:

```bash
# Login ke GitHub
"C:\Program Files\GitHub CLI\gh.exe" auth login

# Pilih: HTTPS → Login with a web browser
# Browser akan terbuka → ikuti instruksi → kembali ke terminal

# Buat repository & push
"C:\Program Files\GitHub CLI\gh.exe" repo create odyscare-web --public --source=. --push
```

---

## 🌐 Aktifkan Website Online (GitHub Pages - GRATIS)

Setelah push berhasil:

1. Buka browser → `https://github.com/[USERNAME]/odyscare-web`
2. Klik tab **Settings** (pojok kanan atas)
3. Di sidebar kiri, klik **Pages**
4. Di bagian **Source**:
   - Pilih: **"Deploy from a branch"**
   - Branch: **main**
   - Folder: **/(root)**
   - Klik **Save**
5. Tunggu 1-2 menit
6. Akses website Anda di:
   ```
   https://[USERNAME].github.io/odyscare-web
   ```

---

## ⚠️ Catatan Penting

| Issue | Solusi |
|-------|--------|
| Windows SmartScreen block | Klik "More info" → "Run anyway" |
| GitHub CLI belum install | Script akan auto-install, restart dan jalankan ulang |
| Repository sudah ada | Script akan otomatis push ke repo yang ada |
| Login gagal | Pastikan punya akun GitHub (daftar di github.com) |
| Butuh koneksi internet | Pastikan WiFi/ethernet aktif |

---

## 📞 Butuh Bantuan?

Jika mengalami kendala, screenshot error yang muncul dan konsultasikan lebih lanjut.
