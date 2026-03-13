import express from 'express';
import Medicine from '../models/Medicine.js'; 
import multer from 'multer';
import fs from 'fs';
import { verifyToken } from '../middleware/authMiddleware.js'; // Ensure privacy

const router = express.Router();

// 1. IMPROVED STORAGE CONFIGURATION
// diskStorage allows us to keep the original file extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/prescriptions/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed!'), false);
        }
    }
});

/**
 * @route   POST /api/prescriptions/scan-and-check
 * @desc    Upload prescription, "Scan" for medicine, and check inventory
 */
router.post('/scan-and-check', verifyToken, upload.single('prescription'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 2. SIMULATED AI OCR LOGIC
        // In a real app, you'd send req.file.path to Tesseract.js or Google Vision API here.
        const detectedName = "Dolo 650"; 

        // 3. QUERY MONGODB INVENTORY
        const product = await Medicine.findOne({ 
            name: { $regex: detectedName, $options: 'i' } 
        });

        // 4. CLEANUP (Optional)
        // If you don't want to keep the file after scanning, uncomment below:
        // fs.unlinkSync(req.file.path);

        if (product) {
            res.status(200).json({
                medicineName: detectedName,
                foundProduct: product,
                status: "available",
                message: `Success! We found ${detectedName} in our inventory.`
            });
        } else {
            res.status(200).json({
                medicineName: detectedName,
                foundProduct: null,
                status: "out_of_stock",
                message: `${detectedName} was detected but is currently unavailable.`
            });
        }
    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ message: "Server error during scan", error: error.message });
    }
});

export default router;