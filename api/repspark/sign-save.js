// /api/repspark/sign-save.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { payload } = req.body || {};
    if (!payload) return res.status(400).json({ error: 'Missing payload' });

    const json = JSON.stringify(payload);

    const nowSec = Math.floor(Date.now() / 1000);

    const issuer = (process.env.REPSPARK_ISSUER || '').trim(); // https://club-coast-customizer.vercel.app
    if (!issuer) return res.status(500).json({ error: 'Missing REPSPARK_ISSUER' });

    const privateKeyRaw = (process.env.REPSPARK_PRIVATE_KEY || '').trim();
    if (!privateKeyRaw) return res.status(500).json({ error: 'Missing REPSPARK_PRIVATE_KEY' });
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    // IMPORTANT: make aud configurable and default to what RepSpark expects (per your note)
    const audience = (process.env.REPSPARK_AUDIENCE || 'repspark.net').trim();

    const token = jwt.sign(
      {
        payload: json,
        compressed: false,
        iat: nowSec,
        exp: nowSec + 5 * 60,
        iss: issuer,
        aud: audience
      },
      privateKey,
      { algorithm: 'RS256' }
    );

    return res.status(200).json({ jwt: token });
  } catch (err) {
    console.error('Signer error:', err);
    return res.status(500).json({ error: 'Signing failed' });
  }
};
