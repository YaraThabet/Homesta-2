import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 4000;
const EXTERNAL_API = 'http://homefinish.runasp.net/api';

app.use(cors());
app.use(express.json());

app.use('/proxy', async (req, res) => {
  const path = req.url.replace(/^\//, '');
  const targetUrl = `${EXTERNAL_API}/${path}`;

  try {
    const headers = {
      'Accept': 'text/plain', // EXACTLY from your working Swagger Curl
      'Content-Type': 'application/json',
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      'Host': 'homefinish.runasp.net'
    };

    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization'];
    }

    console.log(`[Proxy] Forwarding ${req.method} to ${targetUrl}`);
    console.log(`[Proxy Headers]`, JSON.stringify(headers, null, 2));

    const config = {
      method: req.method,
      url: targetUrl,
      headers: headers,
      data: req.body,
      validateStatus: () => true, // Don't throw on 4xx/5xx
    };

    const response = await axios(config);

    console.log(`[Proxy Response] Status: ${response.status}`);
    res.status(response.status).send(response.data);

  } catch (error) {
    console.error(`[Proxy Fatal Error]`, error.message);
    res.status(502).send({
      message: "Backend communication failed",
      details: error.message
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Swagger-Mirror Proxy is LIVE
  🔗 API: ${EXTERNAL_API}
  `);
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Process Error:', err.message);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy. Kill the process and try again.`);
  }
});
