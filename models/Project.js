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
    description:{
        type: String, 
        required: true
    },
    owner: {
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
            job:{
                type: Schema.Types.ObjectId, 
                ref: 'Job', 
                required: true,
                _id: false
            },
            participant: {
                type: Schema.Types.ObjectId, 
                ref: 'User',
                _id: false
            },
            _id: false
        }
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
            type: Schema.Types.ObjectId, 
            ref: 'User',
            _id: false
        }
    ]
},{
    versionKey: false
}) 

const Project = model('Project', ProjectSchema);

export default Project;