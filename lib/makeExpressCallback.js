export default function (controller) {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	return (req, res) => {
		const httpRequest = {
			body: req.body,
			query: req.query,
			params: req.params,
			method: req.method,
			path: req.path,
			headers: {
				"Content-Type": req.get("Content-Type"),
				Referrer: req.get("referrer"),
				"User-Agent": req.get("User-Agent"),
			},
		};
		controller(httpRequest)
			.then((httpResponse) => {
				const { headers, body, status } = httpResponse;
				if (headers) {
					res.set(headers);
				}
				res.type("json");
				res.status(status).send(body);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({ error: "An unknown error occured" });
			});
	};
}
