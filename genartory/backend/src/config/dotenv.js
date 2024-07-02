// backend/src/config/dotenv.js

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

// Check if required environment variables are set
const requiredEnvVars = [
  'MONGODB_URI',
  'PORT',
  'HUGGING_FACE_API_KEY', // Add any other required environment variables
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing environment variable ${envVar}`);
    process.exit(1); // Exit the application if a required variable is missing
  }
}
