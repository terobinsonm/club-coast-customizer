// /api/repspark/verify-init.js
const jwt = require('jsonwebtoken');
const zlib = require('zlib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { token, expectedAudience } = req.body || {};
    if (!token) {
      res.status(400).json({ error: 'Missing token' });
      return;
    }

    // Support either env name and fix \n for Vercel-style multiline values
    const publicKeyRaw =
      process.env.REPSPARK_PUBLIC_KEY ||
      process.env.RESPARK_PUBLIC_KEY || // fallback if you used this name earlier
      '';

    const publicKey = publicKeyRaw.replace(/\\n/g, '\n');

    // Accept all RepSpark issuers you need to support
    const allowedIssuers = [
      'https://app.repspark.com',
      'https://app.repspark.net',
      'https://dev.repspark.net',
    ];

    // Verify RS256 signature & claims from RepSpark
    const claims = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: allowedIssuers,
      audience: expectedAudience,      // e.g., https://club-coast-customizer.vercel.app
      clockTolerance: 30               // allow small clock skew (seconds)
    });

    // Handle 'compressed' + 'payload' per spec
    let payloadObj;
    if (claims.compressed === true) {
      // claims.payload is base64 gzip
      const buf = Buffer.from(claims.payload, 'base64');
      const json = zlib.gunzipSync(buf).toString('utf8');

      // If it’s JSON, parse it; otherwise return as string
      try {
        payloadObj = JSON.parse(json);
      } catch {
        payloadObj = json; // could be XML or plain text
      }
    } else {
      // Uncompressed: payload may already be an object or a JSON/XML string
      if (typeof claims.payload === 'string') {
        try {
          payloadObj = JSON.parse(claims.payload);
        } catch {
          payloadObj = claims.payload; // keep raw string if not JSON
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
