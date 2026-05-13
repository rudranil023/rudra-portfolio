import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Ensure uploads directory exists
// Use /tmp for serverless environments like Netlify
const isServerless = process.env.NETLIFY === 'true' || process.env.AWS_LAMBDA_FUNCTION_VERSION;
const uploadDir = isServerless ? path.join(os.tmpdir(), 'uploads') : path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)){
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        console.warn("Could not create upload dir:", e.message);
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

const upload = multer({ storage: storage });

export default upload;
