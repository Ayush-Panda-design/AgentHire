import jwt from 'jsonwebtoken';

/**
 * Reads the `ah_access` cookie, verifies the JWT, and attaches `req.user`.
 * Returns 401 if the cookie is missing or invalid.
 */
export function requireAuth(req, res, next) {
  const token = req.cookies?.ah_access;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
