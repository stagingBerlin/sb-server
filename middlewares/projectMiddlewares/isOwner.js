import createError from "http-errors"
import Project from "../../models/Project.js";

const isOwner = async (req, res, next) => {
    const id = req.params.id;
    try {
        const projectdb = await Project.findById(id)
        // .populate('owner')
        // .populate("jobList")
        // .populate("participants");

        console.log(projectdb.owner._id);
        console.log(req.user._id);
        // if the user is not the owner of the project, we throw an error
        if(projectdb.owner !== req.user._id) next(createError(401, `this user is not the owner of this project!!`));

        next()   
    } catch (error) {
        next(error)
    }
}

export default isOwner