import express from 'express';
import userRoutes from './route/auth.route.js';
import outingRoutes from './route/outing.route.js';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', outingRoutes);

export default router;
