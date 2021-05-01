import React from 'react'
import { useAtom } from 'jotai'
import CloseIcon from '../../svgs/CloseIcon'
import {DisplayMenuPanel, CurrentDay} from '../../services/MenuService'
import { diasSemana } from '../../utils/DateUtils'
import {WeekDays, CurrentWeek} from '../../services/ScheduleService'
import getDay from 'date-fns/getDay'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'

const MenuPanelTopbar = () => {
	const [currentDay] = useAtom(CurrentDay)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)
	const [weekDaysMap] = useAtom(WeekDays)
	const [currentWeek] = useAtom(CurrentWeek)

	const weekDaysArray = () =>
		Array.from(weekDaysMap, ([dayCode, dayInfo]) => ({dayCode, dayInfo}))
		.map(d => d.dayInfo)

	const renderDateTitle = () => (
		<h3 className="text-xl">
			{displayPanel.origin === 'menu' &&
			 <div>
				<span className="font-bold">
					{`${diasSemana.filter((dia) => dia.weekDayNumber === getDay(currentDay),)[0].weekDayName}`}
				</span>
				{`, ${format(currentDay, 'dd/MMM/yyyy', {locale: esLocale,})}`}
			</div>
			}
			{displayPanel.origin === 'schedule' &&
			 <div>
				 <span className="font-bold mr-2">
				{weekDaysArray().filter(d => d.status === 'active')[0]?.name}
				 </span>
					::  Semana {currentWeek?.weekPosition}
			 </div>
			}

		</h3>
	)

	return (
		<div className="flex justify-between w-full mt-8">
			<div> {renderDateTitle()} </div>
			<div className="w-6 text-black cursor-pointer hover:text-red-500" onClick={() => setDisplayPanel({...displayPanel, display: false})} >
				<CloseIcon />
			</div>
		</div>
	)
}

export default MenuPanelTopbar
