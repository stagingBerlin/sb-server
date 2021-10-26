import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const jobSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},    
}, {_id: false});

const Job = model('Job', JobSchema);

export default Job;