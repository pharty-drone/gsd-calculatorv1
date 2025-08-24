export async function fetchGSD(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/gsd?${query}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}
