const User = require("../../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");
const { failedResponse, successResponse } = require("../responses");

const registerCustomer = async (req, res) => {
	const { email, password } = req.body;
	try {
		const schema = joi.object({
			fullName: joi.string().min(2).required(),
			email: joi.string().email().required(),
			password: joi.string().min(6).required(),
		});

		const { error } = schema.validate({ ...req.body }, { abortEarly: false });

		if (error) {
			const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
			return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
		} else {
			const checkEmail = await User.findOne({email});

			if (checkEmail !== null) {
				return failedResponse(res, "Use Another Email");
			}

			//**-----------------inserting data------------------ */
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUserData = {
				...req.body,
				password: hashedPassword,
			};
			const newUser = await User.create(newUserData);

			//** ------------ making token -------------- */
			const userId = {
				id: newUser._id,
				email: newUser.email,
			};
			jwt.sign(
				userId,
				process.env.SECRET_KEY,
				{
					expiresIn: 86400,
				},
				(error, token) => {
					if (error) {
						return failedResponse(res, JSON.stringify(error));
					} else {
						const resultToSend = {
							fullName: newUser.fullName,
							token,
						};
						return successResponse(res, resultToSend, "Registered Successfully");
					}
				}
			);
		}
	} catch (error) {
		console.log("something went wrong at registerCustomer======>>>>>>", error);
		failedResponse(res, "server error", JSON.stringify(error));
	}
};

const customerLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
        //**--------- Validations ----------- */
		const schema = joi.object({
			email: joi.string().email().required(),
			password: joi.string().min(6).required(),
		});

		const { error } = schema.validate({ ...req.body }, { abortEarly: false });

		if (error) {
			const details = error.details.map((detail) => detail.message.split('"').join("").split("\\").join(""));
			return failedResponse(res, error.details[0].message.split('"').join("").split("\\").join(""), details);
		}

        //**------------- calling user ------------ */
		const calledUser = await User.findOne({ email });
		if (calledUser === null) {
			return failedResponse(res, "Check your email");
		}

        //** ----------- validate password -----------0 */
		const validatingPassword = await bcrypt.compare(password, calledUser.password);

		if (!validatingPassword) {
			return failedResponse(res, "Check your password");
		} else {
            //** ------------- create token ------------- */
			const userId = {
				id: calledUser.id,
				email: calledUser.email,
			};
			jwt.sign(
				userId,
				process.env.SECRET_KEY,
				{
					expiresIn: 86400,
				},
				(error, token) => {
					if (error) {
						return failedResponse(res, JSON.stringify(error));
					} else {
						const resultToSend = {
							fullName: calledUser.fullName,
							token,
						};
						return successResponse(res, resultToSend, "Logged In");
					}
				}
			);
		}
	} catch (error) {
		console.log("something went wrong at customerLogin======>>>>>>", error);
		failedResponse(res, "server error", JSON.stringify(error));
	}
};

module.exports = {
	registerCustomer,
	customerLogin,
};
