import React from 'react'
import {useAtom} from 'jotai'
import CronogramaDailyCell from './CronogramaDailyCell'
import {WeekDays} from '../../services/ScheduleService'

const CronogramaWeeklyColumn = ({weekPosition, status}) => {

	const [weekDaysMap, setWeekDaysMap] = useAtom(WeekDays)

	const setActiveDay = (d) => setWeekDaysMap(
		weekDaysMap.set(d.code, {...d, status: "active"})
	)

	const daysToRender = (days) =>
		<div className="flex">
			{days.map(d => (
			<div onClick={()=> setActiveDay(d)}>
					<CronogramaDailyCell
						weekDay={d}
						key={`${weekPosition}-${d.code}`}
					/>
			</div>
			))}
		</div>

	const weekDaysArray = () =>
		Array.from(weekDaysMap, ([dayCode, dayInfo]) => ({dayCode, dayInfo}))
		.map(d => d.dayInfo)

  return (
    <div className={`${status === "active"? `cronograma-striped-active hover:bg-white ` : `column-striped-inactive hover:bg-mostaza-100 ` }   hover:border-mostaza-200 border-crema-200 border-8 rounded-lg my-4 mx-4 flex flex-col px-4 py-4 cursor-pointer`}>
      {weekDaysMap && status === "active" &&
			 <>
				{daysToRender(weekDaysArray().slice(0,4))}
				{daysToRender(weekDaysArray().slice(-3))}
			 </>
			}

			{status !== "active" &&
			 <div className="w-32 flex flex-col items-center justify-center">
				 <div className="text-lg font-bold">
					Semana
				 </div>
				 <div className="text-5xl font-bold my-2">
					 3
				 </div>
			 </div>
			}
    </div>
  ) 


}


export default CronogramaWeeklyColumn
