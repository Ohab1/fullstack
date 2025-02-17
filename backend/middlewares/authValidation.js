const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string()
        .length(10) // ✅ Exactly 10 digits required
        .pattern(/^\d+$/) // ✅ Ensures only numbers (no letters/symbols)
        .required()
        .messages({
            "string.length": "Mobile number must be exactly 10 digits.",
            "string.pattern.base": "Mobile number must contain only digits.",
        }),
        password: Joi.string().min(8).max(20).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    console.log("login called");
    const schema = Joi.object({
        mobile: Joi.string()
        .length(10) // ✅ Exactly 10 digits required
        .pattern(/^\d+$/) // ✅ Ensures only numbers (no letters/symbols)
        .required()
        .messages({
            "string.length": "Mobile number must be exactly 10 digits.",
            "string.pattern.base": "Mobile number must contain only digits.",
        }),
        password: Joi.string().min(8).max(20).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
module.exports = {
    signupValidation,
    loginValidation
}