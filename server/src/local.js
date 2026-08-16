import 'dotenv/config';
import app from './app.js';

// ── Startup validation ────────────────────────────────────────────────────────
const REQUIRED = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missing = REQUIRED.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('\n❌  Missing required environment variables:\n');
  missing.forEach((k) => console.error(`   • ${k}`));
  console.error('\nCreate server/.env by copying server/.env.example and filling in the values.\n');
  process.exit(1);
}

// ── Optional var warnings (don't block startup) ───────────────────────────────
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Razorpay keys not set — payment routes will error until you add them to server/.env');
}
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set — agent route will error until you add it to server/.env');
}

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅  API running → http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});
