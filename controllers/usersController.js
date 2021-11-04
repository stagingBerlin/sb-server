import User from '../models/User.js';
import createError from 'http-errors';

export const getUsers = async(req, res, next) => {
    try {
        let users = await User.find().sort('lastName').select('-password');
        res.json(users);
    } catch(error) {
        next(error);
    }
}

export const getUser = async(req, res, next)=> {
    const { id } = req.params;
    try {
      const user = await User.findById(id).select('-password');

      if (!user) throw new createError(404, `No users found under ID: ${id}`);

      res.json(user);
    } 
    catch(error) {
        next(error);
    }
}

export const updateUser = async(req, res, next)=> {
    const { id } = req.params;

    try {
      // let user = await User.findById(id);
     
      //* depending on google user or not
      
      let newUser = await User.findByIdAndUpdate(id, req.body, { new: true })
      .populate("profession.jobTitle")
      .select("-password")
      console.log(newUser);
      // console.log(newUser.profession[0].jobTitle);
      // console.log(newUser.profession[1].jobTitle);
      if (!newUser) throw new createError(404, `No users found under ID: ${id}`);

      res.json(newUser);
        
    } catch(error) {
        next(error);
    }
}

export const delUser = async(req, res, next)=> {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) 
        throw new createError(404, `No users found under ID: ${id}`);

        res.json({done: `ID ${id}'s been deleted`})

    } catch(error) {
        next(error);
    }
}

//*************************** HANDLE LATER *****************************//

export const verifyEmail = async(req, res, next) => {
  console.log(req.user)
  try {
    let user = await User.findById(req.user._id);
  
    Object.assign(user, {verified: {status: true, token: user.verified.token}})
    const userUpdated = await user.save()
    let newUser = await User.findById(userUpdated._id).populate('cart.record')
    if (!newUser) throw new createError(404, `no user found`)
    res.send(newUser);
  } catch(error) {
    next(error);
  }
  
}

export const signUpGoogleUser = async (req, res, next) => {
    const { email, googleId, firstName, lastName } = req.body;
    try {
      let user = await User.findOne({email});
      if (!user) {
        let newUser = await User.findOneAndUpdate(
          { email }, 
          { googleId, email, firstName, lastName, username: email, verified: { status: true }},
          { upsert: true,  new: true });
        
          if (!newUser) throw new createError(404, `unable to add a new user`);
      }
      const token  = user.generateAuthToken();

      res.cookie(
          'token', token, {
          expires: new Date(Date.now() + 172800000),
          sameSite: 'lax',
          secure: false,  //http on localhost, https on production,
          httpOnly: true,
        })
        .send(user);
    } catch(error) {
      next(error)
    }
}