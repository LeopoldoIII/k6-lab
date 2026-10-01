import { check, sleep } from 'k6';
import { login } from '../src/api/auth.js';
import { smokeTest } from '../config/options.js';

// 1. Configure k6 options by importing them from our config layer
export const options = smokeTest;

// 2. Main lifecycle (The script that executes)
export default function () {
  // Make the call using our reusable API layer
  const res = login('admin', 'admin123');

  // Validate that the result was successful
  check(res, {
    'status is 200': (r) => r.status === 200,
    // Since we use httpbin as a mock, verify it echoed back the payload
    'returns expected data': (r) => r.json('json.username') === 'admin', 
  });

  // Pause to simulate user think time
  sleep(1);
}
