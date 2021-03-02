import React, {useState, useEffect} from 'react'
import tw from 'twin.macro'
import {css} from '@emotion/react'
import getDay from 'date-fns/getDay'
import getMonth from 'date-fns/getMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import esLocale from 'date-fns/locale/es'
import {dateForFilter, dateForMenu, diasSemana, numberToDate} from '../utils/DateUtils'
import type {IDiaSemana} from '../utils/DateUtils'
import ChevronLeft from '../svgs/ChevronLeft'
import ChevronRight from '../svgs/ChevronRight'
import CloseIcon from '../svgs/CloseIcon'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import {FilterEncodeString, menusFiltersAtom} from '../services/FilterService'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import type {IMeal} from '../models/MealTypes'
import { PicksFilter, TodayPicks, InBetweenDays } from '../utils/DateUtils'
import {atom} from 'jotai'
import {useHistory} from 'react-router'
import {useLocalStorage} from '../utils/LocalStorageHook'
import {groupBy, menusGroupBy} from '../utils/JsUtils'
import type {IMenu} from 'src/models/MenuTypes'
import Loader from '../general/components/Loader'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

const MenusPage = () => {
  const [cu] = useLocalStorage('user', '')
  const history = useHistory()
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(menusFiltersAtom)
  const [prev, setPrev] = useState(TodayPicks)
  const [next, setNext] = useState(TodayPicks)
  const [currentMonth, setCurrentMonth] = useState(0)
  const [currentDay, setCurrentDay] = useState(0)
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

  let currentDays
  const daysOfMonth = (month: number) => {
    return eachDayOfInterval({
      start: new Date(2021, month, 1),
      end: new Date(2021, month, getDaysInMonth(new Date(2021, month))),
    })
  }

  const formatSingleDay = (theDate: Date) => {
    return format(theDate.valueOf(), 'd')
  }

  currentDays = daysOfMonth(currentMonth)
  const groupByDate = groupBy('menuDate')
  const currentMenus = groupByDate(menus)
  const menusPerDay = (menuDate: Date) => currentMenus[dateForMenu(menuDate)]

  const renderDay = () => Object.entries(menusPerDay(new Date(currentDay)))

  const renderTag = (currentTag: string) =>
    currentTag === 'null' ? '' : currentTag

  return (
    <div tw="">
      <div tw="flex">
        <div tw="w-1/2 mr-8 ml-8 mt-8">
          <div tw="w-1/3">
            <RoughNotation
              type="underline"
              strokeWidth={2}
              color={'#ff3331'}
              show={true}
              animationDuration={400}
              iterations={1}
            >
              <h2 tw="text-3xl font-bold my-8">Menús</h2>
            </RoughNotation>
          </div>
          <div tw="flex">
            <div
              onClick={() => setCurrentMonth(currentMonth - 1)}
              tw="cursor-pointer w-4 pt-1 mr-2 hover:text-red-500"
            >
              <ChevronLeft />
            </div>
            <h3 tw="font-bold text-xl text-center mb-2">
              {format(new Date(2021, currentMonth, 1).valueOf(), 'MMMM yyyy', {
                locale: esLocale,
              })}
            </h3>
            <div
              onClick={() => setCurrentMonth(currentMonth + 1)}
              tw="cursor-pointer w-4 pt-1 ml-2 hover:text-red-500"
            >
              <ChevronRight />
            </div>
          </div>
          <div tw="grid grid-cols-7">
            {diasSemana.map((dia: IDiaSemana) => (
              <span
                tw="text-sm text-center my-2 font-light"
                key={dia.weekDayName}
              >
                {dia.weekDayName.slice(0, 1)}
              </span>
            ))}
          </div>
          <div tw="grid grid-cols-7 gap-1 text-center text-xl">
            {currentDays.map((day) => (
              <div
                key={day.valueOf()}
                tw="border-crema-200 py-4 px-2 border-2 border-solid bg-white hover:bg-white border-transparent hover:border-mostaza-300 cursor-pointer rounded hover:shadow-sm"
                css={{
                  gridColumnStart: `${(getDay(day) + 1).toString() || `6`}`,
                  backgroundColor: `${
                    menusPerDay(day)?.length >= 3
                      ? '#fffad6'
                      : menusPerDay(day)?.length >= 1
                      ? '#fffcec'
                      : '#fffdfd'
                  }`,
                  borderColor: `${
                    menusPerDay(day)?.length >= 3
                      ? '#fcec71'
                      : menusPerDay(day)?.length >= 1
                      ? '#fcf1a1'
                      : '#ffead3'
                  }`,
                }}
                onClick={() => setCurrentDay(day.valueOf())}
              >
                {formatSingleDay(day)}
              </div>
            ))}
          </div>
        </div>
        <div
          css={[
            tw`w-1/2 pl-8 ml-8`,
            currentDay > 0 &&
              tw`h-full min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`,
          ]}
        >
          <div tw="flex flex-col">
            <div tw="mt-16 flex justify-between w-full">
              <h3 tw="text-xl">
                {currentDay > 0 && (
                  <div>
                    <span tw="font-bold">
                      {`${
                        diasSemana.filter(
                          (dia) => dia.weekDayNumber === getDay(currentDay),
                        )[0].weekDayName
                      }`}
                    </span>
                    {`, ${format(currentDay, 'dd/MMM/yyyy', {
                      locale: esLocale,
                    })}`}
                  </div>
                )}
              </h3>
              {currentDay > 0 && (
                <div
                  tw="cursor-pointer text-black hover:text-red-500 w-6"
                  onClick={() => setCurrentDay(0)}
                >
                  <CloseIcon />
                </div>
              )}
            </div>
            {currentDay > 0 && <hr tw="mt-2 border border-mostaza-200" />}
            <div tw="mt-4">
              {currentDay > 0 &&
                menusPerDay(new Date(currentDay))?.length > 0 &&
                renderDay().map(([k, v]) => (
                  <div>
                    <div tw="my-2 flex items-center rounded hover:bg-crema-100 p-2 cursor-not-allowed border-2 border-transparent hover:border-crema-200">
                      <div tw="text-xl font-bold">
                        ~ {v.tag.includes('null') ? '' : v.tag.slice(0, 1)} ~
                      </div>
                      <div tw="ml-4 text-lg">
                        <span tw="font-bold text-xl"> {v.main} </span> <br />
                        {v.entree} | {v.dessert}
                      </div>
                    </div>
                    <hr tw="border border-crema-200" />
                  </div>
                ))}
            </div>
              {currentDay > 0 &&
              <div tw="mt-40">
                <button tw="rounded-2xl border-2 border-mostaza-200 bg-gradient-to-b from-red-400 to-red-500 text-xl font-bold mx-auto block px-6 py-2 text-crema-100 text-center hover:border-mostaza-200 shadow-sm hover:from-red-300 cursor-not-allowed">Añadir Menú</button>
              </div>
                }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenusPage


