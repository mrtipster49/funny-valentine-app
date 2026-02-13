// Vercel Serverless Function
// Set env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: 'Telegram not configured' });
  }

  try {
    const body = req.body || {};
    const text = [
      'User ID: ' + (body.id || 'unknown'),
      'Result: ' + (body.result || 'YES'),
      'Attempts Before YES: ' + (body.attempts ?? 0),
      'Time: ' + (body.timestamp || ''),
      'Device: ' + (body.userAgent || '')
    ].join('\n');

    const response = await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text
        })
      }
    );

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send' });
  }
}
