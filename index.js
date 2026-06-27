const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, t212-key');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

app.get('/proxy', async (req, res) => {
  const key = req.headers['t212-key'];
  const path = req.query.path;
  if (!key) return res.status(400).json({ error: 'Missing t212-key header' });
  if (!path) return res.status(400).json({ error: 'Missing path query param' });
  try {
    const url = `https://live.trading212.com/api/v0${path}`;
    const response = await fetch(url, {
      headers: { 'Authorization': key }
    });
    const text = await response.text();
    res.status(response.status).set('Content-Type', 'application/json').send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('T212 proxy running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}`));
