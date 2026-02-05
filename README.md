# Quiz Application

## Overview

This is a quiz application built as part of the FOSS Technical Team 2026 selection task. The application allows users to take quizzes using questions from the Open Trivia Database API.

## Features

- Interactive quiz interface with multiple-choice questions
- Session management to avoid duplicate questions
- Rate limiting handling for the Open Trivia DB API
- Responsive design for all device sizes
- Real-time score tracking

## Tech Stack

### Frontend

- React with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- Axios for API requests

### Backend

- Node.js with Express
- TypeScript
- Axios for external API calls
- Rate limiting and session management

### Additional Tools

- Docker for containerization
- Docker Compose for orchestration
- Nginx as a reverse proxy

## Architecture

The application consists of two main components:

1. **Frontend**: A React application that provides the user interface for taking quizzes
2. **Backend**: A Node.js/Express server that acts as a proxy to the Open Trivia DB API, handling rate limiting and session management

## API Integration

The application integrates with the Open Trivia Database API (https://opentdb.com/) while addressing the following concerns:

- **Rate Limiting**: The API has a 1 request per 5 seconds limit, which is handled by our backend
- **Session Management**: Session tokens are used to avoid duplicate questions
- **Caching**: In-memory caching reduces external API calls
- **Error Handling**: Proper fallbacks for API failures

## Running the Application

### Prerequisites

- Docker and Docker Compose (recommended approach)
- Node.js (v18 or higher) - for local development only

### Using Docker (Recommended)

The recommended way to run the application is using Docker, which ensures all dependencies and configurations work correctly together:

1. Build and run the containers:

   ```bash
   docker-compose up --build
   ```

2. Access the application:

   - The application will be available at `http://localhost`
   - The backend API will be accessible at `http://localhost/api/quiz/`

3. To stop the application:
   ```bash
   docker-compose down
   ```

### Local Development (Alternative)

If you prefer to run the application locally without Docker:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Quiz-App
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Run the backend server:

   ```bash
   cd backend
   npm run dev
   ```

4. In a new terminal, run the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## Project Structure

```
Quiz-App/
├── backend/              # Backend server
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── routes/       # API routes
│   │   └── server.ts     # Main server file
│   ├── package.json
│   └── Dockerfile
├── frontend/             # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Deployment

The application is designed to be deployed using Docker containers. The docker-compose.yml file orchestrates both frontend and backend services.
