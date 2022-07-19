import express from "express";
const router = express.Router();
import Joi from "joi";
import Schedule from "../database/schedules.js";

const users = [
	{ id: "1234", name: "Ryad" },
	{ id: "4321", name: "Nafisa" },
	{ id: "12345", name: "Shiro" },
];

//Get the schedule for a given user
router.get("/:userId", async (req, res) => {
	const {
		params: { userId },
	} = req;

	// Check if the user exists
	const user = users.find((user) => user.id === userId);

	// If the user does not exist
	if (!user) {
		return res.status(404).json({ message: "User does not exist!" });
	}

	try {
		const schedule = await Schedule.find({
			participants: userId,
			to: {
				$gte: new Date(),
			},
		}).sort({ from: 1 });

		return res.status(200).json(
			schedule.map((item) => {
				return {
					id: item.id,
					participants: item.participants,
					subject: item.subject,
					from: item.from,
					to: item.to,
				};
			})
		);
	} catch (err) {
		// Catch any unexpected errors on DB calls
		console.error(err);
		return res.status(500).json({});
	}
});

//Schedule a meeting between two users
router.put("/add", async (req, res) => {
	const { body } = req;

	let { participants, from, to, subject } = body;

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

	const { error } = validationSchema.validate(body);

	// If validation fails send an error with appropriate error message
	if (error) {
		return res.status(400).json({ message: error.message });
	}

	// If any of the user does not exist send an error with appropriate message
	if (
		participants.some(
			(participant) => !users.some((user) => user.id === participant)
		)
	) {
		return res
			.status(401)
			.json({ message: "Only exisitng users can create a meeting!" });
	}

	try {
		// Check for exisiting scheduled meetings at the given time for the users involved
		const scheduleExists = await Schedule.findOne({
			participants: { $in: participants },
			$or: [
				{ from: { $lte: from }, to: { $gte: to } },
				{ from: { $lte: to }, to: { $gte: to } },
				{ from: { $lte: from }, to: { $gte: from } },
			],
		});

		// Return an error with error message if a meeting is already scheduled at the time for any involved user
		if (scheduleExists) {
			return res.status(400).json({
				message:
					"A meeting is already is scheduled for one of the participants at that time!",
			});
		}

		// Create a new schedule if everything is good
		const newSchedule = await Schedule.create({
			subject,
			participants,
			from,
			to,
		});

		return res.status(201).json({
			id: newSchedule.id,
			subject: newSchedule.subject,
			participants: newSchedule.participants,
			from: newSchedule.from,
			to: newSchedule.to,
		});
	} catch (err) {
		// Catch any unexpected errors on DB calls
		console.error(err);
		return res.status(500).json({});
	}
});

export default router;
