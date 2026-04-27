// Vercel Serverless Entry Point
// This file is the handler that Vercel invokes for all API requests.
import app from '../server.js';

// 🛰️ Direct entry-point health check to verify Vercel is hitting this file
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "Satellite Link Active", timestamp: new Date() });
});

export default app;
