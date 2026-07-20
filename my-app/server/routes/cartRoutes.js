import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get or create the Cart document for the current user.
 */
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  } else {
    // Self-healing: filter out any legacy/corrupt items missing a valid productId to prevent validation failures on save
    const validItems = cart.items.filter(item => item.productId && mongoose.Types.ObjectId.isValid(item.productId));
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
  }
  return cart;
}

/**
 * Safe product ID resolver for both new and legacy cart items.
 */
function getProdIdStr(item) {
  const id = item.productId || item._id;
  return id ? id.toString() : '';
}

/**
 * Enrich cart items with live Medicine data (price, stock, image).
 * Items whose productId no longer exists in Medicine are dropped silently.
 */
async function enrichCartWithLiveData(cart) {
  const { default: Medicine } = await import('../models/Medicine.js');

  const enriched = await Promise.all(
    cart.items.map(async (item) => {
      let med;
      try {
        const pId = item.productId || item._id;
        if (!pId) return null;
        med = await Medicine.findById(pId).select(
          'name brand price discountPrice image countInStock needsRx isActive'
        );
      } catch (_) { return null; }

      if (!med) return null; // product deleted

      const livePrice = med.price;
      const liveDiscountPrice = med.discountPrice || null;
      const outOfStock = med.countInStock === 0 || !med.isActive;

      return {
        productId:     med._id,
        name:          med.name,
        brand:         med.brand,
        price:         livePrice,
        discountPrice: liveDiscountPrice,
        image:         med.image,
        needsRx:       med.needsRx,
        quantity:      item.quantity,
        countInStock:  med.countInStock,
        outOfStock,
        priceChanged:  item.price !== livePrice,
      };
    })
  );

  return enriched.filter(Boolean);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart with live product data joined
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = await enrichCartWithLiveData(cart);
    res.json({ items, lastActivityAt: cart.lastActivityAt, status: cart.status });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart (or increment qty if already present)
 * @access  Private
 */
router.post('/items', verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const { default: Medicine } = await import('../models/Medicine.js');
    const med = await Medicine.findById(productId).select(
      'name brand price discountPrice image countInStock needsRx isActive'
    );
    if (!med) return res.status(404).json({ message: 'Product not found' });
    if (!med.isActive || med.countInStock === 0) {
      return res.status(400).json({ message: `"${med.name}" is currently out of stock` });
    }

    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find(i => getProdIdStr(i) === productId.toString());

    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, med.countInStock);
      existing.quantity = newQty;
    } else {
      const safeQty = Math.min(quantity, med.countInStock);
      cart.items.push({
        productId: med._id,
        name:          med.name,
        brand:         med.brand,
        price:         med.price,
        discountPrice: med.discountPrice || undefined,
        image:         med.image,
        needsRx:       med.needsRx,
        quantity:      safeQty,
      });
    }

    await cart.save();
    const items = await enrichCartWithLiveData(cart);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
});

/**
 * @route   PATCH /api/cart/items/:productId
 * @desc    Update item quantity (enforces 1 ≤ qty ≤ countInStock)
 * @access  Private
 */
router.patch('/items/:productId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be ≥ 1' });
    }

    const { default: Medicine } = await import('../models/Medicine.js');
    const med = await Medicine.findById(productId).select('countInStock name');
    if (!med) return res.status(404).json({ message: 'Product not found' });

    if (quantity > med.countInStock) {
      return res.status(400).json({
        message: `Only ${med.countInStock} unit${med.countInStock !== 1 ? 's' : ''} of "${med.name}" available`,
        maxQty: med.countInStock,
      });
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find(i => getProdIdStr(i) === productId.toString());
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    await cart.save();
    const items = await enrichCartWithLiveData(cart);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quantity', error: err.message });
  }
});

/**
 * @route   DELETE /api/cart/items/:productId
 * @desc    Remove specific item from cart
 * @access  Private
 */
router.delete('/items/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    const before = cart.items.length;
    cart.items = cart.items.filter(i => getProdIdStr(i) !== productId.toString());
    if (cart.items.length === before) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    await cart.save();
    const items = await enrichCartWithLiveData(cart);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
});

/**
 * @route   POST /api/cart/validate
 * @desc    Re-check all cart items for stock/price accuracy
 *          Returns issues per item — called before checkout
 * @access  Private
 */
router.post('/validate', verifyToken, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const { default: Medicine } = await import('../models/Medicine.js');
    const issues = [];
    const enriched = [];

    for (const item of cart.items) {
      let med;
      const itemId = item.productId || item._id;
      try { med = await Medicine.findById(itemId).select('name price discountPrice countInStock isActive needsRx image brand'); }
      catch (_) { med = null; }

      if (!med) {
        issues.push({ productId: itemId, issue: 'not_found', name: item.name });
        continue;
      }

      const itemIssues = [];
      if (!med.isActive || med.countInStock === 0) itemIssues.push('out_of_stock');
      else if (med.countInStock < item.quantity) itemIssues.push('stock_reduced');
      if (med.price !== item.price) itemIssues.push('price_changed');

      if (itemIssues.length > 0) {
        issues.push({
          productId: itemId,
          name: med.name,
          issues: itemIssues,
          currentStock: med.countInStock,
          currentPrice: med.price,
          currentDiscountPrice: med.discountPrice,
        });
      }

      enriched.push({
        productId:     med._id,
        name:          med.name,
        brand:         med.brand,
        price:         med.price,
        discountPrice: med.discountPrice,
        image:         med.image,
        needsRx:       med.needsRx,
        quantity:      item.quantity,
        countInStock:  med.countInStock,
        outOfStock:    !med.isActive || med.countInStock === 0,
      });
    }

    res.json({ valid: issues.length === 0, issues, items: enriched });
  } catch (err) {
    res.status(500).json({ message: 'Cart validation failed', error: err.message });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart (called by Checkout after successful order)
 * @access  Private
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      cart.status = 'Recovered';
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
});

/**
 * @route   GET /api/cart/abandoned  (kept in abandonedCartRoutes.js — no conflict)
 * Legacy update endpoint — kept for backward compat with CartContext sync
 * @route   POST /api/cart/update
 */
router.post('/update', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    // Accept legacy format { productId, quantity } arrays
    if (Array.isArray(items)) {
      const { default: Medicine } = await import('../models/Medicine.js');
      const rebuilt = [];
      for (const i of items) {
        const id = i.productId || i._id;
        if (!id) continue;
        try {
          const med = await Medicine.findById(id).select('name brand price discountPrice image needsRx countInStock');
          if (med) rebuilt.push({
            productId: med._id, name: med.name, brand: med.brand,
            price: med.price, discountPrice: med.discountPrice || undefined,
            image: med.image, needsRx: med.needsRx,
            quantity: Math.min(i.quantity || 1, med.countInStock || 1),
          });
        } catch (_) {}
      }
      cart.items = rebuilt;
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error saving cart' });
  }
});

export default router;