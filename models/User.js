import mongoose from 'mongoose';
//import jwt from 'jsonwebtoken';
//import config from '../config/config.js';
//import bcrypt from 'bcryptjs';

const {Schema, model} = mongoose;

const portfolioSchema = new Schema({
    name: {type: String, required: false},
    job: {type: String, required: false},
    //images: [{type: String}],
    description: {type: String, required: false},    
}, {_id: false});


const UserSchema = new Schema({
    avatar: {
        type: String, 
        required: false
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
        required: false,
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    // verified: {
    //     token: {type: String, required: true},
    //     status: {type: Boolean, default: false}
    // },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    profession: [
        {
            jobTitle: {
                type: Schema.Types.ObjectId, ref: 'Job', required: true
            }, 
            _id:false
        }
    ],
    bookmark: [
        {
            projectTitle: {
                type: Schema.Types.ObjectId, ref: 'Project', required: false
            },
            quantity: {type: Number, required: false},
            _id:false
        },
    ],
    joinedProject: [
        {
            projectTitle: {
                type: Schema.Types.ObjectId, 
                ref: 'Project', 
                required: false
            },
            _id:false
        }
    ],
    appliedProject:[
        {
            projectTitle:{
                type: Schema.Types.ObjectId,
                ref: 'Project', 
                required: false
            },  
            _id:false
        }
    ],
    ownedProject: [
        {
            project: {
                type: Schema.Types.ObjectId, 
                ref: 'Project', 
                required: false
            },
            _id:false
        }
    ],
    portfolio: portfolioSchema,
}, 
// {
//     toJSON: {
//         transform: (original, returnedDoc) => {
//         delete returnedDoc.password;
//         }
//     }
// },

{
    versionKey: false, 
    timestamps: true, 
    toJSON: { 
        virtuals: true,
        transform: (original, returnedDoc) => {
            delete returnedDoc.password;
        } 
    } 
});

UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

const User = model('User', UserSchema);
export default User;