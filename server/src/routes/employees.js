import { Router } from 'express';
import AIEmployee from '../models/AIEmployee.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { connectDB } from '../config/db.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/employees
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req, res) => {
  try {
    await connectDB();
    
    const { domain, q } = req.query;
    const query = {};

    if (domain) {
      query.domain = domain;
    }

    if (q) {
      query.$text = { $search: q };
    }

    let employees;
    if (q) {
      // Sort by text score if searching
      employees = await AIEmployee.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      // Otherwise sort by trust score descending
      employees = await AIEmployee.find(query).sort({ trustScore: -1 });
    }

    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/employees/:id
// ---------------------------------------------------------------------------
router.get('/:id', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const employee = await AIEmployee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    // If it's a CastError (invalid ObjectId), return 404 instead of 500
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
