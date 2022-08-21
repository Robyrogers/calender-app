import addSchedule from "./addSchedule.js";
import listScheduleByUser from "./listScheduleByUser.js";
import ScheduleService from "../../services/scheduleService/index.js";

const ScheduleController = Object.freeze({
	addSchedule: addSchedule({ ScheduleService }),
	listScheduleByUser: listScheduleByUser({ ScheduleService }),
});

export default ScheduleController;
