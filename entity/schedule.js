import Joi from "joi";

export default function createSchedule({ participants, from, to, subject }) {
	// Validation schema for validating provided data
	const validationSchema = Joi.object({
		participants: Joi.array()
			.items(Joi.string())
			.length(2)
			.required()
			.messages({
				"array.base": "'participants' has to be a list of two user ids",
				"array.length":
					"'participants' has to be a list of two user ids",
				"any.required":
					"User ids for 'participants' has to be provided",
				"string.base":
					"The user ids in the list of 'participants' needs to be a of String type",
			}),
		from: Joi.date().required().messages({
			"any.required":
				"The meeting starting time 'from' has to be provided",
			"date.base":
				"The meeting starting time 'from' has to be a valid Date",
		}),
		to: Joi.date().greater(Joi.ref("from")).required().messages({
			"any.required": "The meeting ending time 'to' has to be provided",
			"date.greater":
				"The meeting ending time 'to' cannot be same or earlier than the meeting starting time 'from'",
			"date.base": "The meeting ending time 'to' has to be a valid Date",
		}),
		subject: Joi.string().required().messages({
			"string.base": "The meeting 'subject' needs to be of String type",
			"any.required": "The meeting 'subject' needs to be provided",
		}),
	});

	const { error } = validationSchema.validate({
		participants,
		from,
		to,
		subject,
	});

	if (error) {
		throw new Error(error.message);
	}

	if (participants[0] === participants[1]) {
		throw new Error(
			"'participants' have to be a list of two unique user ids"
		);
	}

	return Object.freeze({
		subject,
		participants,
		from,
		to,
	});
}
