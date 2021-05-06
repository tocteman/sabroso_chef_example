import React, {useState, useEffect} from 'react'
import getMonth from 'date-fns/getMonth'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import {FilterEncodeString, MenusFiltersAtom} from '../services/FilterService'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import { PicksFilter, TodayPicks, InBetweenDays } from '../utils/DateUtils'
import {useHistory} from 'react-router'
import {useLocalStorage} from '../utils/LocalStorageHook'
import Loader from '../general/components/Loader'
import MenuPanel from './components/MenuPanel'
import MenuCalendar from './components/MenuCalendar'
import {CurrentDay, CurrentMonth, DisplayMenuPanel} from '../services/MenuService'
import { Transition } from '@headlessui/react'
import RoughTitle from "../general/components/RoughTitle"
import {PanelTransitionProps} from '../services/UiService'

const MenusPage = () => {
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(MenusFiltersAtom)
  const [cu] = useLocalStorage('user', '')
  const [prev, setPrev] = useState(TodayPicks)
  const [next, setNext] = useState(TodayPicks)
  const [, setCurrentMonth] = useAtom(CurrentMonth)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)
  const [currentDay] = useAtom(CurrentDay)
  const history = useHistory()
  const { data: menus } = useSWR(
    ['menus', FilterEncodeString(currentMenuFilters)],
    FilteredFetcher,
  ) // chefId = chefId
  const { data: meals } = useSWR(['meals'], Fetcher) // chefId = chefId
  useEffect(() => {
    ;(!cu || !cu.chefId) && history.push('/login')
    setCurrentMonth(getMonth(new Date().valueOf()))
    const dateStrings: string = InBetweenDays([prev, next])
    setCurrentMenuFilters([PicksFilter(cu.chefId, 'chefId', '=')])
  }, [])
  if (!meals) return <Loader />
  if (!menus) return <Loader />


  return (
      <div className="flex">
        <div className="flex flex-col w-full sm:w-1/2 p-8">
          <div className="w-1/3">
						<RoughTitle title={"Menús"}/>
          </div>
					<MenuCalendar menus={menus}/>
        </div>
        <Transition
          show={ displayPanel.display === true}
					{...PanelTransitionProps}
				>
          <MenuPanel meals={meals} />
        </Transition>
      </div>
  )
}

export default MenusPage
