import {atom} from 'jotai'
import {PosterPromise} from '../services/Fetcher'
import {mutate} from 'swr'
import type {AxiosResponse} from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { dateForMenu, dateForFilter, todayOrFurther } from '../utils/DateUtils'
import { initialSchedule, initialScheduleWeek } from '../models/ScheduleTypes';
import type {ISchedule, IScheduleWeek} from '../models/ScheduleTypes'

export const schedulePostPromise = (schedule) =>
	PosterPromise(`schedules/${schedule.id}`, schedule)

export const weekPostPromise = (week) => {
	console.log({week})
	return PosterPromise(`schedule_weeks/${week.id}`, week)
}

export const WeekDaysObj = [
	{code: "MONDAY", name: "Lunes", status:"inactive"},
	{code: "TUESDAY", name: "Martes", status:"inactive"},
	{code: "WEDNESDAY", name: "Miércoles", status:"inactive"},
	{code: "THURSDAY", name: "Jueves", status:"inactive"},
	{code: "FRIDAY", name: "Viernes", status:"inactive"},
	{code: "SATURDAY", name: "Sábado", status:"inactive"},
	{code: "SUNDAY", name: "Domingo", status:"inactive"},
]

	export const CurrentWeek = atom<IScheduleWeek>(initialScheduleWeek)

	export const weekDayMap = () => {
		const weekMap = new Map()
		WeekDaysObj.forEach(d => weekMap.set(d.code, d))
		return weekMap
	}
	export const ActiveCell = atom<boolean>(false)
	export const WeekDays = atom<Map<string, any>>(weekDayMap())

	export const CurrentSchedule = atom<ISchedule>(initialSchedule)

	export const validateSchedule = (schedule) => {
		const resp = (ok: boolean, msg: string) => ({ok, msg})
		const nameOk = schedule.name?.length > 0
		const dateOk = todayOrFurther(schedule.startDate)
		if (!nameOk) return resp (false, "Recuerda nombrar al cronograma")
		if (!dateOk) return resp (false, "Por favor revisa la fecha de inicio")
		return resp(true, "ok")
	}

