import React, {useState, useEffect} from 'react'
import getMonth from 'date-fns/getMonth'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import {FilterEncodeString, menusFiltersAtom} from '../services/FilterService'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import type {IMeal} from '../models/MealTypes'
import { PicksFilter, TodayPicks, InBetweenDays } from '../utils/DateUtils'
import {useHistory} from 'react-router'
import {useLocalStorage} from '../utils/LocalStorageHook'
import Loader from '../general/components/Loader'
import { RoughNotation} from "react-rough-notation";
import MenuPanel from './components/MenuPanel'
import MenuCalendar from './components/MenuCalendar'
import { CurrentMonth } from '../services/MenuService'

const MenusPage = () => {
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(menusFiltersAtom)
  const [cu] = useLocalStorage('user', '')
  const [prev, setPrev] = useState(TodayPicks)
  const [next, setNext] = useState(TodayPicks)
  const [, setCurrentMonth] = useAtom(CurrentMonth)
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
    <div className="">
      <div className="flex">
        <div className="w-1/2 mr-8 ml-8 mt-8 flex flex-col">
          <div className="w-1/3">
            <RoughNotation
              type="underline"
              strokeWidth={2}
              color={'#ff3331'}
              show={true}
              animationDuration={400}
              iterations={1}
            >
              <h2 className="text-3xl font-bold my-8">Menús</h2>
            </RoughNotation>
          </div>
         <MenuCalendar menus={menus}/>
        </div>
        <MenuPanel />
      </div>
    </div>
  )
}

export default MenusPage


