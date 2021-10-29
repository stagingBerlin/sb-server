import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../configs/config.js';
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
        required: false
    },
    lastName: {
        type: String,
        required: false
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
                type: Schema.Types.ObjectId, 
                ref: 'Job', 
                required: false
            }, 
            _id:false
        }
    ],
    bookmark: [
        {
            projectTitle: {
                type: Schema.Types.ObjectId, 
                ref: 'Project', 
                required: false
            },
            quantity: {
                type: Number, 
                required: false
            },
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
    isHiring: { 
        type: Boolean, 
        required: true 
    },
}, 
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

UserSchema.methods.generateAuthToken = function () {
    const user = this; 
    const token = jwt.sign( {_id: user._id}, config.secretKey, { expiresIn: "2d" })
    console.log(`we created a token for ${user.email} =>`, token);
    return token
}
  
UserSchema.statics.findByToken = function (token) {
    const User = this; // this is the user we called our method on
    try {
      // verify the token
      let decoded = jwt.verify(token, config.secretKey)
    
      // See if user with that is exist
      return User.findOne({_id: decoded._id});
      
    } catch (error) {
      return 
    }
}
  
const User = model('User', UserSchema);
export default User;