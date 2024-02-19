const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const Error = require("../enums/Error");
const router = express.Router();

router.post("/", async (req, res) => {
    let user = await User.findOne({ email: req.body.username });
    if (user) {
        return validatePassword(user, req, res);
    }
    user = await User.findOne({ username: req.body.username });
    if (user) {
        return validatePassword(user, req, res);
    }

    return res.header({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    })
        .status(400).
        send({ "error": Error.AccountDoesNotExist });
})

const validatePassword = async (user, req, res) => {
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.header({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        })
            .status(400).
            send({ "error": Error.IncorrectPassword })
    }
    const token = user.generateAuthToken();
    return res.header({
        "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept"
    }).send({ "token": token });
}

module.exports = router