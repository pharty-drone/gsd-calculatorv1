const apiBase =
  import.meta.env.PROD && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : '';

export async function fetchGSD(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/api/gsd?${query}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}
