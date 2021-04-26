import {atom} from 'jotai'
import {PosterPromise} from '../services/Fetcher'
import {mutate} from 'swr'
import type {AxiosResponse} from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { dateForMenu, dateForFilter } from '../utils/DateUtils'

export const schedulePostPromise = () => {
	const schedule = buildBlankSchedule()
	console.log({schedule})
	PosterPromise(
		`schedules/${schedule.id}`, schedule
	)
}

	const buildBlankSchedule = () => ({
		id: uuidv4(),
		name: "Un Schedule",
		/* startDate: dateForMenu(new Date()), */
		startDate: dateForFilter('2021-04-27'),
		endDate: "",
		status: "active"
	})
