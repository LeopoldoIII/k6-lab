import http from 'k6/http';
import { ENV } from '../../config/environments.js';

/**
 * Simulates an authentication request
 * @param {string} username 
 * @param {string} password 
 * @returns {import("k6/http").Response}
 */
export function login(username, password) {
  // We use the /post endpoint of api-mock (httpbin) which returns what we send
  const url = `${ENV.baseUrl}/post`;
  const payload = JSON.stringify({
    username: username,
    password: password,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return http.post(url, payload, params);
}
