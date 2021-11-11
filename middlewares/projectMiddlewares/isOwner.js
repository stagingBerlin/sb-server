import createError from "http-errors"
import Project from "../../models/Project.js";

const isOwner = async (req, res, next) => {
    const id = req.params.id;
    try {
        // if the object params is empty, we will send all the projects owned by the logged user.
        if(Object.getOwnPropertyNames(req.params).length === 0){

            const ownedProjects = await Project.find({ owner: req.user._id })
            .sort('title')
            .populate('owner')
            .populate("jobList")
            .populate("participants");

            if (!ownedProjects) throw new createError(404, `No projects found for this user`);
            if (ownedProjects.length === 0) throw new createError(404, `You don't have any projects`);
            
            req.ownedProjects = ownedProjects 
            next()
        }
        else {  // else, the object params contains the id of the requested project
            const projectdb = await Project.findById(id)
            .populate('owner')
            .populate("jobList")
            .populate("participants");
            
            if(!projectdb) next(createError(404, `the requested project was not found`));
            
            // if the user is not the owner of the project, we throw an error
            if(String(projectdb.owner._id) !== String(req.user._id)) next(createError(401, `this user is not the owner of this project!!`));
            req.project = projectdb
            next()   
        }
    } catch (error) {
        next(error)
    }
}

export default isOwner