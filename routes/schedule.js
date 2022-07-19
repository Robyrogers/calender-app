import express from "express";
const router = express.Router();
import Schedule from "../database/schedules.js";

const users = [
	{ id: "1234", name: "Ryad" },
	{ id: "4321", name: "Nafisa" },
	{ id: "12345", name: "Shiro" },
];

router.get("/:userId", async (req, res) => {
	const {
		params: { userId },
	} = req;

	const user = users.find((user) => user.id === userId);

	// If the user does not exist
	if (!user) {
		return res.status(404).json({ message: "User does not exist!" });
	}

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
});

router.put("/add", async (req, res) => {
	const { body } = req;

	let { participants, from, to, subject } = body;

	if (
		participants === undefined ||
		from === undefined ||
		to === undefined ||
		subject === undefined
	) {
		return res.status(400).json({});
	}

	from = new Date(from);
	to = new Date(to);

	// The meeting start time cannot after or at the same time as the meeting end time
	if (from.getTime() >= to.getTime()) {
		return res.status(400).json({});
	}

	if (
		participants.some(
			(participant) => !users.some((user) => user.id === participant)
		)
	) {
		return res.status(401).json({});
	}

	try {
		const scheduleExists = await Schedule.findOne({
			participants: { $in: participants },
			$or: [
				{ from: { $lte: from }, to: { $gte: to } },
				{ from: { $lte: to }, to: { $gte: to } },
				{ from: { $lte: from }, to: { $gte: from } },
			],
		});

		if (scheduleExists) {
			return res.status(400).json({});
		}

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
		console.error(err);
		return res.status(500).json({});
	}
});

export default router;
