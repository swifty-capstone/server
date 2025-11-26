import express from 'express';
import { createOutingRequest, updateOutingRequest } from '../../app/outing/outing.controller.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /outing:
 *   post:
 *     summary: Create outing request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_time
 *               - end_time
 *               - reason
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T09:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T17:00:00Z"
 *               reason:
 *                 type: string
 *                 example: "병원 진료"
 *     responses:
 *       201:
 *         description: Outing request created successfully
 */
router.post('/outing', authenticateToken, createOutingRequest);

/**
 * @swagger
 * /outing/{id}:
 *   put:
 *     summary: Update outing request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Outing request updated successfully
 *       404:
 *         description: Outing request not found
 */
router.put('/outing/:id', authenticateToken, updateOutingRequest);

export default router;