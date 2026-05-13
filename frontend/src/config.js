// Central configuration file

// Use VITE_API_URL environment variable if available, otherwise fallback to the Netlify production URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://elegant-griffin-b9b3a0.netlify.app/api';

// For images served from the backend directly (if they are stored locally and not on a CDN)
// Note: In a true production serverless environment, images should be hosted on S3/Cloudinary.
// This is a fallback to allow the application to run without crashing if local images are expected.
export const IMAGE_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://elegant-griffin-b9b3a0.netlify.app';
