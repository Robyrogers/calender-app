export default function ({ ScheduleService }) {
	return async (httpRequest) => {
		const headers = {
			...httpRequest.headers,
			"Content-Type": "application/json",
		};
		try {
			const scheduleList = await ScheduleService.listScheduleForUser(
				httpRequest.params.user
			);
			return {
				headers,
				status: 200,
				body: scheduleList,
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
