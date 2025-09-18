// /api/repspark/sign-save.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { payload, targetAudience } = req.body || {};
    if (!payload) {
      res.status(400).json({ error: 'Missing payload' });
      return;
    }

    // Whitelist the hosts that are allowed to embed you
    const allowedAudiences = new Set([
      'https://app.repspark.com',
      'https://app.repspark.net',
      'https://dev.repspark.net',
      'http://localhost:37803'
    ]);

    // Use the parent origin the iframe is running on, falling back to app.repspark.com
    const aud = allowedAudiences.has(targetAudience)
      ? targetAudience
      : 'https://app.repspark.com';

    // Vercel env vars sometimes store "\n"; this makes it robust either way
    const privateKey = (process.env.REPSPARK_PRIVATE_KEY || '').includes('\\n')
      ? process.env.REPSPARK_PRIVATE_KEY.replace(/\\n/g, '\n')
      : process.env.REPSPARK_PRIVATE_KEY;

    // RepSpark expects RS256 with your issuer and their (parent) audience
    const token = jwt.sign(
      {
        // Keep business data inside "payload" as a STRING per their spec
        payload: typeof payload === 'string' ? payload : JSON.stringify(payload)
      },
      privateKey,
      {
        algorithm: 'RS256',
        issuer: process.env.REPSPARK_ISSUER, // e.g. https://club-coast-customizer.vercel.app
        audience: aud,                        // dynamic: parent origin
        expiresIn: '5m'
      }
    );

    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error('Signer error:', err);
    res.status(500).json({ error: 'Signing failed' });
  }
};
