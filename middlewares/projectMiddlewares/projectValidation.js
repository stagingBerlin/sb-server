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
    // body('date', 'date must be a valid date').optional({ checkFalsy: true }).isISO8601()
        body("title").optional({ checkFalsy: true }).escape(),
        body("authorship").optional({ checkFalsy: true }).escape(),
        body("description").optional({ checkFalsy: true }).escape()
    ]
}

export const sanitizeJob = () => {
    return [body("jobDescription").optional({ checkFalsy: true }).escape()]
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
