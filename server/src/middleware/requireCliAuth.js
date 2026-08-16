import jwt from 'jsonwebtoken';
import Hire from '../models/Hire.js';
import { connectDB } from '../config/db.js';

/**
 * Auth for the CLI's own session — a short-lived JWT issued by
 * POST /api/hires/activate (see routes/hires.js), sent as
 * `Authorization: Bearer <token>` by the CLI. This is separate from the
 * browser's httpOnly cookie auth used by requireAuth.js.
 *
 * On success, attaches:
 *   req.user  = { id: <buyer user id> }
 *   req.hire  = <Hire mongoose document>
 */
export async function requireCliAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing CLI session token' });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.type !== 'cli-session' || !payload.hireId) {
      return res.status(401).json({ error: 'Invalid CLI session token' });
    }

    await connectDB();
    const hire = await Hire.findById(payload.hireId);
    if (!hire || hire.status !== 'paid') {
      return res.status(401).json({ error: 'Hire session is not active' });
    }

    req.user = { id: payload.sub };
    req.hire = hire;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired CLI session token' });
  }
}
