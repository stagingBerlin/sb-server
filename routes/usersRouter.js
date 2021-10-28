import express from 'express';
import { 
    getUsers,
    getUser,
    createUser, 
    updateUser,
    delUser,
    loginUser
} from '../controllers/usersController.js';

const router = express.Router();

router.route('/')
.get(getUsers).post(createUser);
router.route('/:id')
.get(getUser).delete(delUser).put(updateUser);
router.route('/login').post(loginUser);


                
export default router;