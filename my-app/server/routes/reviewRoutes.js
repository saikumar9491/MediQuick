import express from 'express';
import Medicine from '../models/Medicine.js';
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

export default router;
