import createSchedule from "../../entity/schedule.js";

export default function ({ ScheduleDB }) {
	return async (scheduleData) => {
		//Validate and create a schedule data object
		const schedule = createSchedule(scheduleData);
		const { participants, from, to } = schedule;
		// Check if a meeting is already scheduled
		const existingSchedule = await ScheduleDB.findByUserAndTime({
			participants,
			from,
			to,
		});
		if (existingSchedule) {
			throw new Error(
				"A meeting is already scheduled for one of the participants at that time!"
			);
		}

		return await ScheduleDB.insert(schedule);
	};
}
