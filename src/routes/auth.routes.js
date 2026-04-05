import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema } from '../utils/validators.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', validate(loginSchema), login);

export default router;