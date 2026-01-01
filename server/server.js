import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';

const app = express();
const PORT = 4000;
const EXTERNAL_API = 'http://homefinish.runasp.net/api';

// Enable CORS for all frontend requests
app.use(cors());
app.use(express.json());

// Multer setup for file uploads (optional if we need to parse form-data)
const upload = multer();

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[Proxy Request] ${req.method} ${req.originalUrl}`);
  next();
});

// =====================
// Universal Proxy Handler
// =====================
app.use('/proxy', async (req, res) => {
  // Construct target URL
  // req.url contains everything after /proxy (e.g., /Category?page=1)
  const targetUrl = `${EXTERNAL_API}${req.url}`;

  console.log(`[Forwarding] -> ${targetUrl}`);

  try {
    const config = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        // Overwrite host to match the target API
        host: new URL(EXTERNAL_API).host,
      },
      // Prevent axios from throwing on 4xx/5xx so we can pass them to the client
      validateStatus: () => true,
    };

    // Handle Body
    // Express JSON middleware parses JSON bodies.
    // If we have a body and it's not GET/HEAD, attach it.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      config.data = req.body;
    }

    const response = await axios(config);

    // Forward status
    res.status(response.status);

    // Forward headers (filtering out problematic ones)
    Object.keys(response.headers).forEach((key) => {
      // Node http headers are lowercase
      if (!['content-length', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, response.headers[key]);
      }
    });

    // Send data
    res.send(response.data);

  } catch (error) {
    console.error('[Proxy Error]', error.message);
    if (error.response) {
      // API responded with an error status
      res.status(error.response.status).send(error.response.data);
    } else {
      // Network or other setup error
      res.status(500).json({ error: 'Proxy Server Error', details: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`
  🚀 Proxy Server running at http://localhost:${PORT}
  🔗 Connected to API: ${EXTERNAL_API}
  `);
});
