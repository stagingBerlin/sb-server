import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
    fromUser: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    toUser: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    typeOfNoti:{
        type: String,
        enum: [ 'Job Application', 'Message' ]
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    subject: { 
        type: String, 
        required: false, 
    },
    message: { 
        type: String, 
        required: false, 
    }
},{
    versionKey: false,
    timestamps: true
}) 

const Notification = model('Notification', NotificationSchema);

export default Notification;