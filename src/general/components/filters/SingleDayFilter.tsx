import React from 'react'
import {useAtom} from 'jotai'
import { PicksFilter, TodayPicks, InBetweenDays, dateForFilter } from '../../../utils/DateUtils'
import { SingleDayDate } from '../../../services/OrderService'
import { OrderFiltersAtom } from '../../../services/FilterService'

const SingleDayFilter = ({className}) => {
	const [today, setToday] = useAtom(SingleDayDate)
  const [currentOrderFilters, setCurrentOrderFilters] = useAtom( OrderFiltersAtom)

	const updateDates = (antes = today, despues = today) => {
    const dateStrings = InBetweenDays([antes, despues])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
  }

	const setDate = (dateString: string) => {
		setToday(dateString)
    updateDates(dateString, dateString)
  }

	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-sm uppercase">fecha</label>
			<input
				type="date"
				className="std-input"
				value={today}
				onChange={e => setDate(e.target.value)}
			/>
		</div>
	)
}

export default SingleDayFilter
