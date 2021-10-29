import { body, validationResult } from 'express-validator';
import createError from 'http-errors';

/** User Vali  and  Sani rules*/
export const signupRules = () => {
  return [
    body("firstname").escape().trim(),
    body("lastname").escape().trim(),
    body('email')
        .escape()
        .trim()
        .isEmail()
        .withMessage('Not a valid email address.')
        .normalizeEmail(),
    body('password')
        .escape()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Your password must have: 1 lowercase, 1 Capital, 1 number, & 1 symbol like => !@#$%^&* please'
      ),
  ];
};

export const loginRules = () =>{
  return [
    body('email').escape().trim(),
    body('password').escape().trim()
  ]
}

/**User ValiSani Error Handling */
export const userValidationErrorHandling = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const arrErrors = errors.array();
  const errorsSummary = mergeErrors(arrErrors);
  const err = new createError(422, errorsSummary);
  next(err);
};

const mergeErrors = (arrErrors) => {
  return arrErrors.map((err) => `${err.msg}`).join(' ');
};


// take username from email input
export const generateUsername = (req, res, next) => {
  const { email } = req.body;
  try {
    const username =  email.split('@')[0];
    req.body.username = username;
    next()
  } catch (error) {
    next(error);
  }
}