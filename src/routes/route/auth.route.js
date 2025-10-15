import express from 'express';
import { register, updateUsername, getUserInfo } from '../../app/auth/user.controller.js';

const router = express.Router();

router.post('/user/register', register);
router.patch('/user/:userId', updateUsername);
router.get('/user/:userId', getUserInfo);

export default router;
