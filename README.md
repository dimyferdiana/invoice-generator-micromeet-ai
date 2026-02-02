# Micromeet Invoice Generator

Aplikasi untuk membuat Purchase Order (PO), Invoice, dan Bukti Bayar untuk **Micromeet Technology (Singapore) Pte Ltd**.

## Fitur

- **Purchase Order (PO)**: Buat dan kelola Purchase Order dengan detail item, pajak, dan informasi pembayaran
- **Invoice**: Buat invoice profesional dengan referensi PO dan jatuh tempo
- **Bukti Bayar**: Buat bukti pembayaran yang lengkap dengan informasi transaksi
- **Preview & Cetak**: Preview dokumen sebelum mencetak dengan tampilan profesional
- **Simpan Dokumen**: Simpan dokumen ke local storage untuk akses di kemudian hari
- **Contoh Dokumen**: Template contoh PO yang sudah terisi

## Cara Menjalankan

### Metode 1: Buka langsung di browser

Buka file `index.html` langsung di browser web Anda.

### Metode 2: Menggunakan HTTP Server

```bash
# Menggunakan npm
npm start

# Atau dengan npx
npx http-server -p 3000 -o
```

Kemudian buka `http://localhost:3000` di browser.

## Struktur Proyek

```
invoice-generator-micromeet-ai/
├── index.html          # Halaman utama aplikasi
├── css/
│   └── styles.css      # Stylesheet aplikasi
├── js/
│   └── app.js          # JavaScript aplikasi
├── samples/
│   ├── po-nurhaini.html      # Contoh PO - Nurhaini
│   └── po-dr-niluh.html      # Contoh PO - dr Niluh Suwasanti, Sp.PK
├── package.json
└── README.md
```

## Contoh Purchase Order

### 1. PO untuk Nurhaini
- **Nomor PO**: PO-2026-001
- **Metode Pembayaran**: Bank Transfer
- **Bank**: BCA
- **No. Rekening**: 7350044544
- **File**: [samples/po-nurhaini.html](samples/po-nurhaini.html)

### 2. PO untuk dr Niluh Suwasanti, Sp.PK
- **Nomor PO**: PO-2026-002
- **Metode Pembayaran**: Bank Transfer
- **Bank**: Belum tersedia
- **File**: [samples/po-dr-niluh.html](samples/po-dr-niluh.html)

## Teknologi

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- JavaScript (ES6+)
- Local Storage untuk penyimpanan data
- Google Fonts (Inter)

## Informasi Perusahaan

**Micromeet Technology (Singapore) Pte Ltd**
- Website: [https://web.micromeet.ai/home](https://web.micromeet.ai/home)

## Screenshot

Aplikasi ini menampilkan:
- Dashboard dengan statistik dokumen
- Form pembuatan PO, Invoice, dan Bukti Bayar
- Preview dokumen dengan tampilan cetak profesional
- Daftar dokumen tersimpan dengan fitur pencarian

## Lisensi

MIT License - Micromeet Technology (Singapore) Pte Ltd
