import { getToken } from './token';

const apiBase =
  import.meta.env.PROD && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : '';

export async function fetchGSD(params) {
  const query = new URLSearchParams(params).toString();
  const headers = {};
  const token = getToken();
  if (token) {
    headers['x-api-token'] = token;
  }
  const res = await fetch(`${apiBase}/api/gsd?${query}`, { headers });
  if (res.status === 401) {
    throw new Error('Unauthorized: missing or invalid API token');
  }
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}
