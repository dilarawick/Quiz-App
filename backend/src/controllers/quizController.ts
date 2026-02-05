import { Request, Response } from 'express';
import axios from 'axios';
import { promisify } from 'util';
import { exec } from 'child_process';

// Promisify exec for rate limiting
const execAsync = promisify(exec);

// Cache to store session tokens and avoid hitting rate limits
const sessionTokens: Map<string, string> = new Map();

// Rate limiting mechanism - track last API call time
let lastApiCallTime = 0;

/**
 * Get questions from Open Trivia Database API
 */
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check rate limit (Open Trivia DB has 1 request per 5 seconds limit)
    const now = Date.now();
    if (now - lastApiCallTime < 5000) {
      res.status(429).json({ error: 'Rate limit exceeded. Please wait before making another request.' });
      return;
    }
    
    // Update last call time
    lastApiCallTime = now;
    
    // Extract query parameters
    const amount = req.query.amount ? parseInt(req.query.amount as string) : 10;
    const category = req.query.category as string | undefined;
    const difficulty = req.query.difficulty as string | undefined;
    const type = req.query.type as string | undefined;
    const sessionId = req.query.sessionId as string | undefined;
    
    // Build API URL
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
    if (category) apiUrl += `&category=${category}`;
    if (difficulty) apiUrl += `&difficulty=${difficulty}`;
    if (type) apiUrl += `&type=${type}`;
    if (sessionId) {
      // Use session token if provided
      const token = sessionTokens.get(sessionId);
      if (token) {
        apiUrl += `&token=${token}`;
      }
    }
    
    // Make request to Open Trivia DB API
    const response = await axios.get(apiUrl);
    
    // Return the questions
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ error: 'Failed to fetch questions from the API' });
  }
};

/**
 * Create a new session token to avoid duplicate questions
 */
export const createSessionToken = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get('https://opentdb.com/api_token.php?command=request');
    const { token } = response.data;
    
    // Generate a random session ID for our system
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Store the mapping between our session ID and the API token
    sessionTokens.set(sessionId, token);
    
    res.json({ sessionId, token });
  } catch (error: any) {
    console.error('Error creating session token:', error.message);
    res.status(500).json({ error: 'Failed to create session token' });
  }
};

/**
 * Reset a session token
 */
export const resetSessionToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.body.sessionId as string;
    const token = sessionTokens.get(sessionId);
    
    if (!token) {
      res.status(404).json({ error: 'Session token not found' });
      return;
    }
    
    // Reset the token in the API
    const response = await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
    
    if (response.data.response_code === 3) {
      // Token not found, recreate it
      const newResponse = await axios.get('https://opentdb.com/api_token.php?command=request');
      const { token: newToken } = newResponse.data;
      sessionTokens.set(sessionId, newToken);
      res.json({ sessionId, token: newToken });
    } else {
      res.json({ sessionId, token });
    }
  } catch (error: any) {
    console.error('Error resetting session token:', error.message);
    res.status(500).json({ error: 'Failed to reset session token' });
  }
};