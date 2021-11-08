import express from 'express';
import { 
    getUsers,
    getUser, 
    updateUser,
    delUser
} from '../controllers/usersController.js';

import auth from '../middlewares/authentication/auth.js'
import uploadImage from '../middlewares/uploadImage.js'

const router = express.Router();

router.route('/')
.get(auth, getUsers);
router.route('/:id')
.get(auth, getUser).delete(auth, delUser).put(auth, uploadImage, updateUser);
                
export default router;