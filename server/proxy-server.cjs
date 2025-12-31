const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const PORT = 4000;
const EXTERNAL_API = 'http://homefinish.runasp.net/index.html';

// Enable CORS for all frontend requests
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer();

// =====================
// General Proxy for GET
// =====================
app.get('/proxy/:endpoint', async (req, res) => {
    const endpoint = req.params.endpoint;

    try {
        const response = await axios.get(`${EXTERNAL_API}/${endpoint}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

// =====================
// General Proxy for POST (supports form-data)
// =====================
app.post('/proxy/:endpoint', upload.any(), async (req, res) => {
    const endpoint = req.params.endpoint;

    try {
        const form = new FormData();

        // Append text fields
        for (const key in req.body) {
            form.append(key, req.body[key]);
        }

        // Append files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                form.append(file.fieldname, file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype
                });
            });
        }

        const response = await axios.post(`${EXTERNAL_API}/${endpoint}`, form, {
            headers: { ...form.getHeaders() }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Proxy Server running at http://localhost:${PORT}`);
});
