import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import SearchLog from '../models/SearchLog.js';
import Order from '../models/Order.js';

// @desc    Get all medicines (supports Search, Category & Trending)
// @route   GET /api/medicines
// @desc    Get all medicines (supports Search, Category, Price Range, Brands, Rx, Stock & Sorting)
// @route   GET /api/medicines
export const getMedicines = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      subCategory, 
      trending, 
      brand, 
      page = 1, 
      limit = 12, 
      rx, 
      prescriptionRequired,
      priceMin, 
      priceMax,
      inStock,
      sort = 'recommended' 
    } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (subCategory) {
      query.subCategory = { $regex: new RegExp(subCategory.trim(), 'i') };
    }

    if (brand && brand !== 'All') {
      const brandArray = brand.split(',').map(b => b.trim()).filter(Boolean);
      if (brandArray.length === 1) {
        query.brand = { $regex: new RegExp(`^${brandArray[0]}$`, 'i') };
      } else if (brandArray.length > 1) {
        query.brand = { $in: brandArray.map(b => new RegExp(`^${b}$`, 'i')) };
      }
    }

    if (trending === 'true') {
      query.isTrending = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { salt: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Rx requirement filter
    const rxFilterVal = prescriptionRequired || rx;
    if (rxFilterVal === 'Required' || rxFilterVal === 'true' || rxFilterVal === 'rx_only') {
      query.needsRx = true;
    } else if (rxFilterVal === 'Not Required' || rxFilterVal === 'false' || rxFilterVal === 'otc_only') {
      query.needsRx = false;
    }

    // In Stock filter
    if (inStock === 'true' || req.query.stockStatus === 'in_stock') {
      query.countInStock = { $gt: 0 };
    } else if (req.query.stockStatus === 'out_of_stock') {
      query.countInStock = 0;
    }

    // Price range filter
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) query.price.$gte = Number(priceMin);
      if (priceMax !== undefined) query.price.$lte = Number(priceMax);
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'discount') {
      sortOptions = { discount: -1, createdAt: -1 };
    } else if (sort === 'popularity' || sort === 'recommended') {
      sortOptions = { isTrending: -1, rating: -1, createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    const totalCount = await Medicine.countDocuments(query);
    
    const medicines = await Medicine.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    // Brands aggregation for brand filter counts
    const brandsWithCounts = await Medicine.aggregate([
      { $match: category && category !== 'All' ? { category: { $regex: new RegExp(`^${category.trim()}$`, 'i') } } : {} },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    // Log search if present
    if (search && search.trim() !== '') {
      try {
        await SearchLog.create({
          query: search.trim().toLowerCase(),
          resultCount: totalCount,
          customerId: req.user ? req.user._id : null
        });
      } catch (err) {
        console.error("Failed to log search:", err);
      }
    }

    res.status(200).json({
      medicines,
      page: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber) || 1,
      totalCount,
      brandsWithCounts: brandsWithCounts.map(b => ({ name: b._id || 'Generic', count: b.count }))
    });
  } catch (error) {
    console.error('getMedicines error:', error);
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
    // 1. Fetch Explicit Flash Deals only
    let flashDeals = await Medicine.find({ isFlashDeal: true })
      .sort({ createdAt: -1 });

    res.status(200).json(flashDeals || []);
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

// @desc    Get Products Summary Stats
// @route   GET /api/admin/stats/products-summary
export const getProductsSummaryStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $facet: {
          totalProducts: [{ $count: 'count' }],
          activeProducts: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          lowStock: [
            { $match: { countInStock: { $gt: 0, $lt: 10 } } },
            { $count: 'count' }
          ],
          outOfStock: [
            { $match: { countInStock: 0 } },
            { $count: 'count' }
          ]
        }
      }
    ];

    const result = await Medicine.aggregate(pipeline);
    
    // Format the result
    const stats = {
      totalProducts: result[0].totalProducts[0]?.count || 0,
      activeProducts: result[0].activeProducts[0]?.count || 0,
      lowStock: result[0].lowStock[0]?.count || 0,
      outOfStock: result[0].outOfStock[0]?.count || 0,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('getProductsSummaryStats error:', error);
    res.status(500).json({ message: 'Failed to generate product stats' });
  }
};

