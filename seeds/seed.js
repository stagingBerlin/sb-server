import mongoose from 'mongoose';
import '../configs/mongo-connect.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import Project from '../models/Project.js'
import faker from 'faker'


(async function(){
    try {
        await User.deleteMany({});
        await Project.deleteMany({});
        console.log(`All users are now in a better place... Tulum`);
        console.log(`All projects are now in a better place... Acapulco`);
    } catch (error) {
        console.log(error);
    }

    const allJobs = await Job.find();
    const jobsIds = allJobs.map(job => job._id)

    const booleans = [ false, true ]

    const userPromises = Array(20)
    .fill(null)
    .map(() => {
      const userData = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: '0123456789',
        username: faker.internet.userName(),
        isHiring: faker.random.arrayElement(booleans),
        profession: [  
            faker.random.arrayElement(jobsIds)
            ]
        
        };
        console.log(
            `User ${userData.name} with email ${userData.email} has been created`
        );
        const user = new User(userData);
        return user.save();
    });

    let users;
    try {
        users = await Promise.all(userPromises);
        console.log(`****************************************************`);
        console.log(`All 20 fake users have been stored to the DB`);
        console.log(`****************************************************`);
    } catch (error) {
        console.log(error);
    }

    const projectPromises = Array(20)
    .fill(null)
    .map(() => {
        const randomUser = faker.random.arrayElement(users)
        const jobs = faker.random.arrayElements(jobsIds, 2)
        const projectData = {
          title: faker.animal.cetacean(),
          description: faker.lorem.paragraphs(),
          owner: randomUser,
          authorship: faker.name.firstName(),
          jobList : [  
              {job : jobs[0]},
              {job : jobs[1]}
          ]
        };

        console.log(
            `Project ${projectData.title} with authorship ${projectData.authorship} has been created`
        );

        const project = new Project(projectData);
        return project.save().then(item => {
            return User.findByIdAndUpdate(randomUser._id, 
                { $push: { ownedProject : item._id } }, 
                {new: true}
            )
        });
    });
    
    try {
        await Promise.all(projectPromises);
        console.log(`****************************************************`);
        console.log(`All 20 fake projects have been stored to the DB`);
        console.log(`****************************************************`);
    } catch (error) {
        console.log(error);
    }

    mongoose.connection.close();
})()