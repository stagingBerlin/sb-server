import express from 'express';
const router = express.Router();

import { 
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} from '../controllers/jobsControllers.js';

// import auth from '../middlewares/authentication/auth.js'

// create admin middleware for this route

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).delete(deleteJob).put(updateJob);

export default router;