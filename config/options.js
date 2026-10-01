/**
 * k6 execution options (Load Profiles)
 */

export const smokeTest = {
  vus: 1, // 1 Virtual User
  duration: '10s', // For 10 seconds
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export const loadTest = {
  stages: [
    { duration: '1m', target: 20 }, // Ramp-up to 20 users over 1 min
    { duration: '3m', target: 20 }, // Maintain 20 users for 3 mins
    { duration: '1m', target: 0 },  // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], 
    http_req_failed: ['rate<0.01'], // Less than 1% of errors allowed
  },
};
