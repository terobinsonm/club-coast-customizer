// /api/repspark/verify-init.js
const jwt = require('jsonwebtoken');
const zlib = require('zlib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { token, expectedAudience } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Missing token' });
    if (!expectedAudience) return res.status(400).json({ error: 'Missing expectedAudience' });

    // Public key from Vercel env (supports both names + \n fix)
    const publicKeyRaw =
      process.env.REPSPARK_PUBLIC_KEY ||
      process.env.RESPARK_PUBLIC_KEY || // older var name fallback
      '';
    if (!publicKeyRaw) return res.status(500).json({ error: 'Missing REPSPARK_PUBLIC_KEY' });

    const publicKey = publicKeyRaw.replace(/\\n/g, '\n');

    // RepSpark standard issuer for init tokens
    const allowedIssuers = ['repspark.net'];

    // Verify RS256 signature & claims from RepSpark
    const claims = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: allowedIssuers,
      audience: expectedAudience,  // e.g., https://club-coast-customizer.vercel.app
      clockTolerance: 30           // small clock skew (seconds)
    });

    // Handle 'compressed' + 'payload'
    let payloadObj;
    if (claims.compressed === true) {
      // payload is base64-encoded gzip(JSON/string)
      const buf = Buffer.from(claims.payload, 'base64');
      const text = zlib.gunzipSync(buf).toString('utf8');
      try {
        payloadObj = JSON.parse(text);
      } catch {
        payloadObj = text; // could be XML/plain text
      }
    } else {
      if (typeof claims.payload === 'string') {
        try {
          payloadObj = JSON.parse(claims.payload);
        } catch {
          payloadObj = claims.payload; // keep raw string
        }
      } else {
        payloadObj = claims.payload;
      }
    }

    res.status(200).json({
      payload: payloadObj,
      claims: {
        exp: claims.exp,
        iat: claims.iat,
        iss: claims.iss,
        aud: claims.aud,
        compressed: !!claims.compressed
      }
    });
  } catch (err) {
    console.error('verify-init error:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
