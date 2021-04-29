import {atom} from 'jotai'
import {PosterPromise} from '../services/Fetcher'
import {mutate} from 'swr'
import type {AxiosResponse} from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { dateForMenu, dateForFilter } from '../utils/DateUtils'

export const schedulePostPromise = () => {
	const schedule = buildBlankSchedule()
	console.log({schedule})
	return PosterPromise(
		`schedules/${schedule.id}`, schedule
	)
}

export const WeekDaysObj = [
	{code: "MONDAY", name: "Lunes", active:false},
	{code: "TUESDAY", name: "Martes", active:false},
	{code: "WEDNESDAY", name: "Miércoles", active:false},
	{code: "THURSDAY", name: "Jueves", active:false},
	{code: "FRIDAY", name: "Viernes", active:false},
	{code: "SATURDAY", name: "Sábado", active:false},
	{code: "SUNDAY", name: "Domingo", active:false},
]


export const weekDayMap = () => {
	const weekMap = new Map()
	WeekDaysObj.forEach(d => weekMap.set(d.code, d))
	return weekMap
}
export const ActiveCell = atom<boolean>(false)
export const WeekDays = atom<Map<string, any>>(weekDayMap())



	const buildBlankSchedule = () => ({
		id: uuidv4(),
		name: "Un Schedule",
		startDate: dateForFilter('2021-04-27'),
		endDate: "",
		status: "active"
	})
