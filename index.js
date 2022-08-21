import express from "express";
import "dotenv/config";
import { connectToDb } from "./database/database.js";
import makeExpressCallback from "./lib/makeExpressCallback.js";
import ScheduleController from "./controller/schedule/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get(
	"/schedule/:user",
	makeExpressCallback(ScheduleController.listScheduleByUser)
);
app.post("/schedule/add", makeExpressCallback(ScheduleController.addSchedule));

const PORT = process.env.PORT;

let server = null;
connectToDb()
	.then(() => {
		server = app.listen(PORT, () => {
			console.log(`The server is listening on PORT: ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});

process.on("SIGTERM", async () => {
	if (server) {
		server.close(() => {
			console.log("Process is terminated! Server will stop listening!");
		});
	}
});
