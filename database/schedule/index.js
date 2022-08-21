import ScheduleModel from "./model.js";

export async function findByUser(user) {
	const data = await ScheduleModel.find({ participants: user });
	return data;
}

export async function insert(schedule) {
	const newData = await ScheduleModel.create(schedule);
	return newData;
}

export async function findByUserAndTime({ participants, from, to }) {
	const data = await ScheduleModel.findOne({
		participants: { $in: participants },
		$or: [
			{ from: { $lte: from }, to: { $gte: to } },
			{ from: { $lte: to }, to: { $gte: to } },
			{ from: { $lte: from }, to: { $gte: from } },
			{ from: { $gte: from }, to: { $lte: to } },
		],
	});
	return data;
}

const ScheduleDB = Object.freeze({
	findByUser,
	insert,
	findByUserAndTime,
});

export default ScheduleDB;
