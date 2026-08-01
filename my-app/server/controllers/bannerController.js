import Banner from '../models/Banner.js';

/**
 * Auto-scheduler helper to sync banner status based on startDate and endDate
 */
export const syncBannerStatuses = async () => {
  try {
    const now = new Date();

    // 1. Activate scheduled banners whose startDate has arrived
    await Banner.updateMany(
      {
        status: 'scheduled',
        startDate: { $lte: now },
        $or: [{ endDate: null }, { endDate: { $gt: now } }]
      },
      {
        $set: { status: 'active', isActive: true }
      }
    );

    // 2. Expire active or scheduled banners whose endDate has passed
    await Banner.updateMany(
      {
        status: { $in: ['active', 'scheduled'] },
        endDate: { $ne: null, $lte: now }
      },
      {
        $set: { status: 'expired', isActive: false }
      }
    );
  } catch (err) {
    console.error('Error in syncBannerStatuses background job:', err);
  }
};

// Periodic background job running every 60 seconds
setInterval(syncBannerStatuses, 60000);

/**
 * @desc    Get public active banners for customer pages
 * @route   GET /api/banners
 */
export const getPublicBanners = async (req, res) => {
  try {
    await syncBannerStatuses();

    const { placement, targetDevice, category, categorySlug } = req.query;
    const now = new Date();

    const query = {
      $or: [
        { status: 'active' },
        { isActive: true }
      ]
    };

    if (placement) {
      const placementArr = placement.split(',').map(p => p.trim());
      if (placementArr.length > 1) {
        query.$and = [{ $or: [{ placement: { $in: placementArr } }, { category: { $in: placementArr } }] }];
      } else {
        query.$or = [
          { placement: placement },
          { category: placement }
        ];
      }
    }

    if (targetDevice && targetDevice !== 'all') {
      query.targetDevice = { $in: ['both', targetDevice, undefined, null] };
    }

    const catParam = categorySlug || category;
    if (catParam) {
      query.$or = [
        { categorySlug: { $regex: new RegExp(catParam, 'i') } },
        { category: { $regex: new RegExp(catParam, 'i') } },
        { brand: { $regex: new RegExp(catParam, 'i') } }
      ];
    }

    // Direct no-cache header so newly published admin banners show up immediately
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    const banners = await Banner.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json(banners);
  } catch (error) {
    console.error('getPublicBanners error:', error);
    res.status(500).json({ message: 'Failed to fetch promotional banners', error: error.message });
  }
};

/**
 * @desc    Get all banners for Admin Dashboard with filtering
 * @route   GET /api/admin/banners
 */
export const getAdminBanners = async (req, res) => {
  try {
    await syncBannerStatuses();

    const { placement, status, targetDevice, search } = req.query;
    const query = {};

    if (placement && placement !== 'all') {
      query.$or = [{ placement: placement }, { category: placement }];
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query.$or = [{ status: 'active' }, { isActive: true }];
      } else if (status === 'inactive' || status === 'draft') {
        query.$or = [{ status: 'draft' }, { status: 'inactive' }, { isActive: false }];
      } else {
        query.status = status;
      }
    }

    if (targetDevice && targetDevice !== 'all') {
      query.targetDevice = { $in: ['both', targetDevice] };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { headline: searchRegex },
        { title: searchRegex },
        { subtext: searchRegex },
        { badgeText: searchRegex }
      ];
    }

    const banners = await Banner.find(query)
      .sort({ placement: 1, displayOrder: 1, createdAt: -1 });

    res.status(200).json(banners);
  } catch (error) {
    console.error('getAdminBanners error:', error);
    res.status(500).json({ message: 'Failed to fetch admin banners', error: error.message });
  }
};

/**
 * @desc    Get banner summary statistics for Admin strip
 * @route   GET /api/admin/stats/banners-summary
 */
