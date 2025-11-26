import express from 'express';
import { register, login, refresh } from '../../app/auth/user.controller.js';
import { authenticateToken, requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - password
 *               - name
 *               - email
 *               - class
 *               - grade
 *             properties:
 *               student_id:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               class:
 *                 type: integer
 *               grade:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/auth/register', authenticateToken, requireAdmin, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - password
 *             properties:
 *               student_id:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/auth/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/auth/refresh', refresh);

export default router;