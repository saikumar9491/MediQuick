import express from 'express';
import DeliveryZone from '../models/DeliveryZone.js';
import Hub from '../models/Hub.js';

const router = express.Router();

router.get('/estimate', async (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }

    // 1. Find DeliveryZone for this pincode
    const zone = await DeliveryZone.findOne({ pincodes: pincode, isActive: true });
    
    if (!zone) {
      return res.json({
        isServiceable: false,
        message: 'Delivery not available in your area.'
      });
    }

    // 2. Find nearest Hub serving this zone
    const hub = await Hub.findOne({ servedZones: zone._id, isActive: true });

    if (!hub) {
      return res.json({
        isServiceable: false,
        message: 'Delivery not available in your area.'
      });
    }

    // 3. Calculate Cutoff Time and Delivery Date
    const now = new Date();
    const [cutoffHour, cutoffMinute] = hub.orderCutoffTime.split(':').map(Number);
    
    // Create a Date object for today's cutoff time
    const cutoffTime = new Date(now);
    cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0);
    
    let isPastCutoff = now > cutoffTime;
    
    // If it's already past cutoff, the "next" cutoff is tomorrow
    let nextCutoffTime = new Date(cutoffTime);
    if (isPastCutoff) {
      nextCutoffTime.setDate(nextCutoffTime.getDate() + 1);
    }
    
    const cutoffCountdownMs = nextCutoffTime.getTime() - now.getTime();
    
    // Estimate delivery date
    // Zone transit time (in minutes) - convert to days (approximate)
    // Most zones are local, so transit time is usually < 24h.
    // If ordered before cutoff -> dispatched today.
    // If ordered after cutoff -> dispatched tomorrow.
    const transitDays = Math.ceil(zone.estimatedDeliveryTime / (24 * 60)); // e.g., 60 mins -> 1 day (same day)
    
    const dispatchDate = new Date(now);
    if (isPastCutoff) {
      dispatchDate.setDate(dispatchDate.getDate() + 1);
    }

    const estimatedDeliveryDate = new Date(dispatchDate);
    // If transitDays is 0 or 1, it might be today or tomorrow
    if (transitDays > 1) {
       estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + transitDays - 1);
    }

    // Determine string label (e.g. "Tomorrow", "Today", or "Oct 24")
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = now.toDateString();
    const tomorrowStr = tomorrow.toDateString();
    const estStr = estimatedDeliveryDate.toDateString();

    let deliveryDateString = estimatedDeliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (estStr === todayStr) {
      deliveryDateString = 'Today';
    } else if (estStr === tomorrowStr) {
      deliveryDateString = 'Tomorrow';
    }

    res.json({
      isServiceable: true,
      hubId: hub._id,
      hubName: hub.name,
      deliveryDateString,
      cutoffCountdownMs,
      cutoffTime: nextCutoffTime.toISOString()
    });

  } catch (error) {
    res.status(500).json({ message: 'Error estimating delivery', error: error.message });
  }
});

export default router;
