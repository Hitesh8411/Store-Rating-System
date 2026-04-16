// server/controllers/adminController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const { validateStoreInput, validateUserInput } = require('../utils/validation');

// Helper for dynamic filtering and sorting
const handleListings = (baseQuery, params, allowedSortFields, searchFields) => {
  let { search, sortBy, order, offset = 0, limit = 50 } = params;
  let query = baseQuery;
  const values = [];

  // 1. Filtering (Dynamic fields)
  if (search && searchFields && searchFields.length > 0) {
    values.push(`%${search}%`);
    const searchConditions = searchFields.map(field => `${field} ILIKE $1`).join(' OR ');
    query += ` AND (${searchConditions})`;
  }

  // 2. Sorting
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : allowedSortFields[0];
  const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  query += ` ORDER BY ${sortField} ${sortOrder}`;

  // 3. Pagination
  query += ` LIMIT ${limit} OFFSET ${offset}`;

  return { query, values };
};

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const storeCount = await db.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await db.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalStores: parseInt(storeCount.rows[0].count),
      totalRatings: parseInt(ratingCount.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add New Store
// @route   POST /api/admin/stores
exports.addStore = async (req, res) => {
  const { name, email, address, ownerEmail } = req.body;
  const errors = validateStoreInput({ name, email, address, ownerEmail });

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  try {
    // 1. Find the owner by email (must exist and be role 'owner')
    const ownerResult = await db.query('SELECT id FROM users WHERE email = $1 AND role = $2', [ownerEmail, 'owner']);
    if (ownerResult.rows.length === 0) {
      return res.status(400).json({ message: 'Owner does not exist or role is not correct.' });
    }
    const ownerId = ownerResult.rows[0].id;

    // 2. Insert store
    await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add New User (Admin, User, Owner)
// @route   POST /api/admin/users
exports.addUserByAdmin = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const errors = validateUserInput(
    { name, email, password, address, role },
    { allowedRoles: ['admin', 'user', 'owner'] }
  );

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors });
  }

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get list of Stores with Average Rating
// @route   GET /api/admin/stores
exports.getStores = async (req, res) => {
  try {
    const { search, sortBy, order, offset = 0, limit = 50 } = req.query;
    const allowedSortFields = ['name', 'email', 'address', 'overall_rating'];
    const values = [];
    let query = `
      SELECT s.*, COALESCE(ROUND(AVG(r.rating_value), 1), 0) as overall_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (s.name ILIKE $1 OR s.email ILIKE $1 OR s.address ILIKE $1)`;
    }

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` GROUP BY s.id ORDER BY ${sortField} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get list of Users (including Owners with Store Rating)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  const baseQuery = `
    SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
           (SELECT ROUND(AVG(rt.rating_value), 1) FROM ratings rt JOIN stores st ON rt.store_id = st.id WHERE st.owner_id = u.id) as store_rating
    FROM users u
    WHERE 1=1
  `;
  const { query, values } = handleListings(
    baseQuery, 
    req.query, 
    ['name', 'email', 'address', 'role', 'created_at'],
    ['u.name', 'u.email', 'u.address', 'u.role']
  );

  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
