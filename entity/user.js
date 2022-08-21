import Joi from "joi";
import bcrypt from "bcrypt";

const saltRounds = 10;

export default async function makeUser({
	firstName,
	lastName,
	email,
	password,
}) {
	const validationSchema = Joi.object({
		firstName: Joi.string().required(),
		lastname: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6),
	});

	const { error } = validationSchema.validate({
		firstName,
		lastName,
		email,
		password,
	});

	if (error) {
		throw new Error(error.message);
	}

	const hashedPassword = await bcrypt.hash(password, saltRounds);

	return Object.freeze({
		firstName,
		lastName,
		email,
		hashedPassword,
	});
}
