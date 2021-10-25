import mongoose from 'mongoose'
import './config.js';

const { connect } = mongoose

const mogooseUrl = 'mongodb://localhost:27017/staging-berlin-db'

connect(mogooseUrl)
.then(() => console.log("success connected to MONGOOSE"))
.catch(err => console.log(err))
