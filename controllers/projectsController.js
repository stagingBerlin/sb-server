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

export const getProject = async (req, res, next) => {
    const { id } = req.params
    try {
        const project = await Project.findById(id)
        .populate('owner')
        .populate('jobList.job');

        if(!project) throw new createError(404, `No project with id: ${id} was found.`);
        res.json(project)
    } catch (error) {
        next(error)
    }
}

export const createProject = async (req, res, next) => {
    try {
        const body = req.body;
        const data = { ...body, owner: req.user._id }
        const createdProject = await Project.create(data);
        
        await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { ownedProject: createdProject._id  } }, 
            { new: true } 
        )

        const populatedProject = await Project.findById(createdProject._id)
        .populate("owner")
        .populate("jobList")
        .populate("participants");

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
        
    } catch (error) {
        
    }
}

export const deleteOwnProject = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export const updateOwnProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedProject = await Project.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedProject) throw new createError(404, `No project with id:${id} can be found.`);
        res.json(updatedProject);  
    } catch (error) {
        next(error)
    }
}

