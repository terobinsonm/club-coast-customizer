// /api/repspark/sign-save.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Vercel parses JSON automatically when Content-Type: application/json
    const { payload } = req.body || {};
    if (!payload) {
      res.status(400).json({ error: 'Missing payload' });
      return;
    }

    // If RepSpark needs XML inside the claim, serialize here; JSON is fine otherwise
    const payloadClaim = JSON.stringify(payload);

    const nowSec = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        payload: payloadClaim,                 // your business data
        iat: nowSec,
        exp: nowSec + 5 * 60,                  // 5 minutes
        iss: process.env.REPSPARK_ISSUER,      // e.g. "https://club-coast-customizer.vercel.app"
        aud: 'https://app.repspark.com'
      },
      process.env.REPSPARK_PRIVATE_KEY,        // PKCS#8 PEM (full BEGIN/END block)
      { algorithm: 'RS256' }
    );

    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error('Signer error:', err);
    res.status(500).json({ error: 'Signing failed' });
  }
};