export const getBannersSummaryStats = async (req, res) => {
  try {
    await syncBannerStatuses();

    const totalBanners = await Banner.countDocuments({});
    const activeBanners = await Banner.countDocuments({ status: 'active' });
    const scheduledBanners = await Banner.countDocuments({ status: 'scheduled' });
    const expiredBanners = await Banner.countDocuments({ status: 'expired' });
    const draftBanners = await Banner.countDocuments({ status: 'draft' });

    res.status(200).json({
      totalBanners,
      activeBanners,
      scheduledBanners,
      expiredBanners,
      draftBanners
    });
  } catch (error) {
    console.error('getBannersSummaryStats error:', error);
    res.status(500).json({ message: 'Failed to fetch banner summary stats', error: error.message });
  }
};

/**
 * @desc    Create a new banner
 * @route   POST /api/admin/banners
 */
export const createBanner = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data._id;
    delete data.id;

    if (data.startDate === '' || data.startDate === undefined) data.startDate = null;
    if (data.endDate === '' || data.endDate === undefined) data.endDate = null;

    const bannerName = data.name || data.headline || data.title;
    if (!bannerName) {
      return res.status(400).json({ message: 'Banner internal name or headline is required' });
    }

    // Auto-calculate next displayOrder for this placement if not provided
    let finalOrder = data.displayOrder;
    if (finalOrder === undefined || finalOrder === null || isNaN(finalOrder)) {
      const targetPlacement = data.placement || data.category || 'homepage-hero';
      const highestBanner = await Banner.findOne({ placement: targetPlacement })
        .sort({ displayOrder: -1 });
      finalOrder = highestBanner ? (highestBanner.displayOrder || 0) + 1 : 0;
    }

    const newBanner = new Banner({
      ...data,
      name: bannerName,
      headline: data.headline || data.title || bannerName,
      title: data.title || data.headline || bannerName,
      imageUrl: data.imageUrl || data.image || '',
      image: data.image || data.imageUrl || '',
      displayOrder: Number(finalOrder),
      createdBy: req.user?._id || req.user?.id || null
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error('createBanner error:', error);
    res.status(400).json({ message: 'Failed to create banner', error: error.message });
  }
};

/**
 * @desc    Update an existing banner
 * @route   PUT /api/admin/banners/:id OR PATCH /api/admin/banners/:id
 */
export const updateBanner = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.id;

    if (updateData.startDate === '' || updateData.startDate === undefined) updateData.startDate = null;
    if (updateData.endDate === '' || updateData.endDate === undefined) updateData.endDate = null;

    if (updateData.imageUrl) updateData.image = updateData.imageUrl;
    if (updateData.headline) updateData.title = updateData.headline;

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error('updateBanner error:', error);
    res.status(400).json({ message: 'Failed to update banner', error: error.message });
  }
};

/**
 * @desc    Delete a banner (with live protection)
 * @route   DELETE /api/admin/banners/:id
 */
export const deleteBanner = async (req, res) => {
  try {
    const { force } = req.query;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Protection check: block deletion if banner is live/active unless force=true
    if (banner.status === 'active' && force !== 'true') {
      return res.status(400).json({
        isLive: true,
        message: `Banner "${banner.name || banner.headline}" is currently live on the site. Deactivate it first or confirm force deletion.`
      });
    }

    await banner.deleteOne();
    res.status(200).json({ success: true, message: 'Banner removed successfully' });
  } catch (error) {
    console.error('deleteBanner error:', error);
    res.status(500).json({ message: 'Failed to delete banner', error: error.message });
  }
};

/**
 * @desc    Batch reorder display positions of banners
 * @route   PATCH /api/admin/banners/reorder
 */
export const reorderBanners = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, displayOrder }
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items array provided for reordering' });
    }

    const bulkOps = items.map((item, idx) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { displayOrder: item.displayOrder !== undefined ? Number(item.displayOrder) : idx } }
      }
    }));

    await Banner.bulkWrite(bulkOps);
    res.status(200).json({ success: true, message: 'Banner display orders updated successfully' });
  } catch (error) {
    console.error('reorderBanners error:', error);
    res.status(500).json({ message: 'Failed to reorder banners', error: error.message });
  }
};
