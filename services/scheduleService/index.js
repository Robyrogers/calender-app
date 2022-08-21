import addSchedule from "./addSchedule.js";
import listScheduleForUser from "./listScheduleForUser.js";
import ScheduleDB from "../../database/schedule/index.js";

const ScheduleService = Object.freeze({
	addSchedule: addSchedule({ ScheduleDB }),
	listScheduleForUser: listScheduleForUser({ ScheduleDB }),
});

export default ScheduleService;
