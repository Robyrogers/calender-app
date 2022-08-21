export default function ({ ScheduleService }) {
	return async (httpRequest) => {
		const headers = {
			...httpRequest.headers,
			"Content-Type": "application/json",
		};
		try {
			const addScheduleResult = await ScheduleService.addSchedule(
				httpRequest.body
			);
			return {
				headers,
				status: 200,
				body: addScheduleResult,
			};
		} catch (err) {
			console.log(err);
			return {
				headers,
				status: 400,
				body: {
					error: err.message,
				},
			};
		}
	};
}
