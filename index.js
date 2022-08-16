import express from "express";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
	console.log(`The server is listening on PORT: ${PORT}`);
});

process.on("SIGTERM", async () => {
	if (server) {
		server.close(() => {
			console.log("Process is terminated! Server will stop listening!");
		});
	}
});
