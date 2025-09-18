// /api/repspark/sign-save.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { payload } = req.body || {};
    if (!payload) return res.status(400).json({ error: 'Missing payload' });

    const payloadClaim = JSON.stringify(payload);
    const nowSec = Math.floor(Date.now() / 1000);

    const token = jwt.sign(
      {
        payload: payloadClaim,
        iat: nowSec,
        exp: nowSec + 5 * 60,
        iss: process.env.REPSPARK_ISSUER,                           // your app origin
        aud: process.env.REPSPARK_AUDIENCE || 'repspark.net'        // 👈 ALWAYS repspark.net
      },
      process.env.REPSPARK_PRIVATE_KEY,
      { algorithm: 'RS256' }
    );

    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error('Signer error:', err);
    res.status(500).json({ error: 'Signing failed' });
  }
};
