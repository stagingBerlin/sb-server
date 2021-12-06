import createError from 'http-errors';
import Notification from '../models/Notification.js'
import User from '../models/User.js'

export const createNotification = async (req, res, next) => {
    const { projectId } = req.body
    
    try {
        const data = { ...req.body, fromUser: req.user._id }
        const notification = await Notification.create(data)
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { appliedProject: projectId } }, 
            { new: true })
            .populate("profession")
            .populate("ownedProject")
            .populate("appliedProject")
            .populate("bookmark")
            .select("-password")

            // console.log(notification );
        res.json(user)
    } catch (error) {
        next(error);
    }
}

export const getUserNotifications = async (req, res, next) => {
    try {
        const userNotifications = await Notification.find(
            { $or: [ { fromUser: req.user._id }, { toUser: req.user._id } ] } )
            .populate('projectId')
            .populate('fromUser')
            .populate('toUser')

            res.json(userNotifications)
    } catch (error) {
        next(error);
    }
}

export const updateNotification = async (req, res, next) => {
    // const { status, replyMessage } = req.body
    const body = req.body
    const {id} = req.params
    try {
        if(body.status && body.status !== "pending"){
            body.readInitiator = false
        }
        const updated = await Notification.findByIdAndUpdate(id, body, {new: true})
            .populate('projectId')
            .populate('fromUser')
            .populate('toUser');

        res.json(updated)
    } catch (error) {
        next(error)
    }
}
