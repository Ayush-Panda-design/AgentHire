import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Hire from '../models/Hire.js';
import AIEmployee from '../models/AIEmployee.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { connectDB } from '../config/db.js';

const router = Router();

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// POST /api/payments/create-order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const { employeeId, taskDescription, hours } = req.body;

    if (!employeeId || !taskDescription || !hours || Number(hours) <= 0) {
      return res.status(400).json({ error: 'employeeId, taskDescription, and hours are required' });
    }

    const employee = await AIEmployee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const amount = Math.round(employee.hourlyRate * Number(hours) * 100);

    const hire = await Hire.create({
      buyer: req.user.id,
      employee: employee._id,
      taskDescription,
      amount,
      status: 'created',
    });

    // DEV MODE fallback — if Razorpay keys missing or call fails, skip real payment
    const hasRazorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
    if (!hasRazorpay) {
      const mockOrderId = `order_dev_${hire._id}`;
      hire.razorpayOrderId = mockOrderId;
      await hire.save();
      return res.status(201).json({
        orderId: mockOrderId,
        amount,
        keyId: 'DEV_MODE',
        hireId: hire._id,
        devMode: true,
      });
    }

    try {
      const razorpay = getRazorpayClient();
      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `hire_${hire._id}`,
        notes: { hireId: hire._id.toString(), employeeId: employee._id.toString() },
      });
      hire.razorpayOrderId = order.id;
      await hire.save();
      return res.status(201).json({
        orderId: order.id,
        amount,
        keyId: process.env.RAZORPAY_KEY_ID,
        hireId: hire._id,
      });
    } catch (rzpErr) {
      // Razorpay failed (bad keys, unactivated account) — fall back to dev mode
      console.warn('Razorpay unavailable, falling back to dev mode:', rzpErr?.error?.description || rzpErr.message);
      const mockOrderId = `order_dev_${hire._id}`;
      hire.razorpayOrderId = mockOrderId;
      await hire.save();
      return res.status(201).json({
        orderId: mockOrderId,
        amount,
        keyId: 'DEV_MODE',
        hireId: hire._id,
        devMode: true,
      });
    }
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/payments/verify
router.post('/verify', requireAuth, async (req, res) => {
  try {
    await connectDB();
    const { hireId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!hireId || !razorpay_order_id) {
      return res.status(400).json({ error: 'Missing verification fields' });
    }

    const hire = await Hire.findById(hireId);
    if (!hire) {
      return res.status(404).json({ error: 'Hire not found' });
    }
    if (hire.buyer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not your hire' });
    }
    if (hire.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ error: 'Order ID mismatch' });
    }

    // DEV MODE: mock order IDs skip the HMAC check
    const isDevOrder = razorpay_order_id.startsWith('order_dev_');
    if (!isDevOrder) {
      if (!razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment verification fields' });
      }
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        hire.status = 'failed';
        await hire.save();
        return res.status(400).json({ error: 'Invalid payment signature' });
      }
    }

    hire.status = 'paid';
    hire.razorpayPaymentId = razorpay_payment_id || `dev_pay_${Date.now()}`;
    hire.cliToken = crypto.randomBytes(24).toString('hex');
    hire.cliTokenUsed = false;
    await hire.save();

    res.json({ hireId: hire._id, cliToken: hire.cliToken });
  } catch (err) {
    console.error('verify error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router;