import createError from 'http-errors';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getAllProjects = async (req, res, next) => {
    try {
        const allProjects = await Project.find().sort('title')
        .populate('owner')
        .populate('jobList.participant')
        .populate({
            path: 'jobList', 
            populate: {
                path: 'job',
            },
        });
        res.json(allProjects)
    } catch (error) {
        next(error)
    }
}

export const getProject = async (req, res, next) => {
    const { id } = req.params
    try {
        const project = await Project.findById(id)
        .populate('owner')
        .populate('jobList.participant')
        .populate({
            path: 'jobList', 
            populate: {
                path: 'job',
            },
        });
        if(!project) throw new createError(404, `No project with id: ${id} was found.`);
        res.json(project)
    } catch (error) {
        next(error)
    }
}

export const createProject = async (req, res, next) => {
    try {
        const body = req.body;
        if(!body.title ) throw new createError(404, `Add a title`);
        if(!body.authorship ) throw new createError(404, `Add an authorship`);
        if(!body.description) throw new createError(404, `Add a description to this Job`);

        const data = { ...body, owner: req.user._id }
        const createdProject = await Project.create(data);
        
        await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { ownedProject: createdProject._id  } }, 
            { new: true } 
        )

        const populatedProject = await Project.findById(createdProject._id)
        .populate('owner')
        .populate('jobList.participant')
        .populate({
            path: 'jobList', 
            populate: {
                path: 'job',
            },
        });

    res.json(populatedProject);
    } catch (error) {
        next(error)
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) throw new createError(404, `No Job with _id:${id} can be found.`);
        res.json({ success: `Project ${deletedProject.title} with _id:${id} was deleted` });
    } catch (error) {
        next(error)
    }
}

// ************* Actions for User Owned Projects ********************

export const getOwnProjects = async (req, res, next) => {
    try {
        res.json(req.ownedProjects);
    } catch (error) {
        next(error)
    }
}

export const getOwnProject = async (req, res, next) => {
    try {
        res.json(req.project)
    } catch (error) {
        next(error)
    }
}

export const deleteOwnProject = async (req, res, next) => {
    const id = req.project._id;
    try {
        await User.findByIdAndUpdate(
            req.user._id, 
            { $pull: { ownedProject: id } })
            
        const deletedProject = await Project.findByIdAndDelete(id);
        if(!deletedProject) throw new createError(404, `No Project with _id:${id} can be found.`);
        res.json({ success: `Project: ${deletedProject.title} with _id:${id} was deleted` });   
    } catch (error) {
        next(error);
    }
}

export const updateOwnProject = async (req, res, next) => {
    const id = req.project._id;
    const newData = req.body
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id, 
            {
                ...newData, 
                $push: { images: req.cloudProjectUrl}
            }, 
            { new: true })
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job',
                },
            });

            if (!updatedProject) throw new createError(404, `No project with id:${id} can be found.`);  
            res.json(updatedProject)
        
    } catch (error) {
        next(error)
    }
}

// get job list of an especific projectToUpadte
export const getJobList = async  (req, res, next) => {
    const id = req.project._id;
    try {
        const jobList = req.project.jobList 
        if(jobList.length === 0) throw new createError(404, `This project is not offering jobs`);
        res.json(jobList)
        
    } catch (error) {
        next(error);
    }
}

export const addJob = async (req, res, next) => {
    const id = req.project._id;
    const newData = req.body
    try {
        if(newData.job === "" || !newData.job) throw new createError(404, `Add a Job`);
        if(newData.jobDescription === "" || !newData.jobDescription) throw new createError(404, `Add a job Description`);
        
        const addToJobList = await Project.findByIdAndUpdate(
            id, 
            { $push : { jobList: newData } },
            { new: true })
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job',
                }
            });

        if(!addToJobList) throw new createError(404, `No project with id: ${id} was found.`);
        res.json(addToJobList)
        
    } catch (error) {
        next(error)
    }
}

// remove a complete jobSlot in the jobList array

export const deleteJobSlot = async  (req, res, next) => {
    const { jobListId } = req.params
    try {
        const projectToUpadte = await Project.findById(req.project._id)
        projectToUpadte.toObject()

        const jobList = projectToUpadte.jobList
        const getObj = jobList.find(item => item._id.toString() === jobListId)
        let participantId;
        if( getObj.participant ) {
            participantId = getObj.participant.toString()
        }

        await Project.updateOne(
            {"jobList._id": jobListId}, 
            { $pull : { jobList : { _id: jobListId } } })

        const updated = await Project.findByIdAndUpdate(
            req.project._id,
            { $pull: { participants: participantId} },
            {new: true})
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job',
                },
            })
            .populate("participants");

        res.json(updated)
            
    } catch (error) {
        next(error);
    }
}


// update job || description in jobSlot in the jobList array
export const updateJobSlot = async (req, res, next) => {
    const { jobListId } = req.params
    const { job, jobDescription } = req.body
    try {
        await Project.updateOne(
            {"jobList._id": jobListId}, 
            { $set : { "jobList.$.job": job, "jobList.$.jobDescription": jobDescription } })

            const updated = await Project.findById(req.project._id)
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job'
                },
            })
            .populate("participants");
            res.json(updated)
    } catch (error) {
        next(error);
    }
}

// controller to add a participant to the subObject in the array of jobList 
export const addParticipant = async (req, res, next) => {
    const { jobListId, participantId } = req.params
    try {
        console.log(participantId);
        await Project.updateOne(
            {"jobList._id": jobListId}, 
            { $set : { "jobList.$.participant" : participantId } })

        const updated = await Project.findByIdAndUpdate(
            req.project._id,
            { $push: { participants: participantId} },
            {new: true})
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job',
                },
            })
            .populate("participants");

        // const updated = await Project.findByIdAndUpdate(
        //     req.project._id,
        //     { participants: []},
        //     {new: true})
        res.json(updated);
    } catch (error) {
        next(error)
    }
}

export const removeParticipant = async (req, res, next) => {
    const { jobListId, participantId } = req.params
    try {
        let findProject = await Project.findOne({"jobList._id": jobListId});
        findProject = findProject.toObject()
                    
        const filtered = findProject.jobList.find(item => 
            item._id.toString() === jobListId);

        if(!filtered.hasOwnProperty('participant') ) throw new createError(404, `No participant for this job`);
        
        delete filtered.participant
        
        const updated = findProject.jobList.map(item => 
            item._id.toString() === filtered._id.toString() ?
            filtered
            :
            item)

        const dbUpdated = await Project.findByIdAndUpdate(
            req.project._id, 
            {
                $set : { jobList : updated },
                $pull: {participants: participantId} 
            },
            { new: true } )
            .populate('owner')
            .populate('jobList.participant')
            .populate({
                path: 'jobList', 
                populate: {
                    path: 'job'
                },
            })
            .populate("participants");

        res.json(dbUpdated)
    } catch (error) {
        next(error);
    }
}
