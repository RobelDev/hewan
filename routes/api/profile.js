const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../model/User");

router.post("/profile", auth, async (req, res) => {});

module.exports = router;
