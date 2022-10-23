// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// backend/routes/api/users.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

// backend/routes/api/users.js
// ...


// backend/routes/api/users.js
// ...
const validateSignup = [
  check('firstName')
  .exists({ checkFalsy: true })
  .isString()
  .withMessage('Please provide a valid firstName.'),
  check('lastName')
  .exists({ checkFalsy: true })
  .isString()
  .withMessage('Please provide a valid lastName.'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];




// backend/routes/api/users.js
// ...

// Sign up
router.post(
  '/',
  // validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const inUse = User.findOne({
      where: {
        email: email
      }
    })
    if(inUse){
      res.status(403);
      res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "email": "User with that email already exists"
        }
      })
    }
    const user = await User.signup({ firstName, lastName, email, username, password });

    let mtobj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: null
    }
      mtobj.token = await setTokenCookie(res, user);
    // user.token = ""
    return res.json(
      mtobj
    );
  }
);








// backend/routes/api/users.js
// ...

module.exports = router;
