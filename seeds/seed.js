import mongoose from 'mongoose';
import '../configs/mongo-connect.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import faker from 'faker'


(async function(){
    try {
        await User.deleteMany({});
        console.log(`All are users now in a better place... Tulum`);
    } catch (error) {
        console.log(error);
    }

    const allJobs = await Job.find();
    const jobsIds = allJobs.map(job => job._id)

    const userPromises = Array(20)
    .fill(null)
    .map(() => {
      const userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '0123456789',
        username: faker.internet.userName(),
        profession: [
            {jobTitle: faker.random.arrayElement(jobsIds)}
        ]
        
        };

        console.log(
            `User ${userData.firstName} with email ${userData.email} has been created`
        );
        const user = new User(userData);
        return user.save();
    });

    try {
        await Promise.all(userPromises);
        console.log(`****************************************************`);
        console.log(`All 20 fake users have been stored to the DB`);
        console.log(`****************************************************`);
    } catch (error) {
        console.log(error);
    }

    mongoose.connection.close();
})()