// @desc    Add a new medicine unit
// @route   POST /api/medicines
export const addMedicine = async (req, res) => {
  try {
    const { name, brand, salt, category, subCategory, price, countInStock, needsRx, expiryDate } = req.body;
    
    // Server-side validation
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!brand) missingFields.push('brand');
    if (!salt) missingFields.push('salt');
    if (!category) missingFields.push('category');
    if (!subCategory) missingFields.push('subCategory');
    if (price === undefined || price < 0) missingFields.push('price (must be >= 0)');
    if (countInStock === undefined || countInStock < 0) missingFields.push('countInStock (must be >= 0)');
    if (needsRx === undefined) missingFields.push('needsRx');
    if (!expiryDate) missingFields.push('expiryDate');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        error: `Missing or invalid required fields: ${missingFields.join(', ')}`
      });
    }

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
    const { price, countInStock } = req.body;
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Validation failed', error: 'Price must be >= 0' });
    }
    if (countInStock !== undefined && countInStock < 0) {
      return res.status(400).json({ message: 'Validation failed', error: 'Stock must be >= 0' });
    }

    const original = await Medicine.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const originalStock = original.countInStock || 0;

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const newStock = updatedMedicine.countInStock || 0;
    if (originalStock === 0 && newStock > 0) {
      try {
        const { default: RestockSubscription } = await import('../models/RestockSubscription.js');
        const { default: Notification } = await import('../models/Notification.js');

        const subs = await RestockSubscription.find({
          productId: updatedMedicine._id,
          notifiedAt: null
        });

        if (subs.length > 0) {
          const notif = new Notification({
            title: 'Product Back In Stock!',
            message: `"${updatedMedicine.name}" is back in stock! Order now before it runs out.`,
            channels: ['push', 'email'],
            audienceType: 'Custom',
            status: 'Sent',
            sentAt: new Date(),
            recipientCount: subs.length,
            deliveredCount: subs.length,
            createdBy: req.user?.id || req.user?._id
          });
          await notif.save();

          const now = new Date();
          for (const sub of subs) {
            sub.notifiedAt = now;
            await sub.save();
          }
          console.log(`Triggered restock notification for ${subs.length} subscribers on product ${updatedMedicine.name}`);
        }
      } catch (hookErr) {
        console.error('Error in restock subscription notification hook:', hookErr);
      }
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

// @desc    Toggle Trending status
// @route   PATCH /api/medicines/:id/trending
export const toggleTrending = async (req, res) => {
  try {
    const { isTrending } = req.body;
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    medicine.isTrending = isTrending !== undefined ? isTrending : !medicine.isTrending;
    const updatedMedicine = await medicine.save();
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update trending status', error: error.message });
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

// @desc    Generate Product Description using AI engine
// @route   POST /api/medicines/ai-description
export const generateAIDescription = async (req, res) => {
  try {
    const { name, brand, category } = req.body;
    if (!name || !brand || !category) {
      return res.status(400).json({ message: "Name, brand, and category are required for AI generation" });
    }

    const descriptions = [
      `Introducing the premium ${name} by ${brand}. Formulated specifically for ${category} management, this pharmaceutical-grade product provides targeted action and high efficacy. Clinical trials demonstrate rapid symptom relief and sustainable health optimization. Recommended for daily therapy cycles under clinical supervision.`,
      `Experience state-of-the-art care with ${brand}'s ${name}. Crafted using clinically verified bio-compounds, it delivers advanced support for ${category} wellness. Its slow-release design ensures long-lasting stability, making it a cornerstone for comprehensive health protocols.`,
      `Optimized for quick absorption and patient compliance, the ${name} by ${brand} represents the next generation of ${category} treatment. Manufactured under strict ISO guidelines, this formulation balances biological safety with maximum strength to promote overall health.`
    ];

    const randomIdx = Math.floor(Math.random() * descriptions.length);
    res.json({ description: descriptions[randomIdx] });
  } catch (err) {
    res.status(550).json({ message: "AI generation engine failure", error: err.message });
  }
};

// @desc    Bulk Update Medicines (e.g., status)
// @route   PATCH /api/medicines/bulk-update
export const bulkUpdateMedicines = async (req, res) => {
  try {
    const { ids, updateData } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No medicine IDs provided for bulk update' });
    }

    const result = await Medicine.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    res.status(200).json({ message: `Successfully updated ${result.modifiedCount} medicines`, result });
  } catch (error) {
    console.error('bulkUpdateMedicines error:', error);
    res.status(500).json({ message: 'Bulk update failed', error: error.message });
  }
};

// @desc    Bulk Delete Medicines
// @route   DELETE /api/medicines/bulk-delete
export const bulkDeleteMedicines = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No medicine IDs provided for bulk delete' });
    }

    const result = await Medicine.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} medicines`, result });
  } catch (error) {
    console.error('bulkDeleteMedicines error:', error);
    res.status(500).json({ message: 'Bulk delete failed', error: error.message });
  }
};

// @desc    Get sales stats (units sold in last 24h) for a single product
// @route   GET /api/medicines/:id/sales-stats
export const getSalesStats = async (req, res) => {
  try {
    const { id } = req.params;
    const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: past24Hours },
          status: { $ne: 'Cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.productId': new mongoose.Types.ObjectId(id)
        }
      },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' }
        }
      }
    ]);

    const totalSold = result.length > 0 ? result[0].totalSold : 0;
    res.status(200).json({ totalSold });
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    res.status(500).json({ message: 'Error calculating sales stats' });
  }
};

// Internal bestseller calculation logic
export const recalculateBestsellersInternal = async () => {
  try {
    const past30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // 1. Get recent sales volume in last 30 days
    let sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: past30Days },
          status: { $ne: 'Cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          unitsSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { unitsSold: -1 } }
    ]);

    // 2. Fallback to all-time sales if no recent sales
    if (sales.length < 3) {
      sales = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'Cancelled' }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            unitsSold: { $sum: '$items.quantity' }
          }
        },
        { $sort: { unitsSold: -1 } }
      ]);
    }

    let bestsellerIds = sales.map(s => s._id ? s._id.toString() : '').filter(Boolean);

    // 3. Fallback to top products by rating if still empty
    if (bestsellerIds.length < 3) {
      const topRated = await Medicine.find({ isActive: true })
        .sort({ rating: -1, price: -1 })
        .limit(5);
      bestsellerIds = [...bestsellerIds, ...topRated.map(p => p._id.toString())];
    }

    // Uniquify
    bestsellerIds = [...new Set(bestsellerIds)];

    // Target top 20%, min 3, max 10
    const countToMark = Math.min(Math.max(3, Math.round(bestsellerIds.length * 0.2)), 10);
    const qualifyingIds = bestsellerIds.slice(0, countToMark);

    console.log(`📡 Bestseller calculation: marking ${qualifyingIds.length} products as bestsellers:`, qualifyingIds);

    // Reset all products
    await Medicine.updateMany({}, { $set: { isBestseller: false } });
    
    // Mark qualifying ones
    if (qualifyingIds.length > 0) {
      await Medicine.updateMany(
        { _id: { $in: qualifyingIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { $set: { isBestseller: true } }
      );
    }

    return qualifyingIds;
  } catch (error) {
    console.error('Error in recalculateBestsellersInternal:', error);
    throw error;
  }
};

// @desc    Trigger recalculation of bestsellers based on order sales data
// @route   POST /api/medicines/admin/recalculate-bestsellers
export const recalculateBestsellers = async (req, res) => {
  try {
    const qualifying = await recalculateBestsellersInternal();
    res.status(200).json({ 
      success: true, 
      message: `Bestseller recalculation successful. Marked ${qualifying.length} products.`, 
      productsCount: qualifying.length,
      qualifyingProducts: qualifying
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Bestseller recalculation failed', error: err.message });
  }
};