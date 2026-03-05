import Medicine from '../models/Medicine.js';

// @desc    Get all medicines (supports Search & Category)
export const getMedicines = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const medicines = await Medicine.find(query).sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medicines" });
  }
};

// @desc    Get Related Medicines (Similar Products Logic)
export const getRelatedMedicines = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    // Finds items in the same category, excluding the current one
    const related = await Medicine.find({
      category: medicine.category,
      _id: { $ne: medicine._id }
    }).limit(5);

    res.status(200).json(related || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching related items" });
  }
};

// @desc    Get Top Rated Medicines
export const getTopMedicines = async (req, res) => {
  try {
    let medicines = await Medicine.find({ rating: { $gte: 4 } }).sort({ rating: -1 }).limit(5);
    if (!medicines || medicines.length === 0) {
      medicines = await Medicine.find({}).sort({ createdAt: -1 }).limit(5);
    }
    res.status(200).json(medicines || []);
  } catch (error) {
    res.status(200).json([]);
  }
};

// @desc    Get single medicine details
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format" });
  }
};

// --- ADMIN FUNCTIONS ---
export const addMedicine = async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(400).json({ message: "Error adding medicine" });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const createMedicineReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (medicine) {
      const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
      medicine.reviews.push(review);
      medicine.numReviews = medicine.reviews.length;
      medicine.rating = medicine.reviews.reduce((acc, item) => item.rating + acc, 0) / medicine.reviews.length;
      await medicine.save();
      res.status(201).json({ message: "Review added" });
    }
  } catch (error) {
    res.status(500).json({ message: "Review failed" });
  }
};