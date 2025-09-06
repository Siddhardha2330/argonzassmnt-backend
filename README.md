# Argonz Backend API

Backend API for Task Management & Mentor System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

3. Set up the database:
```bash
npm run setup-db
```

4. Test the database connection:
```bash
npm run test-db
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/categories` - Get all categories
- `GET /api/mentors` - Get all mentors
- `GET /api/tasks` - Get all tasks

## Deployment

This backend is designed to be deployed on Render.com or similar platforms.

### Environment Variables Required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Port number (default: 4000)

### Render.com Deployment:
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

The API will be available at your Render URL (e.g., `https://your-app.onrender.com`)
