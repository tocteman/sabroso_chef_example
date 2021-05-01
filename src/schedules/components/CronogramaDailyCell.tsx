import React, {useState} from 'react'
import {useAtom} from 'jotai'
import {ActiveCell, WeekDays, weekDayMap} from '../../services/ScheduleService'
import { Popover, Transition } from "@headlessui/react";
import { DisplayScheduledMenuPanel, DisplayMenuPanel, MenuTypes, CurrentDay, MenusPerDay, scheduledMenusPostPromises} from '../../services/MenuService'
import { initialMenu } from '../../models/MenuTypes';


const CronogramaDailyCell = ({weekDay, menus}) => {
  const [weekDaysMap, setWeekDaysMap] = useAtom(WeekDays)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)
	const [, setCurrentEditMenu] = useAtom(CurrentDay)
  const [menusPerDay, setMenusPerDay] = useAtom(MenusPerDay)

	const setMenuType = (mt) => {
		setTimeout(() => {
		setDisplayPanel({origin: "schedule", display: true})
		}, 100)
		// determinar tipo de menú
	}


	console.log({menus})

	const setActiveDay = (d) => {
		setMenusPerDay(menus)
		const newWeekDaysMap = weekDayMap()
		newWeekDaysMap.set(d.code, {...d, status: "active"})
		setWeekDaysMap(newWeekDaysMap)
		setCurrentEditMenu(initialMenu)
		setDisplayPanel({origin: "schedule", display: true})
	}



  return (
		<div onClick={() => setActiveDay(weekDay)}
			className={
			`justify-center bg-transparent my-4 text-center border-2
			 font-bold rounded shadow-sm text-lg
			  ${ weekDay.status === "active" ?
				    `bg-white p-4 border-yellow-500 border-2 rounded shadow-sm ` :  `bg-crema-125 p-4 hover:bg-white ` }
					${ menus.length > 0 ?
						` border-red-300` : ` border-mostaza-300` }
						` }

	>
			<div className="">
				{weekDay.name}
			</div>
  {weekDay.status === 'estovaacambiar' && (
    <div>{MenuTypes.map(mt => (
      <div key={`mt-${mt.name}`}
				className="hover:bg-mostaza-200 my-1"
				onClick={()=>setMenuType(mt)}>
        {mt.name}
      </div>
    ))}</div>)
  }
  </div>
  ) 
}

export default CronogramaDailyCell
