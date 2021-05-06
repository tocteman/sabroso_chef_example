import React, {useEffect} from 'react'
import { atom, useAtom } from 'jotai'
import { CurrentDay, DisplayEditMenuPanel, DisplayNewMenuPanel, MenusPerDay, MenuMap, DisplayMenuPanel, CurrentEditMenu } from '../../services/MenuService'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'
import getDay from 'date-fns/getDay'
import { sortByStr } from '../../utils/StringUtils'
import NewMenuPanel from './NewMenuPanel'
import type {IMeal} from '../../models/MealTypes'
import EditMenuPanel from './EditMenuPanel'
import { IMenu, initialMenu} from '../../models/MenuTypes'
import {WeekDays, CurrentWeek } from '../../services/ScheduleService'
import MenuPanelTopbar from './MenuPanelTopbar'

const MenuPanel: React.FC<{meals: IMeal[]}> = ({meals}) => {
  const [currentDay, setCurrentDay] = useAtom(CurrentDay)
  const [menusPerDay, setMenusPerDay] = useAtom(MenusPerDay)
  const [menuMap, setMenuMap] = useAtom(MenuMap)
  const [displayNewMenuPanel, setDisplayNewMenuPanel] = useAtom(DisplayNewMenuPanel)
  const [currentEditMenu, setCurrentEditMenu] = useAtom(CurrentEditMenu)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)
	const [weekDaysMap] = useAtom(WeekDays)
	const [currentWeek] = useAtom(CurrentWeek)

	useEffect(() => {
		setCurrentEditMenu(initialMenu)
		displayPanel?.origin === 'schedule' ?
			console.log("algo") :
			currentDay > 0 ?
				setDisplayPanel({...displayPanel, display: true}) :
				setDisplayPanel({...displayPanel, display: false})
	}, [])
  
  const editMenu = (menu:IMenu) => {
    const newMap = new Map()
    newMap.set(menu.id, menu)
    setMenuMap(newMap)
		setCurrentEditMenu(menu)
  }

  const renderDay = () =>
			menusPerDay?.length > 0 ?
				Object.entries(sortByStr(menusPerDay, 'tag')).map(([k, v]) => v)
				: []

	return (
		<div className={`w-full ml-8 ${ displayPanel?.display === true && `h-full min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`}  `} >
			<div className="flex flex-col p-4 sm:p-8">
				{displayPanel?.display === true  && (
					<>
					<MenuPanelTopbar/>
					<hr className="mt-2 border border-mostaza-200" />
					<div className="mt-2">
						{renderDay().map((m, i) => (
							<div key={`${m.main}-${i}`}>
								{currentEditMenu.id !== m.id &&
								<div onClick={() => editMenu(m)}
									className="flex items-center px-2 my-1 border-2 border-transparent rounded cursor-pointer hover:bg-crema-100 hover:border-crema-200">
									<div className="font-bold">
										~ {m.tag.includes('null') ? '' : m.tag.slice(0, 1)} ~
									</div>
									<div className="ml-4">
										<span className="font-bold"> {m.main} </span>
										<br />
										{m.entree && m.entree !== 'null' && m.dessert !== 'null' && <div> {m.entree} | {m.dessert} </div>}
									</div>
								</div>
							}
								{currentEditMenu?.id.length > 0 && currentEditMenu.id === m.id &&
								 <div className="my-2"> <EditMenuPanel menu={m} meals={meals}/> </div>}
								<hr className="border border-crema-200" />
							</div>
						)) }
							</div>
							<div className="mt-25">
								{ !displayNewMenuPanel &&
									<button className="main-button"
										onClick={() => setDisplayNewMenuPanel(true)}>
										Añadir Menús +
									</button>
								}
								{ displayNewMenuPanel &&
									<NewMenuPanel meals={meals} origin=""/>
								}
						</div>
					</>
			)}
		</div>
	</div>
)
}

export default MenuPanel
