// /api/repspark/verify-init.js
const jwt = require('jsonwebtoken');
const zlib = require('zlib');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, expectedAudience } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Missing token' });
    if (!expectedAudience) return res.status(400).json({ error: 'Missing expectedAudience' });

    // Public key from Vercel env (supports both names + \n fix)
    const publicKeyRaw =
      process.env.REPSPARK_PUBLIC_KEY ||
      process.env.RESPARK_PUBLIC_KEY || // older var name fallback
      '';

    if (!publicKeyRaw) {
      return res.status(500).json({ error: 'Missing REPSPARK_PUBLIC_KEY (or RESPARK_PUBLIC_KEY)' });
    }

    const publicKey = publicKeyRaw.replace(/\\n/g, '\n');
    const keyHash = crypto.createHash('sha256').update(publicKey).digest('hex');

    // Decode header for debugging / key-rotation awareness
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header?.kid || null;
    const alg = decoded?.header?.alg || null;
    const typ = decoded?.header?.typ || null;

    // RepSpark init tokens observed with iss = "repspark.net"
    // Keep other possibilities as fallback (won't reduce security because signature must still validate).
    const allowedIssuers = [
      'repspark.net',
      'https://app.repspark.com',
      'https://app.repspark.net',
      'https://app.dev.repspark.com',
      'https://dev.repspark.net'
    ];

    const claims = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: allowedIssuers,
      audience: expectedAudience, // e.g. https://club-coast-customizer.vercel.app
      clockTolerance: 60 // seconds
    });

    // Handle 'compressed' + 'payload'
    let payloadObj;
    if (claims.compressed === true) {
      const buf = Buffer.from(claims.payload, 'base64');
      const text = zlib.gunzipSync(buf).toString('utf8');
      try {
        payloadObj = JSON.parse(text);
      } catch {
        payloadObj = text;
      }
    } else {
      if (typeof claims.payload === 'string') {
        try {
          payloadObj = JSON.parse(claims.payload);
        } catch {
          payloadObj = claims.payload;
        }
      } else {
        payloadObj = claims.payload;
      }
    }

    return res.status(200).json({
      payload: payloadObj,
      claims: {
        exp: claims.exp,
        iat: claims.iat,
        nbf: claims.nbf,
        iss: claims.iss,
        aud: claims.aud,
        compressed: !!claims.compressed
      },
      debug: {
        kid,
        alg,
        typ,
        keyHash
      }
    });
  } catch (err) {
    // Return actionable debug info (safe) so we can see *why* verification failed.
    // NOTE: remove/trim debug in final production if desired.
    let kid = null;
    let alg = null;
    let typ = null;

    try {
      const decoded = jwt.decode((req.body || {}).token, { complete: true });
      kid = decoded?.header?.kid || null;
      alg = decoded?.header?.alg || null;
      typ = decoded?.header?.typ || null;
    } catch {}

    const publicKeyRaw =
      process.env.REPSPARK_PUBLIC_KEY ||
      process.env.RESPARK_PUBLIC_KEY ||
      '';
    const publicKey = publicKeyRaw ? publicKeyRaw.replace(/\\n/g, '\n') : '';
    const keyHash = publicKey
      ? crypto.createHash('sha256').update(publicKey).digest('hex')
      : null;

    console.error('verify-init error:', err);

    return res.status(400).json({
      error: 'Invalid token',
      reason: err?.name || 'unknown',
      message: err?.message || String(err),
      debug: {
        kid,
        alg,
        typ,
        keyHash
      }
    });
  }
};
