import Medicine from '../models/Medicine.js';

// @desc    Get all medicines (supports Search & Category)
// @route   GET /api/medicines
export const getMedicines = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines from Hub' });
  }
};

// @desc    Get Related Medicines (Similar Products Logic)
// @route   GET /api/medicines/related/:id
export const getRelatedMedicines = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const related = await Medicine.find({
      category: medicine.category,
      _id: { $ne: medicine._id },
    }).limit(5);

    res.status(200).json(related || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching related items' });
  }
};

// @desc    Get Top Rated Medicines for Home Screen (Prioritizes Flash Deals)
// @route   GET /api/medicines/top
export const getTopMedicines = async (req, res) => {
  try {
    // 1. Fetch Explicit Flash Deals first
    let flashDeals = await Medicine.find({ isFlashDeal: true })
      .sort({ createdAt: -1 })
      .limit(8);

    // 2. If fewer than 8 flash deals, supplement with top-rated medicines
    let supplementaryMedicines = [];
    if (flashDeals.length < 8) {
      supplementaryMedicines = await Medicine.find({ 
        isFlashDeal: false, 
        rating: { $gte: 4 } 
      })
        .sort({ rating: -1, createdAt: -1 })
        .limit(8 - flashDeals.length);
    }

    // 3. Final Fallback: Latest medicines if still empty
    let finalMedicines = [...flashDeals, ...supplementaryMedicines];
    if (finalMedicines.length === 0) {
      finalMedicines = await Medicine.find({})
        .sort({ createdAt: -1 })
        .limit(8);
    }

    res.status(200).json(finalMedicines || []);
  } catch (error) {
    console.error('getTopMedicines error:', error);
    res.status(200).json([]);
  }
};

// @desc    Get single medicine details
// @route   GET /api/medicines/:id
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or Hub Sync error' });
  }
};

/**
 * --- ADMIN FUNCTIONS ---
 */

// @desc    Add a new medicine unit
// @route   POST /api/medicines
export const addMedicine = async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(400).json({
      message: 'Error adding medicine to inventory',
      error: error.message,
    });
  }
};

// @desc    Update existing medicine details
// @route   PUT /api/medicines/:id
export const updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Delete a medicine unit
// @route   DELETE /api/medicines/:id
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Unit successfully purged from Hub' });
  } catch (error) {
    res.status(500).json({ message: 'Delete operation failed' });
  }
};

// @desc    Toggle Flash Deal status
// @route   PATCH /api/medicines/:id/flash-deal
export const toggleFlashDeal = async (req, res) => {
  try {
    const { isFlashDeal, discountPrice } = req.body;
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.isFlashDeal = isFlashDeal !== undefined ? isFlashDeal : !medicine.isFlashDeal;
    if (discountPrice !== undefined) {
      medicine.discountPrice = discountPrice;
    }

    const updatedMedicine = await medicine.save();
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update flash deal status', error: error.message });
  }
};

/**
 * --- REVIEW LOGIC ---
 */

// @desc    Create a product review
// @route   POST /api/medicines/:id/reviews
export const createMedicineReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      const alreadyReviewed = medicine.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed by you' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      medicine.reviews.push(review);
      medicine.numReviews = medicine.reviews.length;

      medicine.rating =
        medicine.reviews.reduce((acc, item) => item.rating + acc, 0) /
        medicine.reviews.length;

      await medicine.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Review submission failed',
      error: error.message,
    });
  }
};