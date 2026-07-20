import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import PricingRule from '../models/PricingRule.js';

const router = express.Router();

// GET /api/pricing/rules
router.get('/rules', verifyToken, isAdmin, async (req, res) => {
  try {
    const rules = await PricingRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pricing rules", error: err.message });
  }
});

// POST /api/pricing/rules
router.post('/rules', verifyToken, isAdmin, async (req, res) => {
  try {
    const rule = new PricingRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ message: "Error creating pricing rule", error: err.message });
  }
});

// PATCH /api/pricing/rules/:id
router.patch('/rules/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rule);
  } catch (err) {
    res.status(400).json({ message: "Error updating pricing rule", error: err.message });
  }
});

// DELETE /api/pricing/rules/:id
router.delete('/rules/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting rule", error: err.message });
  }
});

// GET /api/pricing/suggestions
// Core engine that evaluates medicines against rules
router.get('/suggestions', verifyToken, isAdmin, async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;

    const medicines = await Medicine.find(query).select('name image price countInStock expiryDate category');
    const activeRules = await PricingRule.find({ isActive: true });
    
    // Fetch orders from last 30 days to calculate velocity
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } }).select('items createdAt');

    // Precompute sales velocity per medicine
    const velocity = {};
    recentOrders.forEach(order => {
      const isLast7Days = order.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      order.items.forEach(item => {
        if (!velocity[item.productId]) {
          velocity[item.productId] = { last30: 0, last7: 0, lastSaleDate: null };
        }
        velocity[item.productId].last30 += item.quantity;
        if (isLast7Days) velocity[item.productId].last7 += item.quantity;
        
        if (!velocity[item.productId].lastSaleDate || order.createdAt > velocity[item.productId].lastSaleDate) {
          velocity[item.productId].lastSaleDate = order.createdAt;
        }
      });
    });

    const suggestions = [];

    // Evaluate each medicine
    medicines.forEach(med => {
      const medVelocity = velocity[med._id] || { last30: 0, last7: 0, lastSaleDate: null };
      const daysSinceLastSale = medVelocity.lastSaleDate 
        ? Math.floor((Date.now() - new Date(medVelocity.lastSaleDate)) / (1000 * 60 * 60 * 24))
        : 999; // Never sold
        
      const daysToExpiry = med.expiryDate 
        ? Math.floor((new Date(med.expiryDate) - Date.now()) / (1000 * 60 * 60 * 24))
        : 999;

      let appliedRule = null;
      let reason = '';

      for (const rule of activeRules) {
        if (rule.conditionType === 'Low Demand') {
          if (daysSinceLastSale >= (rule.thresholds.daysWithoutSale || 30) && med.countInStock > (rule.thresholds.stockGreaterThan || 10)) {
            appliedRule = rule;
            reason = `Low demand — reduce ${Math.abs(rule.adjustmentPercent)}%`;
            break;
          }
        }
        else if (rule.conditionType === 'Expiring Soon') {
          if (daysToExpiry <= (rule.thresholds.expiryDaysLessThan || 30) && med.countInStock > 0) {
            appliedRule = rule;
            reason = `Expiring in ${daysToExpiry} days — clear stock`;
            break;
          }
        }
        else if (rule.conditionType === 'High Demand, Low Stock') {
          if (medVelocity.last7 >= (rule.thresholds.salesLast7DaysGreaterThan || 50) && med.countInStock < (rule.thresholds.stockLessThan || 20)) {
            appliedRule = rule;
            reason = `High demand, low stock — increase ${rule.adjustmentPercent}%`;
            break;
          }
        }
        else if (rule.conditionType === 'Overstocked') {
          if (med.countInStock > (rule.thresholds.stockGreaterThan || 100)) {
            appliedRule = rule;
            reason = `Overstocked — discount to move inventory`;
            break;
          }
        }
      }

      if (appliedRule) {
        const suggestedPrice = med.price * (1 + (appliedRule.adjustmentPercent / 100));
        const impact = (suggestedPrice - med.price) * Math.min(med.countInStock, medVelocity.last30 || 10); // rough estimate
        
        suggestions.push({
          medicineId: med._id,
          name: med.name,
          image: med.image,
          currentPrice: med.price,
          suggestedPrice: Math.round(suggestedPrice * 100) / 100, // round to 2 decimals
          stock: med.countInStock,
          ruleName: appliedRule.ruleName,
          conditionType: appliedRule.conditionType,
          reason,
          potentialImpact: Math.round(impact)
        });
      } else if (Object.keys(velocity).length === 0) { // No sales data at all
         // Fallback if no sales data exists
      }
    });

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Error calculating pricing suggestions", error: err.message });
  }
});

// PATCH /api/medicines/:id/price (Moved from medicineRoutes or handled here for pricing engine)
router.patch('/apply/:medicineId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { newPrice } = req.body;
    if (!newPrice) return res.status(400).json({ message: "newPrice is required" });

    const med = await Medicine.findByIdAndUpdate(
      req.params.medicineId, 
      { price: newPrice },
      { new: true }
    );
    
    // In a real app, log to PriceChangeLog collection
    res.json({ message: "Price updated", medicine: med });
  } catch (err) {
    res.status(500).json({ message: "Error applying price", error: err.message });
  }
});

export default router;
