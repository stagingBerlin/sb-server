import createError from 'http-errors';
import Job from '../models/Job.js'

export const getAllJobs = async (req, res, next) => {
    try {
        const allJobs = await Job.find().sort({title: 1})
        res.send(allJobs)
    } catch (error) {
        next(error)
    }
}

export const getJob = async (req, res, next) => {
    const { id } = req.params
    try {
        const job = await Job.findById(id);
        if(!job) throw new createError(404, `No job with id: ${id} was found.`);
        res.json(job)
    } catch (error) {
        next(error)
    }
}

export const createJob = async (req, res, next) => {
    try {
        let data = req.body;
        const job = await Job.create(data);
    res.json(job);
    } catch (error) {
        next(error)
    }
}

export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const job = await Job.findByIdAndUpdate(id, newData, { new: true });
        if (!job) throw new createError(404, `No job with id:${id} can be found.`);
        res.json(job);  
    } catch (error) {
        next(error)
    }
}

export const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jobDeleted = await Job.findByIdAndDelete(id);
        console.log('THE DELETED JOB', jobDeleted)
        if (!jobDeleted) throw new createError(404, `No Job with id:${id} can be found.`);
        res.json({ success: `Job ${jobDeleted.title} with id:${id} was deleted` });
    } catch (error) {
        next(error)
    }
}
