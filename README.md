# QA Automation Pipeline – Playwright + Qase + GitHub Actions

Repository ini adalah proyek personal QA automation yang menunjukkan bagaimana **manual test cases**, **automated tests**, dan **CI pipeline** bisa terhubung dalam satu alur kerja yang konsisten.

Fokus utamanya bukan hanya menjalankan test Playwright, tapi **menutup loop**-nya dengan mengirimkan hasil eksekusi kembali ke alat manajemen test (Qase) — seperti yang biasa dilakukan di tim QA profesional.

---

## Why This Project Exists

Sering kali di tim, saya melihat:
- Test case hidup di tool test management (misal Qase, TestRail)
- Hasil automation hanya tersimpan di log CI
- Tidak ada hubungan jelas antara keduanya

Proyek ini adalah eksperimen (sekaligus portfolio piece) untuk mendemonstrasikan bagaimana:

- Test case di **Qase**
- Automated test di **Playwright**
- Eksekusi CI di **GitHub Actions**

bisa bekerja sebagai **satu pipeline terintegrasi**, bukan sistem terpisah.

---

## High-Level Flow
Jira User Story
↓
Qase Test Case
↓
Playwright Test (mapped via case_id)
↓
GitHub Actions (CI)
↓
Qase Test Run + Results


Setiap kali Playwright selesai menjalankan test:
- Membuat **test run baru** di Qase
- Mengupload hasil test secara otomatis
- Memperbarui status (passed / failed / skipped)

---

## Tech Stack

- **Playwright** – E2E test automation
- **Qase.io** – Test management & reporting
- **GitHub Actions** – Continuous Integration
- **Node.js** (ES Modules)
- **Qase REST API**

---
```
## Repository Structure
qa-playwright-qase/
├── tests/
│   └── login.spec.ts           # Contoh test Playwright
├── scripts/
│   └── upload-to-qase.js       # Script upload hasil ke Qase
├── test-results/
│   └── results.json            # Playwright JSON report (generated)
├── .github/
│   └── workflows/
│       └── e2e-tests.yml       # GitHub Actions pipeline
├── playwright.config.ts
├── package.json
└── README.md
```
---

## Test Case Mapping Strategy

Saat ini mapping dilakukan secara **eksplisit menggunakan Qase case_id** agar stabil dan mudah dikelola.

**Contoh di file test Playwright:**

```ts
test('User bisa login dengan kredensial valid', async ({ page }) => {
  // Tambahkan Qase case ID
  test.info().annotations.push({
    type: 'qase',
    description: '7',   // Ganti dengan case ID asli di Qase (contoh: '7' atau 'LAD-7')
  });

  // ... isi test kamu
});

```
Keunggulan pendekatan ini:

1. Tidak bergantung pada nama/judul test (lebih tahan perubahan)
2. Mudah dibaca dan di-maintain
3. Cocok untuk lingkungan CI/CD

Uploading Results to Qase
Setelah Playwright selesai menjalankan test:

1. File test-results/results.json dibaca
2. Script membuat test run baru di Qase via API
3. Hasil test di-mapping ke case_id yang sudah ada di annotation
4. Hasil di-upload secara bulk

Created test run with ID: 42
Found 4 test results with valid Qase case IDs
Uploading 4 results to run ID 42...
Upload berhasil!

GitHub Actions Workflow
Workflow dijalankan setiap push ke repository:

Install dependencies
Install Playwright browsers
Jalankan semua Playwright tests
Upload hasil ke Qase (jika test selesai)

Ini mensimulasikan bagaimana automated test biasanya dijalankan pada setiap commit di proyek nyata.

```
Environment Variables
Wajib diset:
textQASE_API_TOKEN
Disimpan sebagai GitHub Actions Secret — token tidak pernah di-commit ke repository.
```

```
Current Limitations (by Design)

Mapping masih manual via case_id
Baru ada satu contoh test
Belum ada parallel execution
Belum ada attachment (screenshot/video) ke Qase

Semua ini sengaja dibuat sederhana agar proyek tetap mudah dipahami dan fokus pada konsep integrasi.
```

```
Possible Next Improvements

Auto-mapping menggunakan tag atau custom annotation
Menambahkan lebih banyak test case & test suite
Menampilkan CI status badge di README
Mengupload screenshot/video sebagai attachment di Qase
Logic retry untuk test yang gagal
Notifikasi ke Slack/Teams jika test gagal
```
```
Author
Reza Paramarta
QA Engineer
Semua saran dan improvement sangat diterima!
```