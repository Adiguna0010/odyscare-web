# ☕ ODYSCARE Website

Website profesional untuk ODYSCARE - startup bidang perkopian yang fokus pada produksi spare part dan maintenance mesin kopi.

## 🚀 Cara Menjalankan Website

### Opsi 1: Buka Langsung di Browser
1. Buka folder project ini
2. Klik dua kali file `index.html`
3. Website akan terbuka di browser default Anda

### Opsi 2: Menggunakan Live Server (VS Code)
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan file `index.html`
3. Pilih **"Open with Live Server"**
4. Website akan berjalan di `http://localhost:5500`

### Opsi 3: Menggunakan Python HTTP Server
```bash
# Jika punya Python 3
python -m http.server 8000

# Buka browser ke http://localhost:8000
```

## 📁 Struktur File

```
odyscare-web/
├── index.html              # Landing page (halaman utama)
├── company-profile.html    # Profil perusahaan & sejarah
├── gallery.html            # Galeri mesin kopi yang di-maintenance
├── sekolah-online.html     # SekolahOnline / Lab Imajinasi Teknologi
├── maintenance.html        # Form maintenance & konsultasi
├── partners.html           # Mitra & partner perusahaan
├── social.html             # Kontak & social media hub
├── css/
│   ├── styles.css          # Stylesheet utama
│   └── animations.css      # Animasi & keyframes
├── js/
│   ├── main.js             # Interaktivitas utama
│   └── animations.js       # Animasi lanjutan
└── assets/
    └── images/             # Folder gambar
```

## ✨ Fitur Website

| Fitur | Keterangan |
|-------|-----------|
| 🎬 Animasi Unik | Loading screen coffee cup, particle effect, text scramble |
| 🗺️ Peta Distribusi | SVG animated map jaringan mesin kopi di Indonesia |
| 🖼️ Galeri | Filterable gallery dengan lightbox modal |
| 🎓 SekolahOnline | Tab lab teknologi (IoT, AI/ML, Arduino, Cloud) |
| 📋 Company Profile | Visi, misi, tim, dan timeline perusahaan |
| 🔧 Maintenance Form | Form dengan validasi dan paket layanan |
| 💬 Live Chat | Widget chat untuk konsultasi |
| 🤝 Partners | Showcase mitra dengan testimonial |
| 📱 Social Hub | Direct link ke WhatsApp & Instagram |
| 🍪 Cookie Consent | GDPR-compliant banner |
| 📱 Responsive | Mobile-first design |

## 🌐 Cara Push ke GitHub

### Opsi A: Menggunakan GitHub Desktop (Paling Mudah)
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Login dengan akun GitHub Anda
3. Klik **File > Add local repository**
4. Pilih folder `odyscare-web`
5. Klik **Publish repository**
6. Beri nama repository: `odyscare-web`
7. Centang **"Keep this code private"** jika ingin private
8. Klik **Publish repository**

### Opsi B: Menggunakan Command Line
1. Buka terminal di folder ini
2. Pastikan sudah commit:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```
3. Login GitHub CLI:
   ```bash
   gh auth login
   ```
   - Pilih **HTTPS**
   - Pilih **Login with a web browser**
   - Copy kode dan buka browser untuk autentikasi
4. Buat repository baru:
   ```bash
   gh repo create odyscare-web --public --source=. --push
   ```
   (Ganti `--public` dengan `--private` jika ingin private)

### Opsi C: Manual via Browser
1. Buka [github.com/new](https://github.com/new)
2. Isi **Repository name**: `odyscare-web`
3. Jangan centang "Initialize this repository with a README"
4. Klik **Create repository**
5. Copy perintah dari halaman tersebut:
   ```bash
   git remote add origin https://github.com/USERNAME/odyscare-web.git
   git branch -M main
   git push -u origin main
   ```

## 🎨 Tema Warna

- **Primary Dark**: #2C1810 (Dark Coffee)
- **Primary Medium**: #5D4037 (Medium Roast)
- **Accent Gold**: #C9A227 (Premium Gold)
- **Cream**: #F5F0E8 (Milk Foam)
- **Background**: #1A1A1A (Dark Mode)

## 📞 Kontak

- **WhatsApp**: +62 812-3456-7890
- **Instagram**: @odyscare
- **Email**: info@odyscare.id

---
© 2024 ODYSCARE. All rights reserved.
