import mongoose from 'mongoose';
//import './config.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DB_CONNECT).then(()=> console.log(`DB's up & running, Team SB!`))
  .catch((err)=> {
    console.log(`connection failed`, err)
})
