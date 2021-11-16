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
    deleteOwnProject,
    deleteJobSlot,
    updateJobSlot,
    addParticipant,
    removeParticipant
} from '../controllers/projectsController.js';
import auth from '../middlewares/authentication/auth.js'
import isAdmin from '../middlewares/authentication/isAdmin.js'
import isOwner from '../middlewares/projectMiddlewares/isOwner.js'
import uploadProjectImage from '../middlewares/uploadProjectImage.js'

router.route('/')
.get(auth, getAllProjects)
.post(auth, createProject);

router.route('/ownProjects')
.get(auth, isOwner, getOwnProjects);

router.route('/:id')
.get(auth, getProject)
.delete(auth, isAdmin, deleteProject);

// route to access to the detailes of each owned Project, update and delete also posible just by the owner.
router.route('/ownProjects/:id')
.get(auth, isOwner, getOwnProject)
.put(auth, isOwner, uploadProjectImage,updateOwnProject)
.delete(auth, isOwner, deleteOwnProject);


router.route('/ownProjects/:id/jobList/:jobListId')
.put(auth, isOwner, updateJobSlot)
.delete(auth, isOwner, deleteJobSlot)



// this route will add a participant to the subObject in the array of jobList  ( params needed: project's id, objects's id in the jobList and participant' id)
router.route('/ownProjects/:id/jobList/:jobListId/participant/:participantId')
.put(auth, isOwner, addParticipant)
.delete(auth, isOwner, removeParticipant)

export default router;