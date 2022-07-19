import express from "express";
import indexRouter from "./routes/index.js";
import scheduleRouter from "./routes/schedule.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.use("/schedule", scheduleRouter);

export { app };
