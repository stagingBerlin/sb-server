import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
//import config from '../config/config.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const {Schema, model} = mongoose;

const portfolioSchema = new Schema({
    name: {type: String, required: true},
    job: {type: String, required: true},
    //images: [{type: String}],
    description: {type: String, required: true},    
}, {_id: false});

const UserSchema = new Schema({
    avatar: {
        type: string, 
        required: [true, 'avatar is required']
    },
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User',
        required: [true, `user role is required`]
    },
    username: {
        type: String,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verified: {
        token: {type: String, required: true},
        status: {type: Boolean, default: false}
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    jobTitle: {
        type: String, ref: 'Job', 
        required: [true, 'username is required']
    },
    bookmark: [{
        project: {type: Schema.Types.ObjectId, ref: 'Project', required: false},
        quantity: {type: Number, required: false}
        
    }, {_id: false}],
    project: [{
        project: {type: Schema.Types.ObjectId, ref: 'Project', required: false},
        quantity: {type: Number, required: false}
        
    }, {_id: false}],
    ownedProject: [{
        project: {type: Schema.Types.ObjectId, ref: 'Project', required: false},
        quantity: {type: Number, required: false}
    }],
    portfolio: portfolioSchema,
}, 
{
    toJSON: {
        transform: (original, returnedDoc) => {
        delete returnedDoc.password;
        }
    }
},

{
    versionKey: false, 
    timestamps: true, 
    toJSON: { virtuals: true } 
});

UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

const User = model('User', UserSchema);
export default User;