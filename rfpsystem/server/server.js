const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
const DATA_FILE = process.env.VENDORS_FILE
  ? path.resolve(__dirname, process.env.VENDORS_FILE)
  : path.join(__dirname, 'vendors.json');

app.use(bodyParser.json());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

async function readVendors() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

async function writeVendors(list) {
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

app.get('/api/vendors', async (req, res) => {
  try {
    const list = await readVendors();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read vendors' });
  }
});

app.post('/api/vendors', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name) {
      return res.status(400).json({ error: 'Missing vendor name' });
    }

    const list = await readVendors();
    const newVendor = {
      id: Date.now(),
      name: payload.name,
      contact: payload.contact || '',
      email: payload.email || '',
      createdAt: new Date().toISOString(),
    };
    list.push(newVendor);
    await writeVendors(list);
    res.status(201).json(newVendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save vendor' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Vendor API server listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error on listen:', err && err.stack ? err.stack : err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  }
});
