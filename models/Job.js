import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const JobSchema = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: false},    
}, {
    versionKey: false
});

const Job = model('Job', JobSchema);

export default Job;