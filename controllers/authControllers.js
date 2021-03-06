import createError from 'http-errors';
import config from '../configs/config.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs'

export const signup = async (req, res, next) => {
  const body = req.body;
  try {
    const user = await User.create(body);
    const token = user.generateAuthToken();
    
    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 172800000), //1.728e+8
        sameSite: config.env == 'production' ? 'None' : 'lax',
        secure: config.env == 'production' ? true : false,
        httpOnly: true,
      })
      .send(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    .populate("profession")
    .populate("ownedProject")
    .populate("appliedProject")
    .populate("bookmark");
    
    if (!user) throw new createError(404, `Email not valid`);

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) next(createError(404, `password not valid`));
    const token = user.generateAuthToken();

    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 172800000), //1.728e+8
        sameSite: config.env == 'production' ? 'None' : 'lax',
        secure: config.env == 'production' ? true : false,
        httpOnly: true,
      })
      .send(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      sameSite: config.env == 'production' ? 'None' : 'lax',
        secure: config.env == 'production' ? true : false
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyCookie = (req, res, next) => {
  res.send(req.user);
};
