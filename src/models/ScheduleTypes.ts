export interface ISchedule {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: string
}

export interface IScheduleWeek {
	id: string;
	weekPosition: number;
	scheduleId: string;
}

export interface IScheduleMenu {
  id: string;
  entree: string;
  main: string;
  dessert: string;
  menuDate: string;
  tag: string;
  type?: string
	scheduleWeekId: string;
	dayPosition: string;
}

export const initialSchedule: ISchedule = {
	id: null,
	name: null,
	startDate: null,
	endDate: null,
	status: null
}

export const initialScheduleWeek: IScheduleWeek = {
	id: null,
	weekPosition: null,
	scheduleId: null
}

export const initialScheduleMenu: IScheduleMenu = {
	id: "",
	entree: "",
  main: "",
  dessert: "",
  menuDate: "",
  tag: "",
  type: "",
	scheduleWeekId: "",
	dayPosition: "",
}
