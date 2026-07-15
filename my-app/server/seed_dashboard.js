import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Setting from './models/Setting.js';
import bcrypt from 'bcryptjs';

const seedDashboard = async () => {
  try {
    console.log("⏳ Initializing database connection...");
    await connectDB();

    console.log("🧹 Cleaning old dashboard collections (Orders, Coupons, Settings)...");
    await Order.deleteMany({});
    await Coupon.deleteMany({});
    await Setting.deleteMany({});

    // 1. Fetch some medicines to use as order items
    console.log("🔍 Fetching medicines...");
    const medicines = await Medicine.find().limit(10);
    if (medicines.length === 0) {
      console.log("⚠️ No medicines found in database. Please run npm run seed first!");
      process.exit(1);
    }

    // 2. Create or find mock users
    console.log("👤 Creating mock customers...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Let's check if the admin user exists
    let admin = await User.findOne({ email: "admin@mediquick.com" });
    if (!admin) {
      admin = new User({
        name: "System Admin",
        email: "admin@mediquick.com",
        phone: "9876543210",
        password: hashedPassword,
        isAdmin: true,
        role: "Super Admin",
        isVerified: true
      });
      await admin.save();
      console.log("✅ Admin user created: admin@mediquick.com (password123)");
    } else {
      admin.role = "Super Admin";
      admin.isAdmin = true;
      await admin.save();
      console.log("✅ Admin role configured as Super Admin");
    }

    // Normal customer list
    const customerData = [
      { name: "John Doe", email: "john@example.com", phone: "9876500001", role: "Admin", loyaltyPoints: 340, walletBalance: 1200 },
      { name: "Jane Smith", email: "jane@example.com", phone: "9876500002", role: "Admin", loyaltyPoints: 120, walletBalance: 450 },
      { name: "Alice Johnson", email: "alice@example.com", phone: "9876500003", role: "Manager", loyaltyPoints: 80, walletBalance: 0 },
      { name: "Bob Brown", email: "bob@example.com", phone: "9876500004", role: "Warehouse Staff", loyaltyPoints: 15, walletBalance: 200 }
    ];

    const customers = [];
    for (const c of customerData) {
      let u = await User.findOne({ email: c.email });
      if (!u) {
        u = new User({
          name: c.name,
          email: c.email,
          phone: c.phone,
          password: hashedPassword,
          isAdmin: false,
          role: c.role,
          loyaltyPoints: c.loyaltyPoints,
          walletBalance: c.walletBalance,
          isVerified: true
        });
        await u.save();
      } else {
        u.role = c.role;
        u.loyaltyPoints = c.loyaltyPoints;
        u.walletBalance = c.walletBalance;
        await u.save();
      }
      customers.push(u);
    }
    console.log(`✅ ${customers.length} normal customers prepared`);

    // 3. Seed Coupons
    console.log("🎟 Seeding coupons...");
    const coupons = [
      { code: "WELCOME10", discount: 10, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "HEALTH20", discount: 20, expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "FREESHIP", discount: 5, expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), isActive: false },
      { code: "SUPER30", discount: 30, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true }
    ];
    await Coupon.insertMany(coupons);
    console.log("✅ Coupons inserted");

    // 4. Seed Settings
    console.log("⚙ Seeding settings...");
    const settings = new Setting({
      storeName: "MediQuick+ Amritsar",
      logo: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
      shippingCharges: 50,
      tax: 18,
      paymentGateway: "Razorpay",
      emailSettings: {
        smtpServer: "smtp-brevo.com",
        smtpPort: 587,
        senderEmail: "admin@mediquick.com"
      }
    });
    await settings.save();
    console.log("✅ Store settings inserted");

    // 5. Seed Reviews, SKUs, tags, and variants on medicines
    console.log("⭐ Seeding product reviews & variants...");
    const comments = [
      "Excellent product! Very effective.",
      "Good packaging, quick delivery.",
      "Fair price and high quality.",
      "Highly recommend this medicine.",
      "Average performance, but okay.",
      "Perfect for regular health monitoring."
    ];
    const ratings = [5, 5, 4, 5, 3, 4];

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      med.reviews = [];
      med.sku = `MQ-${med.name.slice(0,3).toUpperCase()}-${100 + i}`;
      med.tags = [med.category.toLowerCase(), med.brand.toLowerCase(), 'healthcare'];

      med.variants = [
        { size: "Standard Pack", weight: "50g", price: med.price, countInStock: med.countInStock },
        { size: "Bulk Pack", weight: "150g", price: Math.round(med.price * 2.5), countInStock: Math.max(10, med.countInStock - 10) }
      ];

      const count = Math.floor(Math.random() * 2) + 1;
      for (let r = 0; r < count; r++) {
        const randCust = customers[Math.floor(Math.random() * customers.length)];
        const randIdx = Math.floor(Math.random() * comments.length);
        med.reviews.push({
          name: randCust.name,
          rating: ratings[randIdx],
          comment: comments[randIdx],
          user: randCust._id,
          isApproved: Math.random() > 0.15
        });
      }
      
      const approved = med.reviews.filter(r => r.isApproved);
      med.numReviews = approved.length;
      med.rating = approved.length > 0 ? (approved.reduce((acc, r) => r.rating + acc, 0) / approved.length) : 0;
      await med.save();
    }
    console.log("✅ Product reviews, variants, and SKUs updated");

    // 6. Seed Orders over a 30-day range
    console.log("🛒 Seeding orders...");
    const statuses = ["Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    const statusWeights = [0.1, 0.2, 0.1, 0.55, 0.05];

    const selectStatus = () => {
      const r = Math.random();
      let sum = 0;
      for (let i = 0; i < statuses.length; i++) {
        sum += statusWeights[i];
        if (r <= sum) return statuses[i];
      }
      return "Delivered";
    };

    const ordersToInsert = [];
    const now = new Date();

    for (let d = 30; d >= 0; d--) {
      const dailyOrderCount = Math.floor(Math.random() * 3);
      
      for (let count = 0; count < dailyOrderCount; count++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const orderStatus = selectStatus();
        const orderDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000));
        
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalAmount = 0;

        const shuffled = [...medicines].sort(() => 0.5 - Math.random());
        for (let itemIdx = 0; itemIdx < itemCount; itemIdx++) {
          const med = shuffled[itemIdx];
          const qty = Math.floor(Math.random() * 2) + 1;
          items.push({
            productId: med._id,
            name: med.name,
            price: med.price,
            quantity: qty,
            image: med.image,
            brand: med.brand
          });
          totalAmount += med.price * qty;
        }

        const taxAmount = Math.round(totalAmount * 0.18);
        const shippingAmount = totalAmount > 500 ? 0 : 50;
        const finalTotal = totalAmount + taxAmount + shippingAmount;

        const isDelivered = orderStatus === 'Delivered';
        const isShipped = orderStatus === 'Shipped';
        const isReturned = orderStatus === 'Cancelled' && Math.random() > 0.5;

        ordersToInsert.push({
          userId: customer._id,
          items,
          totalAmount: finalTotal,
          shippingAddress: {
            pincode: "143001",
            building: `Bld #${Math.floor(Math.random() * 100) + 1}, Ranjit Avenue`,
            area: "Main Block, Amritsar"
          },
          paymentMethod: Math.random() > 0.3 ? "Razorpay" : "Cash on Delivery",
          status: orderStatus,
          assignedAgent: (isDelivered || isShipped) ? ["Amit Sharma", "Rohan Verma", "Simran Kaur"][Math.floor(Math.random() * 3)] : undefined,
          isReturnRequested: isReturned,
          returnReason: isReturned ? "Incorrect medicine variant delivered" : undefined,
          createdAt: orderDate,
          updatedAt: orderDate
        });
      }
    }

    const seededOrders = await Order.insertMany(ordersToInsert);
    console.log(`✅ ${seededOrders.length} orders seeded successfully!`);

    // 7. Update User orders array
    for (const customer of customers) {
      const userOrders = seededOrders.filter(o => o.userId.toString() === customer._id.toString());
      customer.orders = userOrders.map(o => o._id);
      await customer.save();
    }
    console.log("✅ Customer orders links established");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed cleanly");
    console.log("🎉 Seeding complete! Dashboard is ready.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Dashboard seeding failed:", err.message);
    process.exit(1);
  }
};

seedDashboard();
