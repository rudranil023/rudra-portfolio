import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Ensure uploads directory exists
// Use /tmp for serverless environments like Netlify (AWS Lambda)
const isServerless = process.env.NETLIFY === 'true' || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.LAMBDA_TASK_ROOT;
const uploadDir = isServerless ? path.join(os.tmpdir(), 'uploads') : path.join(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn("Upload directory check/creation failed:", e.message);
  // If we can't create the dir, use the base tmp dir as a last resort
  if (isServerless) {
    console.log("Falling back to base temp directory");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

export const upload = multer({ storage: storage });
