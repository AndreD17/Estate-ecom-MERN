import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import uploadRouter from './routes/upload.routes.js';
import listingRouter from './routes/listing.routes.js';
import path from 'path'




dotenv.config();


const app = express();
const port = 4000;


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,   
  methods: ["GET", "POST"]
}));

app.use(cookieParser());

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const __dirname = path.resolve();

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/listings', listingRouter);
app.use("/api/upload/multiple", uploadRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('-', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

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
