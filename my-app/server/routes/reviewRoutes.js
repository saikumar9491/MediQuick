import express from 'express';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Get All Reviews Flat list (Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const medicines = await Medicine.find().select('name brand image reviews');
    const flatReviews = [];

    medicines.forEach(med => {
      if (med.reviews && med.reviews.length > 0) {
        med.reviews.forEach(rev => {
          flatReviews.push({
            _id: rev._id,
            medicineId: med._id,
            productName: med.name,
            productBrand: med.brand,
            productImage: med.image,
            customerName: rev.name,
            rating: rev.rating,
            comment: rev.comment,
            isApproved: rev.isApproved,
            adminResponse: rev.adminResponse,
            orderId: rev.orderId,
            createdAt: rev.createdAt,
          });
        });
      }
    });

    // Sort by newest first
    flatReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(flatReviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
});

/**
 * @desc    Approve / Toggle Review Status (Admin)
 * @route   PUT /api/reviews/:medicineId/:reviewId/approve
 * @access  Private/Admin
 */
router.put('/:medicineId/:reviewId/approve', verifyToken, isAdmin, async (req, res) => {
  try {
    const { medicineId, reviewId } = req.params;
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine/Product not found" });
    }

    const review = medicine.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isApproved = true;
    
    // Recalculate average rating of approved reviews
    const approvedReviews = medicine.reviews.filter(r => r.isApproved);
    if (approvedReviews.length > 0) {
      medicine.rating = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
    } else {
      medicine.rating = 0;
    }
    medicine.numReviews = approvedReviews.length;

    await medicine.save();
    res.json({ message: "Review approved successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Error approving review", error: err.message });
  }
});

/**
 * @desc    Delete Review (Admin)
 * @route   DELETE /api/reviews/:medicineId/:reviewId
 * @access  Private/Admin
 */
router.delete('/:medicineId/:reviewId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { medicineId, reviewId } = req.params;
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine/Product not found" });
    }

    // Pull the review from the reviews array
    medicine.reviews.pull({ _id: reviewId });
    
    // Recalculate average rating
    const approvedReviews = medicine.reviews.filter(r => r.isApproved);
    if (approvedReviews.length > 0) {
      medicine.rating = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
    } else {
      medicine.rating = 0;
    }
    medicine.numReviews = approvedReviews.length;

    await medicine.save();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
});

/**
 * @desc    Update Review Status (Publish/Hide)
 * @route   PATCH /api/reviews/:medicineId/reviews/:reviewId/status
 * @access  Private/Admin
 */
router.patch('/:medicineId/reviews/:reviewId/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const medicine = await Medicine.findById(req.params.medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const review = medicine.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isApproved = isApproved;
    await medicine.save();
    await recalculateMedicineRating(medicine._id);

    res.json({ message: 'Review status updated successfully', isApproved: review.isApproved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review status', error: error.message });
  }
});

/**
 * @desc    Respond to a Review
 * @route   POST /api/reviews/:medicineId/reviews/:reviewId/respond
 * @access  Private/Admin
 */
router.post('/:medicineId/reviews/:reviewId/respond', verifyToken, isAdmin, async (req, res) => {
  try {
    const { responseText } = req.body;
    const medicine = await Medicine.findById(req.params.medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const review = medicine.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.adminResponse = responseText;
    await medicine.save();

    res.json({ message: 'Response posted successfully', adminResponse: review.adminResponse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post response', error: error.message });
  }
});

// ==========================================
// RATING RECALCULATION HELPER
// ==========================================
async function recalculateMedicineRating(medicineId) {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) return;

  const approvedReviews = medicine.reviews.filter(r => r.isApproved);
  if (approvedReviews.length > 0) {
    const totalRating = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    medicine.rating = totalRating / approvedReviews.length;
  } else {
    medicine.rating = 0;
  }
  medicine.numReviews = approvedReviews.length;
  await medicine.save();
}

// ==========================================
// CUSTOMER REVIEWS ENDPOINTS
// ==========================================

// Get published reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.productId);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    const approvedReviews = medicine.reviews.filter(r => r.isApproved);
    res.json(approvedReviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Check if user is eligible to write/edit a review
router.get('/can-review/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const deliveredOrder = await Order.findOne({
      userId,
      status: 'Delivered',
      'items.productId': productId
    });

    const canReview = !!deliveredOrder;

    const medicine = await Medicine.findById(productId);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    const existingReview = medicine.reviews.find(r => r.user.toString() === userId.toString());

    res.json({
      canReview,
      orderId: deliveredOrder ? deliveredOrder._id : null,
      alreadyReviewed: !!existingReview,
      review: existingReview || null
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking review status', error: err.message });
  }
});

// Submit a new review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, comment, title, images } = req.body;
    const userId = req.user._id;

    // 1. Verify purchase
    const deliveredOrder = await Order.findOne({
      userId,
      status: 'Delivered',
      'items.productId': productId
    });

    if (!deliveredOrder) {
      return res.status(403).json({ message: 'Access denied. You must have a delivered order containing this product to review it.' });
    }

    // 2. Verify no existing review
    const medicine = await Medicine.findById(productId);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    const alreadyReviewed = medicine.reviews.some(r => r.user.toString() === userId.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by you. Edit your review instead.' });
    }

    // 3. Create review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      title,
      images: images || [],
      user: userId,
      orderId: deliveredOrder._id,
      isApproved: true // Approved by default
    };

    medicine.reviews.push(review);
    await medicine.save();
    
    await recalculateMedicineRating(productId);

    res.status(201).json({ message: 'Review submitted successfully.', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
});

// Edit existing review
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, title, images } = req.body;
    const userId = req.user._id;

    const medicine = await Medicine.findOne({ 'reviews._id': id });
    if (!medicine) return res.status(404).json({ message: 'Review not found' });

    const review = medicine.reviews.id(id);
    
    // 1. Ownership check
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only edit your own reviews.' });
    }

    // 2. 30-day edit window check
    const reviewAgeMs = Date.now() - new Date(review.createdAt).getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (reviewAgeMs > thirtyDaysMs) {
      return res.status(400).json({ message: 'Edit window closed. Reviews can only be edited within 30 days.' });
    }

    // 3. Apply updates
    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;
    if (title !== undefined) review.title = title;
    if (images !== undefined) review.images = images;
    review.isApproved = true; // Keep active

    await medicine.save();
    await recalculateMedicineRating(medicine._id);

    res.json({ message: 'Review updated successfully.', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
});

// Delete review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const medicine = await Medicine.findOne({ 'reviews._id': id });
    if (!medicine) return res.status(404).json({ message: 'Review not found' });

    const review = medicine.reviews.id(id);

    // Ownership check (unless Admin)
    const isUserAdmin = req.user.role === 'admin';
    if (!isUserAdmin && review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own reviews.' });
    }

    // Delete review
    medicine.reviews.pull({ _id: id });
    await medicine.save();

    await recalculateMedicineRating(medicine._id);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
});

export default router;
