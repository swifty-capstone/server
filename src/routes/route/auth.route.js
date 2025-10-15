import express from 'express';
import { register } from '../../app/auth/user.controller.js';

const router = express.Router();

router.post('/auth/register', register);

export default router;
