// server/controllers/ownerController.js
const db = require('../db');

// @desc    Get Owner's Store Dashboard (Average rating, list of reviewers)
// @route   GET /api/owner/dashboard
exports.getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // 1. Get the store owned by this user
    const storeResult = await db.query('SELECT * FROM stores WHERE owner_id = $1', [ownerId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found for this owner.' });
    }
    const store = storeResult.rows[0];

    // 2. Get the average rating
    const avgResult = await db.query('SELECT ROUND(AVG(rating_value), 1) as average_rating FROM ratings WHERE store_id = $1', [store.id]);
    const averageRating = avgResult.rows[0].average_rating || 0;

    // 3. Get the list of users who rated
    const ratingsResult = await db.query(
      `SELECT u.name, u.email, r.rating_value, r.comment, r.updated_at 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = $1 
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({
      storeName: store.name,
      averageRating: parseFloat(averageRating),
      totalRatings: ratingsResult.rows.length,
      ratings: ratingsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
