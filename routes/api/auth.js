const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../model/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const config = require("config");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

// @route GET api/auth
// @desc Authenticate a user
// @access public
router.get("/signin", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (user && user.active === false) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email not verified, please verify email" }] });
    } else if (user && user.active === true) {
      return res.json({
        user,
        msg: "User Signed in",
      });
    } else if (!user) {
      res.json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Google log in
// @route get api/auth/google
// @desc Log in a user with google
// @access public
const client = new OAuth2Client(config.get("GOOGLE_OAUTH_CLIENT_ID"));
router.post("/google", async (req, res) => {
  const { idToken } = await req.body;

  const response = await client.verifyIdToken({
    idToken,
    audience: config.get("GOOGLE_OAUTH_CLIENT_ID"),
  });
  // const payload = ticket.getPayload();
  // console.log(payload);
  if (!idToken || !response) {
    return res.json({ mag: "No token" });
  }
  const { email_verified, name, email } = response.payload;

  try {
    if (email_verified) {
      let user = await User.findOne({ email });

      if (user && user.active === true) {
        //if there is a user sign it
        // 1st create payload
        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              msg: "Signed in with google succeesfully",
            });
          }
        );
      }
      //ELSE
      else if (user && user.active === false) {
        //user.name =

        user.name = name;
        user.active = true;
        //await user.updateOne({ name, active: true });

        await user.save();

        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              msg:
                "user updated to active and Signed in with google succeesfully",
            });
          }
        );

        //return res.json({ token, user, msg: "user updated to active" });
      } else if (!user) {
        //if user not found create a new one
        let password = email + config.get("jwtSecretKey");

        //create a user
        user = new User({ name, email, password });

        //Encrypt password
        const salt = await bcryptjs.genSalt(10);

        user.password = await bcryptjs.hash(password, salt);

        user.active = true;

        //save user to database
        await user.save();

        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              msg: "new user signed in with google",
            });
          }
        );
      }
      // res.json({ token, user, msg: "new user signed in with google" });
    } else {
      return res.status(400).json({ msg: "Google Failed to sign in a user" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Facebook log in
// @route get api/auth/facebook
// @desc Log in a user with facebook
// @access public
router.post("/facebook", (req, res) => {
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.12/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return fetch(url, { method: "GET" })
    .then((response) => response.json())
    .then(async (response) => {
      const { name, email } = response;

      let user = await User.findOne({ email });

      // console.log(user);

      if (user && user.active === true) {
        //if there is a user sign it
        // 1st create payload
        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              //user,
              msg: "Signed in with facebook succeesfully",
            });
          }
        );
      } else if (user && user.active === false) {
        //user.name =

        user.name = name;
        user.active = true;
        //await user.updateOne({ name, active: true });

        await user.save();

        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              //user,
              msg:
                "user updated to active and Signed in with facebook succeesfully",
            });
          }
        );
      } else if (!user) {
        //if user not found create a new one
        let password = email + config.get("jwtSecretKey");

        //create a user
        user = new User({ name, email, password });

        //Encrypt password
        const salt = await bcryptjs.genSalt(10);

        user.password = await bcryptjs.hash(password, salt);

        user.active = true;

        //save user to database
        await user.save();

        const payload = {
          user: {
            id: user.id,
          },
        };
        //2nd sign it
        jwt.sign(
          payload,
          config.get("jwtSecretKey"),
          { expiresIn: "7d" },
          (error, token) => {
            if (error) throw error;
            return res.json({
              token,
              //user,
              msg: "new user signed in with facebook",
            });
          }
        );
      }
    })
    .catch((error) => res.json({ mssg: "Facebook failed to signin a user" }));
});

module.exports = router;
