import express from 'express';
import { 
    getUsers,
    getUser,
    createUser, 
    updateUser,
    delUser,
    loginUser
} from '../controllers/usersController';

const router = express.Router();

router.route('/').get(getUsers)
                .post(createUser);

router.route('/login').post(loginUser);

router.route(':id').get(getUser).delete(delUser).put(updateUser);
                

export default router;






export default router;