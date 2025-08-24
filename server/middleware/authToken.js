export function authToken(req, res, next) {
  const headerToken = req.header('x-api-token');
  const authHeader = req.header('authorization');
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;
  const token = headerToken || bearerToken;
  const expected = process.env.API_TOKEN;

  if (process.env.NODE_ENV !== 'production') {
    if (!token) {
      console.warn('Request without API token');
    } else if (expected && token !== expected) {
      console.warn('Request with invalid API token');
    }
    return next();
  }

  if (!token || !expected || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
