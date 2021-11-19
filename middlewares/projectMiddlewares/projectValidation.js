import createError from 'http-errors';
import Project from '../../models/Project.js';

export const findDuplicateProject = async (req, res, next) => {
    try {

        const allProjects = await Project.find()
        const findProject = allProjects.find(item => item.title === req.body.title)

        if( findProject ) throw new createError(404, `Project with title "${req.body.title}" already exists`);

        next()
    } catch (error) {
        next(error);
    }
}