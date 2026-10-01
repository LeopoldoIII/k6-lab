# k6 Performance Testing Framework

## Overview
This repository contains a highly reusable, modular Performance Testing Framework built with [k6](https://k6.io/). It is designed using a layered architecture to separate test configuration, test data, API logic, and test execution. This allows any team member to run and customize tests without modifying the core codebase.

## 🏗️ Architecture

```text
k6-lab/
├── .vscode/               # IDE configuration for autocomplete and typing
├── config/                # Global configurations, environments, and test options
│   ├── environments.js    # URLs, tokens, and environment-specific variables
│   ├── load-test.js       # k6 options for Load Testing (VUs, durations)
│   └── stress-test.js     # k6 options for Stress Testing
├── data/                  # Static test data (JSON, CSV payloads)
├── src/                   # Reusable Core Logic
│   ├── api/               # API Clients separated by domain/service
│   └── utils/             # Helper functions and custom metrics
├── scripts/               # Entry point test scenarios
├── reports/               # HTML/JSON report output directory
├── docker-compose.yml     # Docker orchestration for InfluxDB + Grafana + k6
└── package.json           # Local dependencies (k6 typings, linters)
```

## 🔄 Reusability: How to use this framework
The main goal of this architecture is **Plug & Play** reusability:
- **Change Environments:** Edit `config/environments.js` to point to a different environment (e.g., from `dev` to `qa`).
- **Change Test Intensity:** Edit the k6 options in `config/load-test.js` or `config/stress-test.js` to adjust Virtual Users (VUs) and duration.
- **Change Test Data:** Replace or edit files in the `/data` directory to update payloads without touching the actual k6 scripts.

## 🎥 Recording Test Scripts
Just like JMeter, you can record your browser or API sessions and convert them into k6 scripts. 

> **Best Practice:** Always use the generated scripts as a draft. You should refactor the recorded endpoints and payloads into our `/src/api` and `/data` layers to keep the code clean and maintainable.

**Method 1: Using the Browser Recorder Extension (Recommended for UI flows)**
1. Install the official [k6 Browser Recorder](https://k6.io/docs/test-authoring/recording-a-session/browser-recorder/) for Chrome or Firefox.
2. Start the recording, navigate through your user flow, and stop the recording.
3. The extension will automatically generate a k6 JavaScript file for you.

**Method 2: Using HAR Converter (Recommended for API traffic)**
1. Open your browser's Developer Tools (Network tab) or use a tool like Postman.
2. Perform your actions and export the traffic as a `.har` file (Right-click -> Save all as HAR).
3. Use the k6 HAR converter in your terminal:
   ```bash
   k6 convert session.har > generated_script.js
   ```

## ⚙️ Local Machine Setup

### Prerequisites
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Required to run the Observability stack (Grafana + InfluxDB).
2. **[Node.js](https://nodejs.org/)**: Required for local IDE typings and autocompletion.
3. *(Optional but recommended)* **[k6 CLI](https://k6.io/docs/get-started/installation/)**: For running scripts locally without Docker.
   - Mac (Homebrew): `brew install k6`
   - Windows: `winget install k6`

### Initialization
1. Clone this repository.
2. Run `npm install` to install local dependencies (like `@types/k6` for VSCode IntelliSense).

### Running Tests

For convenience, this project includes predefined scripts in `package.json` so you don't have to memorize long commands.

**1. Local Execution (Terminal Summary)**
If you just want a quick terminal output without external tools:
```bash
npm run test:local
# Under the hood: k6 run scripts/login-flow.js
```

**2. Real-time Observability Execution (Docker + Grafana + InfluxDB)**
To run the test and stream real-time metrics to Grafana:
1. Start the observability stack (Grafana, InfluxDB, and the Mock API):
   ```bash
   npm run observability:up
   # Under the hood: docker-compose up -d
   ```
2. Open your browser at `http://localhost:3000` to view the Grafana Dashboard.
3. Run the k6 test sending data to InfluxDB against the mock environment:
   ```bash
   npm run test:mock
   # Under the hood: k6 run --out influxdb=http://localhost:8086/k6 scripts/login-flow.js -e ENV=mock
   ```
4. Once you are done testing, tear down the stack to free up resources:
   ```bash
   npm run observability:down
   ```

## 🧪 Testing against a Local Mock API
It is highly recommended to test your framework locally before targeting real environments. This repository's `docker-compose.yml` can optionally include a basic CRUD API container (e.g., using `json-server` or `httpbin`). 

If you spin up a mock API service alongside k6:
1. The containers will share the same internal Docker network.
2. To point your test scripts to this local mock API, you simply edit `config/environments.js`.
   - If running k6 from your host terminal: Set the `BASE_URL` to `http://localhost:<PORT>`
   - If running k6 inside Docker: Set the `BASE_URL` to `http://<service-name>:<PORT>` (e.g., `http://api-mock:3000`)

This design allows you to validate your scripts, payloads, and assertions instantly without sending junk data to your real QA or Production environments. You can achieve this purely by swapping the URL in the configuration layer!

---
*Note: This framework intentionally avoids heavy BDD wrappers (like Cucumber) to maximize performance. We rely instead on native k6 `group` and `check` features, optionally supplemented by `k6chaijs` for cleaner BDD-style assertions.*
