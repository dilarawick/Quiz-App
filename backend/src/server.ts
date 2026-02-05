import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import quizRoutes from './routes/quiz';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Quiz Backend API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});