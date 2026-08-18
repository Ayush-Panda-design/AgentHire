/** Parse comma-separated GEMINI_API_KEY values from the environment. */
export function parseGeminiApiKeys() {
  const raw = process.env.GEMINI_API_KEY || '';
  return raw.split(',').map((k) => k.trim()).filter(Boolean);
}

export function hasGeminiApiKeys() {
  return parseGeminiApiKeys().length > 0;
}

/** Keys marked exhausted for this server process (quota / invalid key). */
const exhaustedKeys = new Set();

export function getAvailableGeminiKeys() {
  return parseGeminiApiKeys().filter((k) => !exhaustedKeys.has(k));
}

export function markGeminiKeyExhausted(apiKey) {
  exhaustedKeys.add(apiKey);
}

export function maskApiKey(apiKey) {
  if (!apiKey || apiKey.length < 8) return '****';
  return `…${apiKey.slice(-4)}`;
}

/** Quota / billing errors — switch to the next API key immediately. */
export function isQuotaError(err) {
  const msg = String(err?.message || err).toLowerCase();
  return (
    msg.includes('quota')
    || msg.includes('exceeded')
    || msg.includes('billing')
    || msg.includes('api key not valid')
    || msg.includes('api_key_invalid')
    || msg.includes('permission denied')
  );
}
