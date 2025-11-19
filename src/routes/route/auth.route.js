import express from 'express';
import { register, login, refresh } from '../../app/auth/user.controller.js';
import { authenticateToken, requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/register', authenticateToken, requireAdmin, register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);

export default router;
