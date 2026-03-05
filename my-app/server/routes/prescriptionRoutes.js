import express from 'express';
import Medicine from '../models/Medicine.js'; 
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists to prevent server crashes
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// Route must match exactly what frontend calls
router.post('/scan-and-check', upload.single('prescription'), async (req, res) => {
  try {
    // 1. SIMULATED AI OCR
    // We pretend the image contains "Dolo 650" for testing. 
    // Ensure "Dolo 650" is in your MongoDB.
    const detectedName = "Dolo 650"; 

    // 2. Query MongoDB inventory
    const product = await Medicine.findOne({ 
      name: { $regex: detectedName, $options: 'i' } 
    });

    if (product) {
      res.status(200).json({
        medicineName: detectedName,
        foundProduct: product,
        status: "available"
      });
    } else {
      res.status(200).json({
        medicineName: detectedName,
        foundProduct: null,
        status: "out_of_stock"
      });
    }
  } catch (error) {
    console.error("Scan Error:", error);
    res.status(500).json({ message: "Server error during scan" });
  }
});

export default router;