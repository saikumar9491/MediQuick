import express from 'express';
import { 
  getPublicBanners, 
  getAdminBanners, 
  getBannersSummaryStats, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  reorderBanners 
} from '../controllers/bannerController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- ADMIN STATS & SPECIAL ENDPOINTS ---
router.get('/stats/summary', verifyToken, isAdmin, getBannersSummaryStats);
router.get('/stats/banners-summary', verifyToken, isAdmin, getBannersSummaryStats);
router.patch('/reorder', verifyToken, isAdmin, reorderBanners);
router.get('/admin/list', verifyToken, isAdmin, getAdminBanners);

// --- ROOT LISTING (Smart Handler for Public vs Admin) ---
router.get('/', (req, res) => {
  if (req.originalUrl.includes('/api/admin/banners')) {
    return verifyToken(req, res, () => isAdmin(req, res, () => getAdminBanners(req, res)));
  }
  return getPublicBanners(req, res);
});

// CRUD (Admin Protected)
router.post('/', verifyToken, isAdmin, createBanner);
router.put('/:id', verifyToken, isAdmin, updateBanner);
router.patch('/:id', verifyToken, isAdmin, updateBanner);
router.delete('/:id', verifyToken, isAdmin, deleteBanner);

export default router;
