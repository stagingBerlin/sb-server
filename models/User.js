import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../configs/config.js';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const portfolioSchema = new Schema(
  {
    name: { type: String, required: false },
    job: { type: String, required: false },
    images: [{type: String}],
    description: { type: String, required: false },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/320px-User-avatar.svg.png",
    },
    name: { type: String, required: false },
    firstName: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
      required: [true, `user role is required`],
    },
    username: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    // verified: {
    //     token: {type: String, required: true},
    //     status: {type: Boolean, default: false}
    // },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    profession: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: false,
        _id: false,
      },
    ],
    bookmark: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: false,
        _id: false,
      },
    ],
    joinedProject: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: false,
        _id: false,
      }
    ],
    appliedProject: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: false,
        _id: false,
      }
    ],
    ownedProject: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: false,

        _id: false,
      },
    ],
    portfolio: portfolioSchema,
    isHiring: {
      type: Boolean,
      required: true,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        _id: false
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        _id: false
      },
    ]
  },
  {
    versionKey: false,
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      transform: (original, returnedDoc) => {
        delete returnedDoc.password;
      },
    },
  }
);

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = bcrypt.hashSync(user.password, 9);
    next();
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, config.secretKey, {
    expiresIn: "2d",
  });
  console.log(`we created a token for ${user.email} =>`, token);
  return token;
};

UserSchema.statics.findByToken = function (token) {
    const User = this; // this is the user we called our method on
    try {
      // verify the token
      let decoded = jwt.verify(token, config.secretKey)
    
      // See if user with that _id is exist
      return User.findOne({_id: decoded._id})
      .populate("profession")
      .populate("ownedProject")
      .populate("appliedProject")
      .populate("bookmark");
      
    } catch (error) {
      return 
    }
}
  
const User = model('User', UserSchema);
export default User;
