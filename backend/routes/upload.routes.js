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

export default router;
