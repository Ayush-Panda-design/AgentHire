import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Hire from '../models/Hire.js';
import AIEmployee from '../models/AIEmployee.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { connectDB } from '../config/db.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/hires
// Lists all hires for the authenticated user, newest first.
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const hires = await Hire.find({ buyer: req.user.id })
      .populate('employee', 'name roleTitle skills hourlyRate trustScore illustrationKey')
      .sort({ createdAt: -1 });
    res.json(hires);
  } catch (err) {
    console.error('list hires error:', err);
    res.status(500).json({ error: 'Failed to list hires' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/hires/activate
// body: { cliToken }
// Called by `agenthire connect --token <cliToken>`. Issues a short-lived CLI
// session JWT. The same token can be reused to reconnect after closing the CLI.
// ---------------------------------------------------------------------------
router.post('/activate', async (req, res) => {
  try {
    await connectDB();
    const { cliToken } = req.body;

    if (!cliToken) {
      return res.status(400).json({ error: 'cliToken is required' });
    }

    const hire = await Hire.findOne({ cliToken, status: 'paid' });
    if (!hire) {
      return res.status(401).json({
        error: 'Invalid or unpaid token',
        hint: 'Check the token from My Agents on the website, or complete payment first.',
      });
    }

    const employee = await AIEmployee.findById(hire.employee);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found for this hire' });
    }

    if (!hire.cliTokenUsed) {
      hire.cliTokenUsed = true;
      await hire.save();
    }

    const sessionToken = jwt.sign(
      { sub: hire.buyer.toString(), hireId: hire._id.toString(), type: 'cli-session' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      token: sessionToken,
      hireId: hire._id,
      employee: { id: employee._id, name: employee.name, roleTitle: employee.roleTitle },
    });
  } catch (err) {
    console.error('activate error:', err);
    res.status(500).json({ error: 'Failed to activate CLI session' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/hires/:id
// Browser-cookie auth. Used by the /app/hires/:id activity feed page.
// ---------------------------------------------------------------------------
router.get('/:id', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const hire = await Hire.findById(req.params.id).populate('employee', 'name roleTitle');
    if (!hire) {
      return res.status(404).json({ error: 'Hire not found' });
    }
    if (hire.buyer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your hire' });
    }
    res.json(hire);
  } catch (err) {
    console.error('get hire error:', err);
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Hire not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
