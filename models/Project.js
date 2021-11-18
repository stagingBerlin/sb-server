import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const ProjectSchema = new Schema({
    images:[ 
        {
            type: String,
            required: false
        }
    ],
    title: {
        type: String,
        required: true,
        unique: true
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
            jobDescription: {
                type: String,
                required: true,
                default: `Give a brief description of the type of work required. \nFor example: Female Contemporary dancer with strong Graham technique (in case the required job is a dancer)`
            },
            participant: {
                type: Schema.Types.ObjectId, 
                ref: 'User',
                _id: false
            }
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