import createError from 'http-errors';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const getAllProjects = async (req, res, next) => {
    try {
        const allProjects = await Project.find().sort('title')
        res.send(allProjects)
    } catch (error) {
        next(error)
    }
}

export const getOwnProjects = async (req, res, next) => {
    try {
        const ownedProjecs = await Project.find({ contact: req.user._id }).sort('title')
        res.json(ownedProjecs)
    } catch (error) {
        next(error)
    }
}

export const getProject = async (req, res, next) => {
    const { id } = req.params
    try {
        const project = await Project.findById(id);
        if(!project) throw new createError(404, `No project with id: ${id} was found.`);
        res.json(project)
    } catch (error) {
        next(error)
    }
}

export const createProject = async (req, res, next) => {
    try {
        const body = req.body;
        const data = { ...body, owner: req.user._id}
        const createdProject = await Project.create(data)
        
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {ownedProject:[{project: createdProject._id}]}, {new: true} )

        // console.log(updatedUser);

        const populatedProject = await Project.findById(createdProject._id)
        .populate("owner")
        .populate("jobList.jobTitle")
        .populate("participants.participant");

    res.json(populatedProject);
    } catch (error) {
        next(error)
    }
}

export const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedProject = await Project.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedProject) throw new createError(404, `No job with id:${id} can be found.`);
        res.json(updatedProject);  
    } catch (error) {
        next(error)
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedProject = await Project.findByIdAndDelete(id);
        console.log('THE DELETED JOB', deletedProject)
        if (!deletedProject) throw new createError(404, `No Job with id:${id} can be found.`);
        res.json({ success: `Project ${deletedProject.title} with id:${id} was deleted` });
    } catch (error) {
        next(error)
    }
}
