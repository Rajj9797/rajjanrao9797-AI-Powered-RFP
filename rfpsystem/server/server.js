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

const RFP_FILE = process.env.RFP_FILE
  ? path.resolve(__dirname, process.env.RFP_FILE)
  : path.join(__dirname, 'rfp_requests.json');

const RESPONSES_FILE = process.env.RESPONSES_FILE
  ? path.resolve(__dirname, process.env.RESPONSES_FILE)
  : path.join(__dirname, 'vendor_responses.json');

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

async function readRfpRequests() {
  try {
    const raw = await fs.readFile(RFP_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(RFP_FILE, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

async function writeRfpRequests(list) {
  await fs.writeFile(RFP_FILE, JSON.stringify(list, null, 2), 'utf8');
}

async function readVendorResponses() {
  try {
    const raw = await fs.readFile(RESPONSES_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(RESPONSES_FILE, '[]', 'utf8');
      return [];
    }
    throw err;
  }
}

async function writeVendorResponses(list) {
  await fs.writeFile(RESPONSES_FILE, JSON.stringify(list, null, 2), 'utf8');
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


app.get('/api/rfp-requests', async (req, res) => {
  try {
    const list = await readRfpRequests();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read RFP requests' });
  }
});


app.post('/api/rfp-requests', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.vendorId) {
      return res.status(400).json({ error: 'Missing vendorId in request' });
    }

    const list = await readRfpRequests();
    const newReq = {
      id: Date.now(),
      vendorId: payload.vendorId,
      vendorName: payload.vendorName || '',
      vendorEmail: payload.vendorEmail || '',
      subject: payload.subject || '',
      body: payload.body || '',
      sentDate: payload.sentDate || new Date().toISOString(),
      rfpDetails: payload.rfpDetails || '',
      createdAt: new Date().toISOString(),
    };
    list.push(newReq);
    await writeRfpRequests(list);
    res.status(201).json(newReq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save RFP request' });
  }
});

app.get('/api/vendor-responses', async (req, res) => {
  try {
    const list = await readVendorResponses();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read vendor responses' });
  }
});

app.post('/api/vendor-responses', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.vendorId) {
      return res.status(400).json({ error: 'Missing vendorId in request' });
    }
    if (!payload.response) {
      return res.status(400).json({ error: 'Missing response content' });
    }

    const list = await readVendorResponses();
    const newResponse = {
      id: Date.now(),
      vendorId: payload.vendorId,
      vendorName: payload.vendorName || '',
      vendorEmail: payload.vendorEmail || '',
      response: payload.response,
      attachments: payload.attachments || [],
      receivedAt: new Date().toISOString(),
      rfpRequestId: payload.rfpRequestId || null,
    };
    list.push(newResponse);
    await writeVendorResponses(list);
    res.status(201).json(newResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save vendor response' });
  }
});

// AI parsing endpoint for vendor responses
app.post('/api/parse-vendor-response', async (req, res) => {
  try {
    const { responseText } = req.body;
    if (!responseText) {
      return res.status(400).json({ error: 'Missing responseText' });
    }

    // Simulate AI parsing (in production, use OpenAI/Claude API)
    const parsed = {
      pricing: [],
      totalPrice: 0,
      warranty: '',
      deliveryTime: '',
      paymentTerms: '',
      additionalServices: []
    };

    // Extract prices
    const priceMatches = responseText.matchAll(/\$?([\d,]+(?:\.\d{2})?)\s*(?:per|each|for)?/gi);
    for (const match of priceMatches) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (price > 0) parsed.pricing.push(price);
    }
    
    if (parsed.pricing.length > 0) {
      parsed.totalPrice = parsed.pricing.reduce((sum, p) => sum + p, 0);
    }

    // Extract warranty
    const warrantyMatch = responseText.match(/(\d+)\s*years?\s*warranty/i);
    parsed.warranty = warrantyMatch ? `${warrantyMatch[1]} years` : 'Not specified';

    // Extract delivery time
    const deliveryMatch = responseText.match(/(\d+)\s*(days?|weeks?)/i);
    parsed.deliveryTime = deliveryMatch ? `${deliveryMatch[1]} ${deliveryMatch[2]}` : 'Not specified';

    // Extract payment terms
    const paymentMatch = responseText.match(/net\s*(\d+)/i);
    parsed.paymentTerms = paymentMatch ? `Net ${paymentMatch[1]}` : 'Not specified';

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse response' });
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