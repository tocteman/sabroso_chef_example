import {useAtom} from 'jotai'
import React, {useState} from 'react'
import {ActiveCell, WeekDays} from '../../services/ScheduleService'
import { Popover, Transition } from "@headlessui/react";

const CronogramaDailyCell = ({weekDay}) => {
  const [weekDaysMap, setWeekDaysMap] = useAtom(WeekDays)
  const mts = [
    {name: "Desayuno"},
    {name: "Almuerzo"},
    {name: "Cena"}
	]

	const setMenuType = () => {
		// abrir panel
	}

  return (
  <div className={`${ weekDay.status === "active" ? `bg-white p-6 border-crema-150 border-2 rounded shadow-sm ` : `bg-crema-125 p-6` }
 justify-center bg-transparent my-4 text-center text-xl border-mostaza-300 font-bold text-lg`}>
			<div className="">
				{weekDay.name}
			</div>
  {weekDay.status === 'active' && (
    <div>{mts.map(m => (
      <div key={`mt-${m.name}`}
				className="hover:bg-mostaza-200 my-1"
				onClick={()=>console.log("clicked")}>
        {m.name}
      </div>
    ))}</div>)
  }
  </div>
  ) 
}

export default CronogramaDailyCell
