const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');
const { updateRoleValidator } = require('../validators/userValidators');

router.get('/', auth, rbac('admin'), getAllUsers);
router.get('/:id', auth, rbac('admin'), getUserById);
router.patch('/:id/role', auth, rbac('admin'), updateRoleValidator, updateUserRole);
router.patch('/:id/status', auth, rbac('admin'), updateUserStatus);
router.delete('/:id', auth, rbac('admin'), deleteUser);
module.exports = router;