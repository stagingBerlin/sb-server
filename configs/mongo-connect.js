import mongoose from 'mongoose';
import config from './config.js'; 



mongoose.connect(config.mongooseUrl).then(()=> console.log(`DB's up & running, Team SB!`))
  .catch((err)=> {
    console.log(`connection failed`, err)
})
