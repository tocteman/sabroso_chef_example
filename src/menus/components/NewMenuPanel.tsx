import React, {useState} from 'react'
import CloseIcon from '../../svgs/CloseIcon'
import {useAtom} from 'jotai'
import { CurrentDay, DisplayMenuPanel, DisplayNewMenuPanel, menusPost, menusPostPromises, validateMenus, scheduledMenusPostPromises} from '../../services/MenuService'
import type {IMeal} from '../../models/MealTypes'
import MenuForm from './MenuForm'
import {LunchMenu, MenuMap} from '../../services/MenuService'
import {MenuTypes} from '../../services/MenuService'
import { v4 as uuidv4 } from 'uuid';
import {IMenu, initialMenu} from '../../models/MenuTypes'
import format from 'date-fns/format'
import {useLocalStorage} from '../../utils/LocalStorageHook'
import DuplicateIcon from '../../svgs/DuplicateIcon'
import {ToastState, Loading} from '../../services/UiService'
import {mutate} from 'swr'
import { FilterEncodeString, MenusFiltersAtom } from '../../services/FilterService'
import MinusCircle from '../../svgs/MinusCircle'
import CloseCircle from '../../svgs/CloseCircle'
import { CurrentWeek, WeekDays } from '../../services/ScheduleService'

