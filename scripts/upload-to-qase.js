import fs from 'fs';
import fetch from 'node-fetch';

const QASE_TOKEN = process.env.QASE_API_TOKEN;
const PROJECT_CODE = 'LAD'; // project kamu
const RUN_NAME = 'Playwright Automation Run';

async function createTestRun() {
  const res = await fetch(
    `https://api.qase.io/v1/run/${PROJECT_CODE}`,
    {
      method: 'POST',
      headers: {
        'Token': QASE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: RUN_NAME,
      }),
    }
  );

  const data = await res.json();
  return data.result.id;
}

async function uploadResults(runId) {
  const results = JSON.parse(
    fs.readFileSync('test-results/results.json', 'utf8')
  );

  // contoh minimal mapping
  console.log('Results ready for mapping:', results.suites.length);
}

(async () => {
  const runId = await createTestRun();
  console.log('Created test run:', runId);
  await uploadResults(runId);
})();
