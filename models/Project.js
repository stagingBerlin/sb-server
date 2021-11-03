import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const ProjectSchema = new Schema({
    thumbnail: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    contact: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    authorship: {
        type: String,
        required: true
    },
    jobList: [
        {
            jobTitle: {
                type: Schema.Types.ObjectId, 
                ref: 'Job', 
                required: true
            },
            // quantity: {
            //     type: Number, 
            //     required: true
            // }
        }, {_id: false}
    ],
    starting:{
        type: Date,
        required: false
    },
    deadline: {
        type: Date,
        required: false
    },
    isHiring: {
        type: Boolean,
        default: true
    },
    participants : [
        {
            participant: {
                type: Schema.Types.ObjectId, 
                ref: 'User'
            }
        },{ _id: false }
    ]
}) 

const Project = model('Project', ProjectSchema);

export default Project;