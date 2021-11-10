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

router.route('/ownProjects').get(auth, getOwnProjects);
router.route('/:id').get(auth, getProject);

export default router;