# QA Automation Pipeline – Playwright + Qase + GitHub Actions

This repository is a personal QA automation project that demonstrates how **manual test cases, automated tests, and CI pipelines** can be connected into one consistent workflow.

The main focus is not just running Playwright tests, but **closing the loop** by reporting execution results back to a test management tool (Qase), the same way it’s done in real QA teams.

---

## Why I Built This

In many teams, I often see:
- Test cases living in test management tools
- Automation results living only in CI logs
- No clear connection between both

This project is an experiment (and portfolio piece) to show how:
- Test cases in Qase
- Automated tests in Playwright
- CI execution in GitHub Actions  

can work together as **one pipeline**, not separate systems.

---

## High-Level Flow

Jira User Story
↓
Qase Test Case
↓
Playwright Test (mapped to case_id)
↓
GitHub Actions (CI)
↓
Qase Test Run + Results


Each Playwright execution:
- Creates a new test run in Qase
- Uploads test results automatically
- Updates execution status (passed / failed)

---

## Tech Stack

- Playwright (E2E automation)
- Qase.io (test management)
- GitHub Actions (CI)
- Node.js (ES Modules)
- Qase REST API

---

## Repository Structure

qa-playwright-qase/
├── tests/
│ └── login.spec.ts # Playwright test
│
├── scripts/
│ └── upload-to-qase.js # Qase API integration
│
├── test-results/
│ └── results.json # Playwright JSON report
│
├── .github/workflows/
│ └── e2e-tests.yml # CI pipeline
│
├── playwright.config.ts
├── package.json
└── README.md


---

## Test Case Mapping Strategy

For now, mapping is done **explicitly using Qase case_id** to keep it simple and stable.

Example inside Playwright test:

```ts
test.info().annotations.push({
  type: 'qase',
  description: '7', // Qase case_id
});
This avoids fragile mapping based on test titles and works well in CI.

Uploading Results to Qase
After Playwright finishes:

CI reads test-results/results.json

A new Qase test run is created via API

Results are uploaded in bulk using case_id

Example log from CI:

Created test run ID: 4
Upload 1 result ke run ID 4
Upload berhasil: { status: true }
GitHub Actions Workflow
On every push:

Install dependencies

Install Playwright browsers

Run Playwright tests

Upload results to Qase

This simulates how automated tests would run on every commit in a real project.

Environment Variables
Required environment variable:

QASE_API_TOKEN
Configured as a GitHub Actions secret.
Tokens are never committed to the repository.

Current Limitations (Intentional)
Mapping is still manual using case_id

Only a single test is implemented

No parallel execution yet

These are deliberate to keep the project focused and readable.

Possible Next Improvements
Auto-mapping using tags or annotations

Multiple test cases & suites

CI badge in README

Screenshot/video attachments in Qase

Failed test rerun logic

Author
Reza Paramarta
QA Engineer