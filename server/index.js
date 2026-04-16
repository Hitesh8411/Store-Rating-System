const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Controllers
const authController = require('./controllers/authController');
const adminController = require('./controllers/adminController');
const userController = require('./controllers/userController');
const ownerController = require('./controllers/ownerController');
const { protect, authorize } = require('./middleware/authMiddleware');

// Auth Routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.put('/api/auth/update-password', protect, authController.updatePassword);

// Admin Routes (Gated by 'admin' role)
app.use('/api/admin', protect, authorize('admin'));
app.get('/api/admin/stats', adminController.getStats);
app.post('/api/admin/stores', adminController.addStore);
app.get('/api/admin/stores', adminController.getStores);
app.post('/api/admin/users', adminController.addUserByAdmin);
app.get('/api/admin/users', adminController.getUsers);

// User Routes (Gated by 'user' role)
app.use('/api/user', protect, authorize('user'));
app.get('/api/user/stores', userController.getStoresForUser);
app.post('/api/user/ratings', userController.submitRating);

// Owner Routes (Gated by 'owner' role)
app.use('/api/owner', protect, authorize('owner'));
app.get('/api/owner/dashboard', ownerController.getOwnerDashboard);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'server is breathing' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Forest floor listening on port ${PORT}`);
});
