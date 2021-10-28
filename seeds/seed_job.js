import mongoose from 'mongoose';
import '../configs/mongo-connect.js'
import Job from '../models/Job.js'


const jobs = [
    {title: "Actor"},
    {title: "Dancer"},
    {title: "Musician"},
    {title: "Costume"},
    {title: "Photographer"},
    {title: "Lights"},
    {title: "Stage-set"},
    {title: "Singer"},
];

(async function(){
    try {
        await Job.deleteMany({});
        console.log(`All jobs are now in a better place... Cancun`);
    } catch (error) {
      console.log(error);
    }

    const jobsPromises = jobs.map(job => {
        const jobData = {title: job.title}
        console.log(`Job ${jobData.title} has been created`);
        const jobToDB = new Job(jobData)
        return jobToDB.save()
    })
   
    try {
        await Promise.all(jobsPromises);
        console.log(`****************************************************`);
        console.log(`All Jobs have been stored to the DB`);
        console.log(`****************************************************`);
      } catch (error) {
        console.log(error);
      }

    mongoose.connection.close();
})()
