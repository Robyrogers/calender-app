export default function ({ ScheduleDB }) {
	return async (user) => {
		const data = await ScheduleDB.findByUser(user);
		return data;
	};
}
