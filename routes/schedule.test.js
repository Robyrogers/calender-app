import "dotenv/config";
import request from "supertest";
import { app } from "../app.js";
import { disconnectFromDb, connectToDb } from "../database/database.js";

describe("Schedule API for a User", () => {
	beforeAll(async () => await connectToDb(process.env.URI));

	afterAll(async () => await disconnectFromDb());

	it("GET /schedule/:userId --> Array of schedules for matched User", () => {
		return request(app)
			.get("/schedule/1234")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((response) => {
				expect(response.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							id: expect.any(String),
							participants: expect.arrayContaining([
								expect.any(String),
							]),
							subject: expect.any(String),
							from: expect.stringMatching(
								/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/
							),
							to: expect.stringMatching(
								/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/
							),
						}),
					])
				);
			});
	});

	it("GET /schedule/:userId --> Empty array for no schedules", () => {
		return request(app)
			.get("/schedule/12345")
			.set("Accept", "application/json")
			.expect(200, []);
	});

	it("GET /schedule/:userId --> Empty array and 404 if no users matched", () => {
		return request(app).get("/schedule/12314124").expect(404, { message: 'User does not exist!' });
	});
});
