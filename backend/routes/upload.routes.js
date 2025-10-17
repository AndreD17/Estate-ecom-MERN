// routes/upload.routes.js
import express from 'express';
import { s3, upload } from '../utils/digitalOcean.js';




const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // File validation
  if (req.file.size > 2 * 1024 * 1024)
    return res.status(400).json({ error: 'File must be < 2MB' });

  if (!req.file.mimetype.startsWith('image/'))
    return res.status(400).json({ error: 'Only images allowed' });

  const params = {
    Bucket: 'mern-ecommerce', // your DigitalOcean Space name
    Key: Date.now() + '-' + req.file.originalname, // unique file name
    Body: req.file.buffer,
    ACL: 'public-read',
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    return res.json({ url: data.Location });
  });
});

router.post('/multiple', upload.array('files', 6), async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ error: 'No files uploaded' });

  try {
    const uploadPromises = req.files.map((file) => {
      const params = {
        Bucket: 'mern-ecommerce',
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      };

      return s3.upload(params).promise().then((data) => data.Location);
    });

    const urls = await Promise.all(uploadPromises);
    return res.json({ urls });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
