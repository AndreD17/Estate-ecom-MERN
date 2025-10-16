// utils/digitalOcean.js
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

// Create an endpoint for DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

// Create an S3 instance configured for DigitalOcean
export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

// Configure multer to store files in memory before upload
export const upload = multer({ storage: multer.memoryStorage() });
