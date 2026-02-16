// /api/repspark/sign-save.js
const jwt = require('jsonwebtoken');
const zlib = require('zlib'); // only needed if you ever choose to compress

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { payload } = req.body || {};
    if (!payload) { res.status(400).json({ error: 'Missing payload' }); return; }

    // Serialize your business data to JSON
    const json = JSON.stringify(payload);

    // Not compressing right now, but RepSpark still wants the flag present.
    const compressed = false;      // <- required claim, even when false
    const payloadClaim = json;     // if you later compress, this becomes base64(gzip(json))

    // If you ever need compression later, do this instead:
    // const gz = zlib.gzipSync(Buffer.from(json, 'utf8'));
    // const payloadClaim = gz.toString('base64');
    // const compressed = true;

    const nowSec = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        payload: payloadClaim,                 // string (JSON or base64 if compressed)
        compressed,                            // REQUIRED: true/false
        iat: nowSec,
        exp: nowSec + 5 * 60,
        iss: (process.env.REPSPARK_ISSUER || '').trim(),   // e.g. https://club-coast-customizer.vercel.app
        aud: 'https://app.repspark.com'                    // per your latest requirement
      },
      (process.env.REPSPARK_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      { algorithm: 'RS256' }
    );

    res.status(200).json({ jwt: token });
  } catch (err) {
    console.error('Signer error:', err);
    res.status(500).json({ error: 'Signing failed' });
  }
};
