import mongoose from "mongoose";

const URI = process.env.URI || "mongodb://localhost:27017";

const connection = mongoose.connection;

const connectToDb = async () => {
	await mongoose.connect(URI);
};

const disconnectFromDb = async () => {
	await connection.close();
};

connection.on("connected", () => {
	console.info("Connected to the Database!");
});

connection.on("disconnected", () => {
	console.info("Disconnected to the Database!");
});

export { connectToDb, disconnectFromDb };
