/**
 * Configuration for different environments
 */
const environments = {
  mock: {
    baseUrl: 'http://localhost:8000', // Points to our local httpbin container
  },
  dev: {
    baseUrl: 'https://dev.api.example.com',
  },
  qa: {
    baseUrl: 'https://qa.api.example.com',
  },
  prod: {
    baseUrl: 'https://api.example.com',
  }
};

// Retrieve environment from CLI argument `-e ENV=qa`. 
// Defaults to 'mock'.
const currentEnv = __ENV.ENV || 'mock';

export const ENV = environments[currentEnv];
