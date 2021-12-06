import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
    projectId: {type: Schema.Types.ObjectId,  ref: "Project"}, 
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
        enum: [ 'Job Application', 'Message' ],
        default: 'Job Application'
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    readInitiator: { 
        type: Boolean, 
        default: false 
    },
    readReceiver: { 
        type: Boolean, 
        default: false 
    },
    subject: { 
        type: String, 
        required: false, 
    },
    initialMessage: { 
        type: String, 
        required: false, 
    },
    replyMessage: { 
        type: String, 
        required: false, 
    },
    jobSlotId: String,
    job: String, 
    jobDescription: String
},{
    versionKey: false,
    timestamps: true
}) 

const Notification = model('Notification', NotificationSchema);

export default Notification;