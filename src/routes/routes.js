import express from 'express';
import userRoutes from './route/auth.route.js';

const router = express.Router();

router.use('/api', userRoutes);

export default router;
