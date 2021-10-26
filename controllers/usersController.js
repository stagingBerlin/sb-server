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
    const {id} = req.params;
    
    try {
      const user = await User.findById(id).select('-password');

      if (!user) 
        throw new createError(404, `No users found under ID: ${id}`);

      res.json(user);
    } 
    catch(error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    const info = req.body;

    try {
      const user = new User(info);
      // const verifyToken = user.generateVerifyToken();
      //* SENT THE VERIFY EMAIL HERE: sendVerifyEmail();
      // user.verified.token = verifyToken;

      const savedUser = await user.save();
      req.user = savedUser;
      next();
  
    } catch (err) {
      console.log(err);
      next(err);
    }
  };


export const updateUser = async(req, res, next)=> {
    const { id } = req.params;

    try {
      let user = await User.findById(id);
     
      //* depending on google user or not
      if (user.password) {
        Object.assign(user, req.body);
        user = await user.save();
      } else {
        user = await User.findByIdAndUpdate(id, req.body, {new: true});
      }
      let newUser = await User.findByIdAndUpdate(id, req.body, {new: true})
      if (!newUser) throw new createError(404, `No users found under ID: ${id}`);

      res.json(newUser)
        
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

export const loginUser = async(req, res, next)=> {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email }).populate('cart.record'); //! find() return an array, findOne(): obj
        
        if (!user.password && user.googleId) throw new createError(404, `signed up via google, please log in with google id`);
        if (!user) throw new createError(404, `Invalid Email`);

        const checkHashedPassword = bcrypt.compareSync(password, user.password);
        console.log('hashed password checked:', checkHashedPassword);
        if (!checkHashedPassword) throw new createError(404, `Invalid Password`);
        
        //* create a token for user & return it with a cookie
        const token = user.generateAuthToken();  //schema method: go see line 82 @User.js
        res.cookie('token', token, {
            expires: new Date(Date.now() + 172800000), // expires in two days
            sameSite: 'lax',
            secure: false,
            httpOnly: true
        }).send(user); 
    }
    catch(error) {
        next(error);
    }
  }

//*************************** HANDLE LATER *****************************//

  export const sendUser = async (req, res, next) => {
    const user = req.user;

    try {
      const token  = user.generateAuthToken();
  
      res
        .cookie('token', token, {
          expires: new Date(Date.now() + 172800000),
          sameSite: 'lax',
          secure: false,  //http on localhost, https on production,
          httpOnly: true,
        })
        .send(user);
    } catch (err) {
      next(err);
    }
  };

  export const verifyCookie = function(req, res) {
    res.send(req.user)
  };

  export const logoutUser = function(req, res) {
    res.clearCookie('token');
    
    console.log("logged out successfully");

    return res.status(200).redirect('/login');
  }

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
