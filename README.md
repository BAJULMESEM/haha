# Lecture Archive — Folder Input

Versi ini **tidak membutuhkan kamu mengisi JSON secara manual**.

Kamu cukup membuat folder maddah seperti:

```text
MADDAH/
├── FIKIH/
│   ├── Murabahah.link
│   ├── Tauliyah.link
│   └── Wadhi'ah.link
├── TAUHID/
│   ├── Sifat Wajib Allah.link
│   └── Rukun Iman.link
├── NAHWU/
└── MANTIQ/
```

Setiap file `.link` cukup berisi **dua baris**:

```text
01,08,2006
googledrive.com/s/xxxxxxxx
```

Atau:

```text
25,09,2026
https://drive.google.com/file/d/xxxxxxxx/view
```

Tanggal dibaca sebagai:

```text
DD,MM,YYYY
```

Nama file menjadi **nama materi**.

Contoh:

```text
MADDAH/FIKIH/Murabahah.link
```

isinya:

```text
25,09,2026
https://drive.google.com/...
```

Maka website otomatis membaca:

```text
MADDAH : FIKIH
MATERI : Murabahah
TANGGAL: 25 September 2026
LINK   : Google Drive
```

## Cara update

### Windows

Setelah menambah/mengubah file di folder `MADDAH`, jalankan:

```text
build.bat
```

Script akan membaca seluruh folder dan membuat `generated/data.js` otomatis.

### GitHub

Project ini juga mempunyai GitHub Actions. Ketika kamu push perubahan, workflow akan:

1. membaca folder `MADDAH`,
2. menjalankan `build.py`,
3. membuat data website,
4. deploy ke GitHub Pages.

Jadi kamu cukup fokus mengedit folder `MADDAH`.

## Mode 1 — Per Maddah

Setiap folder maddah menjadi satu baris:

```text
FIKIH    [01 Murabahah] [02 Tauliyah] [03 Wadhi'ah] [04 ...] → → →
TAUHID   [01 Aqaid]     [02 Rukun Iman] ...
NAHWU    [01 Mubtada']  [02 Khabar] ...
```

Link bisa terus bertambah ke kanan.

## Mode 2 — Per Tanggal

Satu tanggal memiliki maksimal 4 slot:

```text
JUMAT, 25 SEPTEMBER 2026

[ Murabahah ]   [ Tauliyah ]   [ Nahwu ]    [ Mantiq ]
   FIKIH           FIKIH          NAHWU        MANTIQ
```

Kalau ada lebih dari 4 link di satu tanggal, website tetap membaca semuanya tetapi mode tanggal hanya menampilkan 4 dan memberikan peringatan.

## Catatan

- Extension yang didukung: `.link` dan `.txt`.
- URL boleh ditulis dengan atau tanpa `https://`.
- Baris kosong diabaikan.
- Hari (Senin/Jumat/etc.) dihitung otomatis dari tanggal.
- Jangan mengedit `generated/data.js`; file itu hasil build otomatis.


## Update paling mudah

Setelah project sudah menjadi Git repository dan terhubung ke GitHub:

```text
1. Tambahkan / ubah file .link di MADDAH
2. Jalankan update.bat
3. build.py membaca folder MADDAH
4. generated/data.js diperbarui
5. Git commit
6. Git push
7. GitHub Actions deploy ulang
```

Jadi **file `.link` tidak langsung mengubah website online saat dibuat**. Website online berubah setelah perubahan dikirim ke GitHub dengan `git push`.

Contoh:

```text
MADDAH/
└── FIKIH/
    └── Murabahah.link
```

isi:

```text
25,09,2026
https://drive.google.com/...
```

Kemudian cukup double-click:

```text
update.bat
```

### Setup Git sekali saja

```bash
git init
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git add .
git commit -m "Initial project"
git push -u origin main
```

Setelah itu, update berikutnya cukup menjalankan:

```text
update.bat
```
