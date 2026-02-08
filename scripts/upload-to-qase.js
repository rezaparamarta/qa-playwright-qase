import fs from 'fs';

const QASE_TOKEN = process.env.QASE_API_TOKEN;
const PROJECT_CODE = 'LAD'; // ganti sesuai project code Qase kamu
const RUN_NAME =
  'Playwright Automation Run - ' +
  new Date().toISOString().split('T')[0];

async function createTestRun() {
  const res = await fetch(
    `https://api.qase.io/v1/run/${PROJECT_CODE}`,
    {
      method: 'POST',
      headers: {
        Token: QASE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: RUN_NAME,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gagal membuat test run: ${error}`);
  }

  const data = await res.json();
  return data.result.id;
}

function mapPlaywrightStatusToQase(status) {
  const map = {
    passed: 1, // passed
    failed: 2, // failed
    skipped: 3, // blocked
  };
  return map[status] || 4; // untested
}

async function uploadResults(runId) {
  const raw = fs.readFileSync('test-results/results.json', 'utf8');
  const results = JSON.parse(raw);

  /**
   * ==========================
   * STEP 4 – MANUAL MAPPING
   * ==========================
   * GANTI case_id sesuai yang ADA di Qase
   */
  const qaseResults = [
    {
      case_id: 7, // ⬅️ GANTI dengan case_id Qase kamu
      status: 1,  // 1 = passed
    },
  ];

  console.log(
    `Upload ${qaseResults.length} result ke run ID ${runId}`
  );

  const res = await fetch(
    `https://api.qase.io/v1/result/${PROJECT_CODE}/${runId}/bulk`,
    {
      method: 'POST',
      headers: {
        Token: QASE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        results: qaseResults,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gagal upload result: ${error}`);
  }

  const data = await res.json();
  console.log('Upload berhasil:', data);
}

(async () => {
  try {
    const runId = await createTestRun();
    console.log(`Created test run ID: ${runId}`);
    await uploadResults(runId);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
})();
