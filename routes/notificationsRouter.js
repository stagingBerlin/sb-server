import express from 'express';
const router = express.Router();

import { createNotification, getUserNotifications, updateNotification } from '../controllers/notificationsControllers.js'
import auth from '../middlewares/authentication/auth.js'


router.route('/').get(auth, getUserNotifications).post(auth, createNotification);
router.route('/:id').put(auth, updateNotification)

export default router;