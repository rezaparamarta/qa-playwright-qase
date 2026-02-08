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
  const statusMap = {
    passed: 'passed',
    failed: 'failed',
    skipped: 'skipped',
    timedOut: 'failed',
    interrupted: 'failed',
  };
  return statusMap[status] || 'skipped';
}

async function uploadResults(runId) {
  const raw = fs.readFileSync('test-results/results.json', 'utf8');
  const results = JSON.parse(raw);

  const qaseResults = [];

  // 🔥 MANUAL case_id (sementara)
  const CASE_ID = 7; // ⬅️ ganti sesuai case ID di Qase

  for (const suite of results.suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        for (const result of test.results || []) {
          qaseResults.push({
            case_id: CASE_ID,
            status: mapPlaywrightStatusToQase(result.status), // ✅ STRING
            time_ms: result.duration || 0,
          });
        }
      }
    }
  }

  if (qaseResults.length === 0) {
    console.log('Tidak ada result untuk diupload');
    return;
  }

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
