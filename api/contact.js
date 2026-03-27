export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Bogong Painting <noreply@bogongpainting.com.au>',
        to: ['info@bogongpainting.com.au'],
        subject: `New Enquiry — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9f9f9;">
            <h2 style="color:#0c0c0e;margin-bottom:24px;">New Enquiry from Bogong Painting Website</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;width:140px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">${email.replace('@bogongpainting.com.au', '')}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Details</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;white-space:pre-line;">${message}</td>
              </tr>
            </table>
            <p style="margin-top:24px;color:#666;font-size:13px;">Sent from bogongpainting.com.au</p>
          </div>
        `
      })
    });

    if (!r.ok) {
      const err = await r.json();
      console.error('Resend error:', err);
      return res.status(500).json({ ok: false, error: err });
    }

    return res.status(200).json({ ok: true });

  } catch (e) {
    console.error('Contact error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
