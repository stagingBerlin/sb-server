import createError from 'http-errors';
import Project from '../../models/Project.js';
import { body, check, buildCheckFunction } from 'express-validator'

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

export const sanitizeProject = () => {
   return [
        body("title").escape(),
        body("authorship").escape(),
        body("description").escape()
    ]
}

export const sanitizeJob = () => {
    return [body("jobDescription").escape()]
}

const checkBody = buildCheckFunction(['body']);

export const sanitizeUpdateProject = () => {
   return checkBody("description").escape()
}

export const sanitizeUpdateJob = () => {
    return [
        check("jobDescription").escape()
    ]
}
