import React, {useState, useEffect} from 'react'
import {useAtom} from 'jotai'
import CronogramaDailyCell from './CronogramaDailyCell'
import {WeekDays, CurrentWeek, weekDayMap} from '../../services/ScheduleService'
import Loader from '../../general/components/Loader'



const CronogramaWeeklyColumn = ({weekPosition, menusPerWeek}) => {

	const [weekDaysMap, setWeekDaysMap] = useAtom(WeekDays)
	const [currentWeek, setCurrentWeek] = useAtom(CurrentWeek)
	const [showWeeks, setShowWeeks] = useState(true)

	useEffect(() => {setWeekDaysMap(weekDayMap)}, [])


	const weekDaysArray = () =>
		Array.from(weekDaysMap, ([dayCode, dayInfo]) => ({dayCode, dayInfo}))
		.map(d => d.dayInfo)

	const menusPerDay = (dayCode) =>
		menusPerWeek?.filter(m => m.dayPosition === dayCode) || []

	const daysToRender = (days) => (
		<div className="flex">
			{days.map(d => (
				<div key={`${weekPosition}-${d.code}`}  className="m-1">
					<CronogramaDailyCell
						menus={menusPerDay(d.code)}
						weekDay={d}
					/>
			</div>
			))}
		</div>
	)

	const isActive = () => currentWeek.weekPosition === weekPosition


  return (
    <div className={` ${isActive() ? `column-striped-active hover:bg-crema-200 ` : `column-striped-inactive hover:bg-mostaza-100 ` }
   hover:border-mostaza-200 border-crema-200 border-8 rounded-lg my-4 flex flex-col px-4 py-4 cursor-pointer`}>
			 <div className="flex flex-col items-end justify-center">
				 <div className="text-sm uppercase leading-none text-right pr-8">
					Semana
				 </div>
				 <div className="text-5xl font-bold pr-8">
					 {weekPosition}
				 </div>
			 </div>
			{weekDaysMap && isActive() &&
			 <>
				{daysToRender(weekDaysArray().slice(0,4))}
				{daysToRender(weekDaysArray().slice(-3))}
			 </>
			}
		</div>
  ) 


}


export default CronogramaWeeklyColumn
