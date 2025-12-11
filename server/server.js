// To use ES modules, ensure your package.json has: "type": "module"
import dotenv from 'dotenv';
dotenv.config({path: './server/.env'});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';


const app = express();
const PORT = process.env.PORT || 5000;

console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API Server is running. Use /api/ endpoints.');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
;(
  async () => {
    try {
     const response = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
      console.log('Connected to MongoDB',response.connection.host);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
)()