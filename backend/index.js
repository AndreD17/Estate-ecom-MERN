import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';

dotenv.config(); 

const app = express();
const port = 4000;


app.use(cors({
  origin: "http://localhost:5173", // your React dev server
  methods: ["GET", "POST"]
}));


// Multer (file upload middleware)
const upload = multer({ storage: multer.memoryStorage() });

// Configure DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

// ✅ Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {

   // ✅ Check size
  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ error: "File must be < 2MB" });
  }

  // ✅ Check type
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Only images allowed" });
  }

  const params = {
    Bucket: "mern-ecommerce",
    Key: req.file.originalname,
    Body: req.file.buffer,
    ACL: "public-read",
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
    // Ensure proper URL
    const fileUrl = `https://${data.Location.replace(/^https?:\/\//, '')}`;

    res.json({ url: fileUrl });
  });
});

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
});
