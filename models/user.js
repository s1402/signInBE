const mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlenth: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

schema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, username: this.username, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    return token;
}

const User = mongoose.model('User', schema);

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

const validatePassword = (password) => {
    return passwordComplexity().validate(password);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validatePassword = validatePassword;