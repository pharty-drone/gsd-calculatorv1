import { getToken } from './token';

// Always resolve the API base from the environment.  In development you should
// set VITE_API_URL in .env.development to http://localhost:5000/api.  In production
// you can leave VITE_API_URL undefined or set it to your API host; if undefined,
// apiBase will be an empty string and calls will go to the same origin.
const apiBase = import.meta.env.VITE_API_URL || '';

/**
 * Perform a GSD calculation request.  Accepts a params object and returns
 * the parsed JSON response.  If an API token is set in localStorage it will
 * be sent as the x-api-token header.
 *
 * The backend exposes this endpoint as a GET at `${baseUrl}/api/gsd`.  If your
 * apiBase already ends with `/api`, we append `gsd`; otherwise we prefix it
 * with `/api/gsd`.
 *
 * @param {Object} params Query parameters such as sensorWidth, imageWidth, etc.
 * @returns {Promise<Object>} Parsed JSON response from the server.
 */
export async function calcGsd(params) {
  const query = new URLSearchParams(params).toString();
  const headers = {};
  const token = getToken();
  if (token) {
    headers['x-api-token'] = token;
  }
  // Determine the correct API path.  If apiBase already ends with `/api`,
  // append the `gsd` route directly; otherwise, prefix it with `/api/gsd`.
  const baseUrl = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
  const res = await fetch(`${baseUrl}/gsd?${query}`, { headers });
  if (res.status === 401) {
    throw new Error('Unauthorized: missing or invalid API token');
  }
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

// Backwards compatibility: still export fetchGSD for existing imports.
export const fetchGSD = calcGsd;
