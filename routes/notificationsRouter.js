import express from 'express';
const router = express.Router();

import { createNotification, getUserNotifications } from '../controllers/notificationsControllers.js'
import auth from '../middlewares/authentication/auth.js'


router.route('/').get(auth, getUserNotifications).post(auth, createNotification);

export default router;