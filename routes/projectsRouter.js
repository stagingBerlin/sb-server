import express from 'express';
const router = express.Router();

import { 
    getAllProjects,
    getProject,
    createProject,
    deleteProject, 
    getOwnProjects,
    getOwnProject,
    updateOwnProject,
    deleteOwnProject
} from '../controllers/projectsController.js';
import auth from '../middlewares/authentication/auth.js'
import isAdmin from '../middlewares/authentication/isAdmin.js'
import isOwner from '../middlewares/projectMiddlewares/isOwner.js'


router.route('/')
.get(auth, getAllProjects)
.post(auth, createProject);

router.route('/ownProjects')
.get(auth, getOwnProjects);

router.route('/:id')
.get(auth, getProject)
.delete(auth, isAdmin, deleteProject);

router.route('/ownProjects/:id')
.get(auth, isOwner, getOwnProject)
.put(auth, isOwner, updateOwnProject)
.delete(auth, isOwner, deleteOwnProject);



export default router;