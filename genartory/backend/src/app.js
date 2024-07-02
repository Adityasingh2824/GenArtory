// backend/src/app.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session'; //for using sessions in express
import MongoDBStore from 'connect-mongodb-session'; //for storing sessions in mongo db
import { connectDB } from './config/db.js';
import aiRoutes from './routes/ai.js';
import nftRoutes from './routes/nft.js';
import marketplaceRoutes from './routes/marketplace.js';
import daoRoutes from './routes/dao.js';
import { handleError } from './utils/errorHandler.js';



// Load environment variables
require('./config/dotenv');

const app = express();
const port = process.env.MONGODB_URI || 3000;


// Connect to the database
connectDB()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/dao', daoRoutes);

// Error Handling
app.use(handleError); // Error handling middleware

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
