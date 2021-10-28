import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const ProjectSchema = new Schema({
    thumbnail: {
        type: String,
        required: true
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
    jobList: [{
        jobTitle: {type: Schema.Types.ObjectId, ref: 'Job', required: true},
        quantity: {type: Number, required: true}
        
    }, {_id: false}],
    deadline: {
        type: Date,
        required: true
    },
    isHiring: {
        type: Boolean,
        default: true
    },
    participants : [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }]
}) 

const Project = model('Project', ProjectSchema);

export default Project;