const NewMenuPanel: React.FC<{meals: IMeal[], origin: string}> = ({meals, origin}) => {
  const [cu] = useLocalStorage('user', '')
  const [, setToastState] = useAtom(ToastState)
  const [displayNewMenuPanel, setDisplayNewMenuPanel] = useAtom(DisplayNewMenuPanel)
  const [menuMap, setMenuMap] = useAtom(MenuMap)
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentMenuFilters] = useAtom(MenusFiltersAtom)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)
  const [currentDay] = useAtom(CurrentDay)
  const toggleDropdown = () => setShowDropdown(true) 
  const [duplicable, setDuplicable] = useState(true)
  const [deleting, setDeleting] = useState(false)
	const [currentWeek] = useAtom(CurrentWeek)
	const [weekDaysMap] = useAtom(WeekDays)
	const [, setLoading] = useAtom(Loading)

	const weekDaysArray = () =>
		Array.from(weekDaysMap, ([dayCode, dayInfo]) => ({dayCode, dayInfo}))
		.map(d => d.dayInfo)

  const addMenu = (mt) => {
    const menuId = uuidv4()
    setShowDropdown(false)
		return displayPanel.origin === 'schedule' ? // <- pilas a este <<return>>
			setMenuMap(menuMap.set(menuId, generateScheduledMenu(menuId, mt))) :
			setMenuMap(menuMap.set(menuId, generateMenu(menuId, mt)))
	}

	const generateMenu = (menuId, mt) => ({
		...initialMenu,
		type: mt.code,
		menuDate: format(currentDay, 'yyyy-MM-dd'),
		id: menuId
	})

	const generateScheduledMenu = (menuId, mt) => ({
		...initialMenu,
		type: mt.code,
		id: menuId,
		image: "",
		scheduleWeekId: currentWeek.id,
		dayPosition: weekDaysArray().filter(d => d.status === 'active')[0]?.code,
	})

  const duplicateLunch = () => {
    const lunch = almuerzos()[0].menu
    const menuId = uuidv4()
    setDuplicable(false)
    setMenuMap(menuMap.set(menuId, {
      ...lunch,
      id: menuId,
      main: "",
      tag: ""
    }))
    setTimeout(() => setDuplicable(true), 160)
  }

  const mappedMenus = () => Array.from(menuMap, ([id, menu]) => ({id, menu}))

  const desayunos = () => mappedMenus()
        .filter(m => m.menu.type === 'BREAKFAST')
  const almuerzos = () => mappedMenus()
        .filter(m => m.menu.type === 'LUNCH')
  const cenas = () => mappedMenus()
        .filter(m => m.menu.type === 'DINNER')

  const validateAndPublishMenus = () => {
    const menus: IMenu[] = Array.from(menuMap, ([id, menu]) => ({id, menu}))
			.map(m => m.menu)
    const validation = validateMenus(menus)
    validation.ok !== true ?
      showPublishError(validation) :
			displayPanel.origin === 'schedule' ?
					postScheduledMenus(menus) : postMenus(menus)
	}

  const showPublishError = (validation) => setToastState({status: "error", message: validation.msg})

	const postScheduledMenus = (menus) =>
		menusPost(scheduledMenusPostPromises(menus, cu.id))
			.then(() => {
				setLoading(true)
				mutate(['schedule_menus'])
				setDisplayPanel({...displayPanel, display: false})
				setToastState({status: "ok", message:"Has programado los menús"})
				setDisplayNewMenuPanel(false)
				setTimeout(() => setLoading(false), 200)
				setMenuMap(new Map())
			})
			.catch(err => {
				console.log({err})
				setToastState({status: "error", message: err})
			})

  const postMenus = (menus) =>  
		menusPost(menusPostPromises(menus, cu.id))
			.then(()=> {
				mutate(['menus', FilterEncodeString(currentMenuFilters)])
				setToastState({status: "ok", message:"Has publicado los menús"})
				setMenuMap(new Map())
			})
			.catch(err =>
				setToastState({status: "error", message: err})
			)

	const deleteItem = (menuId) => {
    setDeleting(true)
    menuMap.delete(menuId)
    setTimeout(()=> {
      setDeleting(false)
      setMenuMap(menuMap)
    }, 100)
  }
 
  return (
    <div className="p-4 border-2 rounded shadow-sm bg-crema-125 border-mostaza-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-lg">
            Añadir Menús
          </div> 
          <div className="flex">
            <div className="px-2 py-1 text-3xl font-bold cursor-pointer hover:bg-white" onClick={()=> setShowDropdown(true)}>
              +
            </div>
            {showDropdown && (
              <div className="absolute z-10 mx-6 my-2 border rounded shadow-sm bg-crema-150 border-mostaza-200 ">
                {MenuTypes.map(mt => (
                  <div className="p-2 cursor-pointer hover:bg-white"
                    key={`mt--${mt.name}`}
                    onClick={()=> addMenu(mt)}>
                    {mt.name}
                  </div>)
                )}

              </div>)
            }
          </div>
        </div>
        <div className="w-6 cursor-pointer" 
          onClick={()=>setDisplayNewMenuPanel(false)} >
          <CloseIcon/>
        </div>
      </div>
      { desayunos().length > 0 && 
      <div>
        <div className="py-1 text-xl font-bold">Desayunos</div>
        {desayunos()
          .map(m => (
            <div key={m.id} className="flex items-center">
              <MenuForm
                meals={meals.filter(m=> m.type==='MAIN')}
                menuId={m.id}
              />
              {deleting === false &&<div className="ml-4 font-bold cursor-pointer hover:text-gray-700" onClick={()=>deleteItem(m.id)}>
                <div className="w-4 pt-3">
                  <MinusCircle/> 
                </div>
            </div>}
        {deleting && <div>...</div>}
            </div>
          ))}
        </div>
      }
    { almuerzos().length > 0 && 
    <div>
      <div className="flex items-center">

        <div className="py-1 text-xl font-bold">Almuerzos</div>
        <button className={`${duplicable ? `text-black`: `text-gray-700`} w-6 h-6 cursor-pointer ml-2 hover:text-gray-800` } onClick={() => duplicateLunch()}>
          <DuplicateIcon/>
        </button>
      </div>
      {almuerzos()
        .map((m, i) => (
          <div key={m.id} className="flex">
            <div>
              {i > 0 && <hr className="mt-3 mb-2 border-1 border-mostaza-300"/>}
              <div className="flex">
                <MenuForm
                  meals={meals.filter(m=> m.type==='MAIN')}
                  menuId={m.id}
                  key={`${m.id}-main`}
                />

        {deleting === false &&<div className="ml-4 font-bold cursor-pointer hover:text-gray-700" onClick={()=>deleteItem(m.id)}>
          <div className="w-4 pt-3"><MinusCircle/></div>
            </div>}
        {deleting && <div>...</div>}
      </div>
      <MenuForm
        meals={meals.filter(m=> m.type==='ENTREE')}
        menuId={m.id}
        key={`${m.id}-entree`}
      />
      <MenuForm
        meals={meals.filter(m=> m.type==='DESSERT')}
        menuId={m.id}
        key={`${m.id}-dessert`}
      />
    </div>
  </div>
        ))}
      </div>
    }
    { cenas().length > 0 && 
    <div>
      <div className="py-1 text-xl font-bold">Cenas</div>
        {cenas()
          .map(m => (
            <div key={m.id} className="flex">
              <MenuForm
                meals={meals.filter(m => m.type === 'MAIN')}
                menuId={m.id}
                key={`${m.id}-main`}
              />
              {deleting === false && <div className="ml-4 font-bold cursor-pointer hover:text-gray-700" onClick={()=>deleteItem(m.id)}>
                <div className="w-4 pt-3"><MinusCircle/></div>
            </div>
              }
            {deleting && <div>...</div>}

            </div>
          ))}
        </div>
      }
    {menuMap.size > 0 && <button className="my-4 main-button" onClick={() => validateAndPublishMenus()}>Publicar</button>}


  </div>
) 
}

export default NewMenuPanel
