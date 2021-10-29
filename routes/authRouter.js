import express from 'express';
const router = express.Router();
import { login, signup, logout, verifyCookie } from '../controllers/authControllers.js';
import uploadImage from '../middlewares/uploadImage.js'
import {
  signupRules,
  loginRules,
  userValidationErrorHandling,
  generateUsername
} from '../middlewares/validation/authValidation.js';

import auth from '../middlewares/authentication/auth.js'

router.route('/signup').post(
  signupRules(),
  userValidationErrorHandling,
  uploadImage,
  generateUsername,
  signup
);

router.route('/login').post(loginRules(), userValidationErrorHandling, login);
router.route('/logout').post(logout);

router.route('/verify').post(auth, verifyCookie)

export default router;