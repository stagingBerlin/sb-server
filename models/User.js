import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
//import config from '../config/config.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const Schema = new Schema({
    street: {type: String, required: true},
    streetNo: {type: String, required: true},
    city: {type: String, required: true},
    zip: {type: String, required: true},
    country: {type: String, required: true}
}, {_id: false});

const {Schema, model} = mongoose;

const AddressSchema = new Schema({
    street: {type: String, required: true},
    streetNo: {type: String, required: true},
    city: {type: String, required: true},
    zip: {type: String, required: true},
    country: {type: String, required: true}
}, {_id: false});

const UserSchema = new Schema({
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
        required: [true, `User role is required`]
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
        unique: true //validates the address
    },
    bookmark: [{
        project: {type: Schema.Types.ObjectId, ref: 'Project', required: false},
        quantity: {type: Number, required: false},
        
    }, {_id: false}],
    address: AddressSchema
}, 
{
    versionKey: false, 
    timestamps: true, 
    toJSON: { virtuals: true } 
});

UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

