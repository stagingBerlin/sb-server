import createError from 'http-errors';
import Notification from '../models/Notification.js'

export const createNotification = async (req, res, next) => {
    try {
        const data = { ...req.body, fromUser: req.user._id }
        const notification = await Notification.create(data)
        res.json(notification)
    } catch (error) {
        next(error);
    }
}

export const getUserNotifications = async (req, res, next) => {
    try {
        const userNotifications = await Notification.find(
            { $or: [ { fromUser: req.user._id }, { toUser: req.user._id } ] } )
            .populate('fromUser')
            .populate('toUser')

            res.json(userNotifications)
    } catch (error) {
        next(error);
    }
}