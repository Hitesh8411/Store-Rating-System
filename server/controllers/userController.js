// server/controllers/userController.js
const db = require('../db');

// @desc    Get all stores with User's specific rating
// @route   GET /api/user/stores
exports.getStoresForUser = async (req, res) => {
  const userId = req.user.id;
  const { search } = req.query;

  let query = `
    SELECT s.id, s.name, s.email, s.address,
           COALESCE(ROUND(AVG(r_all.rating_value), 1), 0) as overall_rating,
           r_user.rating_value as user_rating,
           r_user.comment as user_comment
    FROM stores s
    LEFT JOIN ratings r_all ON s.id = r_all.store_id
    LEFT JOIN ratings r_user ON s.id = r_user.store_id AND r_user.user_id = $1
    WHERE 1=1
  `;
  const values = [userId];

  if (search) {
    values.push(`%${search}%`);
    query += ` AND (s.name ILIKE $2 OR s.address ILIKE $2 OR s.email ILIKE $2)`;
  }

  query += ` GROUP BY s.id, r_user.rating_value, r_user.comment ORDER BY s.name ASC`;

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit or Update Rating
// @route   POST /api/user/ratings
exports.submitRating = async (req, res) => {
  const { storeId, ratingValue, comment } = req.body;
  const userId = req.user.id;

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Upsert rating (Conflict on UNIQUE user_id, store_id)
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating_value, comment) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating_value = EXCLUDED.rating_value, comment = EXCLUDED.comment, updated_at = NOW()`,
      [userId, storeId, ratingValue, comment]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
