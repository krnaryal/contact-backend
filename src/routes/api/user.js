var bcrypt = require("bcryptjs");
var config = require("../../../config/config");
var Router = require("express").Router;
var Response = require("express").Response;
var check = require("express-validator/check").check;
var validationResult = require("express-validator/check").validationResult;
var gravatar= require ("gravatar");
var HttpStatusCodes= require ("http-status-codes");
var jwt = require("jsonwebtoken");

var User=require("../../models/User");

const router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }

      const options = {
        s: "200",
        r: "pg",
        d: "mm",
      };

      const avatar = gravatar.url(email, options);

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Build user object based on IUser
      const userFields = {
        email,
        password: hashed,
        avatar,
      };

      user = new User(userFields);

      await user.save();

      const payload = {
        userId: user.id,
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: config.jwtExpiration },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


module.exports = router;
