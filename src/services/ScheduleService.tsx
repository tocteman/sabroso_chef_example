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

export const ActiveCell = atom<boolean>(false)

export const WeekDays = [
	{code: "MONDAY", name: "Lunes"},
	{code: "TUESDAY", name: "Martes"},
	{code: "WEDNESDAY", name: "Miércoles"},
	{code: "THURSDAY", name: "Jueves"},
	{code: "FRIDAY", name: "Viernes"},
	{code: "SATURDAY", name: "Sábado"},
	{code: "SUNDAY", name: "Domingo"},
]

	const buildBlankSchedule = () => ({
		id: uuidv4(),
		name: "Un Schedule",
		startDate: dateForFilter('2021-04-27'),
		endDate: "",
		status: "active"
	})
