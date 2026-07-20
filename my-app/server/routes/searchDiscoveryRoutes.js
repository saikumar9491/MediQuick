import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import SearchLog from '../models/SearchLog.js';

const router = express.Router();

// Helper to get date based on range
const getStartDate = (range) => {
  const now = new Date();
  if (range === 'Today') return new Date(now.setHours(0,0,0,0));
  if (range === '7d') return new Date(now.setDate(now.getDate() - 7));
  if (range === '30d') return new Date(now.setDate(now.getDate() - 30));
  if (range === '90d') return new Date(now.setDate(now.getDate() - 90));
  return new Date(0); // All time
};

// GET /api/admin/search-discovery/summary
router.get('/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const startDate = getStartDate(range);

    const logs = await SearchLog.find({ createdAt: { $gte: startDate } });
    const totalSearches = logs.length;
    const uniqueTerms = new Set(logs.map(l => l.query)).size;
    const zeroResults = logs.filter(l => l.resultCount === 0).length;
    const avgResults = totalSearches > 0 
      ? (logs.reduce((acc, curr) => acc + curr.resultCount, 0) / totalSearches).toFixed(1) 
      : 0;

    // Top searched terms
    const termCounts = {};
    logs.forEach(l => {
      termCounts[l.query] = (termCounts[l.query] || 0) + 1;
    });
    
    const topSearches = Object.keys(termCounts)
      .map(query => ({ term: query, count: termCounts[query] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Trend (searches per day)
    const trend = {};
    logs.forEach(l => {
      const date = l.createdAt.toISOString().split('T')[0];
      trend[date] = (trend[date] || 0) + 1;
    });
    
    const volumeTrend = Object.keys(trend).map(date => ({
      date,
      count: trend[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      stats: { totalSearches, uniqueTerms, zeroResults, avgResults },
      topSearches,
      volumeTrend
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching search summary", error: err.message });
  }
});

// GET /api/admin/search-discovery/zero-results
router.get('/zero-results', verifyToken, isAdmin, async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const startDate = getStartDate(range);

    const logs = await SearchLog.find({ 
      resultCount: 0, 
      createdAt: { $gte: startDate } 
    });

    const termCounts = {};
    logs.forEach(l => {
      termCounts[l.query] = (termCounts[l.query] || 0) + 1;
    });

    const zeroResultTerms = Object.keys(termCounts)
      .map(query => ({ term: query, count: termCounts[query] }))
      .sort((a, b) => b.count - a.count);

    res.json(zeroResultTerms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching zero results", error: err.message });
  }
});

// GET /api/admin/search-discovery/trending
router.get('/trending', verifyToken, isAdmin, async (req, res) => {
  try {
    // Current week vs Previous week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeekLogs = await SearchLog.find({ createdAt: { $gte: oneWeekAgo } });
    const prevWeekLogs = await SearchLog.find({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } });

    const currentCounts = {};
    currentWeekLogs.forEach(l => currentCounts[l.query] = (currentCounts[l.query] || 0) + 1);

    const prevCounts = {};
    prevWeekLogs.forEach(l => prevCounts[l.query] = (prevCounts[l.query] || 0) + 1);

    const trending = [];
    Object.keys(currentCounts).forEach(term => {
      const current = currentCounts[term];
      const prev = prevCounts[term] || 0;
      // Calculate growth (skip if it was 0 last week, just say +100%)
      const growth = prev === 0 ? 100 : Math.round(((current - prev) / prev) * 100);
      
      if (growth > 0) {
        trending.push({ term, current, prev, growth });
      }
    });

    trending.sort((a, b) => b.growth - a.growth);

    res.json(trending.slice(0, 15));
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending terms", error: err.message });
  }
});

export default router;
