const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Error = require("../enums/Error");
const { User, validatePassword, validateUser } = require("../models/user");
const router = express.Router();

// add a user in db.
router.post('/', async (req, res) => {
    let { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send({ "error": error.message });
    }
    const isPasswordValid = validatePassword(req.body.password).error;
    if (isPasswordValid) {
        return res.status(400).send({ "error": Error.NotAStrongPassword });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send({ "error": Error.EmailAlreadyExists });
    }

    user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send({ "error": Error.UserNameAlreadyExists });
    }

    user = new User(_.pick(req.body, ['username', 'email', 'password', 'isAdmin']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header("X-auth-token", token).send(_.pick(user, ['_id', 'name', 'username', 'isAdmin']));
});

module.exports = router;
