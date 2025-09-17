// /api/repspark/verify-init.js
const jwt = require('jsonwebtoken');
const zlib = require('zlib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { token, expectedAudience } = req.body || {};
    if (!token) { res.status(400).json({ error: 'Missing token' }); return; }

    // Verify RS256 signature & claims from RepSpark
    const claims = jwt.verify(token, process.env.REPSPARK_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: 'https://app.repspark.com',
      audience: expectedAudience,   // e.g., https://club-coast-customizer.vercel.app
      clockTolerance: 0
    });

    // Handle 'compressed' + 'payload' claims per spec
    let payloadObj;
    if (claims.compressed === true) {
      const buf = Buffer.from(claims.payload, 'base64');
      const json = zlib.gunzipSync(buf).toString('utf8');
      payloadObj = JSON.parse(json);
    } else {
      payloadObj = typeof claims.payload === 'string' ? JSON.parse(claims.payload) : claims.payload;
    }

    res.status(200).json({
      payload: payloadObj,
      claims: { exp: claims.exp, iat: claims.iat, iss: claims.iss, aud: claims.aud, compressed: !!claims.compressed }
    });
  } catch (err) {
    console.error('verify-init error:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
