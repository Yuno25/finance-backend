const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends
} = require('../controllers/dashboardController');

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', auth, rbac('admin', 'analyst', 'viewer'), getSummary);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get totals grouped by category
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Category wise totals
 */
router.get('/categories', auth, rbac('admin', 'analyst', 'viewer'), getCategoryTotals);

/**
 * @swagger
 * /api/dashboard/trends/monthly:
 *   get:
 *     summary: Get monthly income and expense trends
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly trends
 */
router.get('/trends/monthly', auth, rbac('admin', 'analyst', 'viewer'), getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/trends/weekly:
 *   get:
 *     summary: Get weekly income and expense trends
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Weekly trends
 */
router.get('/trends/weekly', auth, rbac('admin', 'analyst', 'viewer'), getWeeklyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get 10 most recent financial records
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recent activity
 */
router.get('/recent', auth, rbac('admin', 'analyst', 'viewer'), getRecentActivity);

module.exports = router;