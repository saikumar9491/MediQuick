import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DeliveryZone from './models/DeliveryZone.js';
import Hub from './models/Hub.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediquick';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // 1. Get current zones
    let zones = await DeliveryZone.find({});
    console.log(`📊 Found ${zones.length} Delivery Zones in the database.`);

    if (zones.length === 0) {
      console.log('✏️ Creating default Delivery Zones...');
      const defaultZones = [
        { name: 'Delhi Central', pincodes: ['110001', '110002', '110003'], estimatedDeliveryTime: 30, deliveryFee: 0 },
        { name: 'Mumbai West', pincodes: ['400001', '400002'], estimatedDeliveryTime: 45, deliveryFee: 49 },
        { name: 'Amritsar Core', pincodes: ['143001', '143002'], estimatedDeliveryTime: 15, deliveryFee: 0 }
      ];
      zones = await DeliveryZone.insertMany(defaultZones);
      console.log(`✅ Created ${zones.length} default Delivery Zones.`);
    }

    // 2. Count current hubs
    const existingHubs = await Hub.find({});
    console.log(`📊 Found ${existingHubs.length} Fulfillment Hubs in the database.`);

    if (existingHubs.length === 0) {
      console.log('✏️ Creating default Fulfillment Hubs...');
      
      const delhiZone = zones.find(z => z.name === 'Delhi Central');
      const mumbaiZone = zones.find(z => z.name === 'Mumbai West');
      const amritsarZone = zones.find(z => z.name === 'Amritsar Core');

      const defaultHubs = [
        {
          name: 'New Delhi Dispatch Center',
          address: 'Block E, Connaught Place, New Delhi, Delhi 110001',
          latitude: 28.6304,
          longitude: 77.2177,
          operatingHours: { open: '08:00', close: '23:00' },
          orderCutoffTime: '18:00',
          servedZones: delhiZone ? [delhiZone._id] : [],
          isActive: true
        },
        {
          name: 'Mumbai Central Warehouse',
          address: 'Nariman Point, Mumbai, Maharashtra 400021',
          latitude: 18.9268,
          longitude: 72.8231,
          operatingHours: { open: '09:00', close: '22:00' },
          orderCutoffTime: '15:00',
          servedZones: mumbaiZone ? [mumbaiZone._id] : [],
          isActive: true
        },
        {
          name: 'Amritsar Golden Gate Hub',
          address: 'G.T. Road, Amritsar, Punjab 143001',
          latitude: 31.6340,
          longitude: 74.8723,
          operatingHours: { open: '07:00', close: '23:30' },
          orderCutoffTime: '17:00',
          servedZones: amritsarZone ? [amritsarZone._id] : [],
          isActive: true
        }
      ];

      await Hub.insertMany(defaultHubs);
      console.log('✅ Created default Fulfillment Hubs.');
    }

    // Print final counts
    const finalHubs = await Hub.find({}).populate('servedZones');
    const finalZones = await DeliveryZone.find({});
    console.log(`\n🎉 Verification Completed Successfully:`);
    console.log(`👉 Total Zones: ${finalZones.length}`);
    console.log(`👉 Total Hubs: ${finalHubs.length}`);
    
    // Simulate one estimate calculation for pincode 110001
    const testPincode = '110001';
    const zone = finalZones.find(z => z.pincodes.includes(testPincode));
    if (zone) {
      const hub = finalHubs.find(h => h.servedZones.some(sz => sz._id.toString() === zone._id.toString()));
      if (hub) {
        console.log(`\n🗺️ End-to-End Delivery Estimate Simulation for Pincode: ${testPincode}`);
        console.log(`- Assigned Zone: ${zone.name} (Transit ETA: ${zone.estimatedDeliveryTime} mins)`);
        console.log(`- Assigned Hub: ${hub.name} (Operating hours: ${hub.operatingHours.open}-${hub.operatingHours.close}, Cutoff: ${hub.orderCutoffTime})`);
        
        const now = new Date();
        const [cutoffHour, cutoffMinute] = hub.orderCutoffTime.split(':').map(Number);
        const cutoffTime = new Date(now);
        cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0);
        
        const isPastCutoff = now > cutoffTime;
        const estDate = new Date();
        if (isPastCutoff) {
          estDate.setDate(estDate.getDate() + 1);
        }
        
        console.log(`- Current Server Time: ${now.toLocaleTimeString()}`);
        console.log(`- Order Cutoff Time: ${cutoffTime.toLocaleTimeString()}`);
        console.log(`- Status: ${isPastCutoff ? 'Past Cutoff (Dispatches Tomorrow)' : 'Before Cutoff (Dispatches Today)'}`);
        console.log(`- Estimated Delivery Date: ${estDate.toDateString()}`);
      }
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
