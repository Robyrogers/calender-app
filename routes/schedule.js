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
		return res.status(404).json([]);
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

router.put("/:userId/add", () => {
	const { body } = req;
	const { participants, from, to, subject } = body;

	res.json();
});

export default router;
