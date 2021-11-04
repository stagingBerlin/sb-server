import express from 'express';
const router = express.Router();

import { 
    getAllProjects,
    getOwnProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject 
} from '../controllers/projectsController.js';
import auth from '../middlewares/authentication/auth.js'

router.route('/')
.get(auth, getAllProjects)
.post(auth, createProject);

router.route('/:id').get(auth, getProject);

router.route('/ownProjects').get(auth, getOwnProjects);


export default router;