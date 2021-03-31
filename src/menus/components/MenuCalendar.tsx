import React, {useState} from 'react'
import getDay from 'date-fns/getDay'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'
import { useAtom } from 'jotai'
import {dateForFilter, dateForMenu, diasSemana, numberToDate} from '../../utils/DateUtils'
import type {IDiaSemana} from '../../utils/DateUtils'
import ChevronLeft from '../../svgs/ChevronLeft'
import ChevronRight from '../../svgs/ChevronRight'
import {CurrentDay, CurrentMonth, MenusPerDay} from '../../services/MenuService'
import {groupBy} from '../../utils/JsUtils'
import type {IMenu, IMenusPerDay} from '../../models/MenuTypes'

const MenuCalendar: React.FC<{menus:IMenu[]}> = ({menus}) => {
  const [, setCurrentDay] = useAtom(CurrentDay)
  const [, setMenusPerDay] = useAtom(MenusPerDay)
  const [currentMonth, setCurrentMonth] = useAtom(CurrentMonth)
  const daysOfMonth = (month: number) => {
    return eachDayOfInterval({
      start: new Date(2021, month, 1),
      end: new Date(2021, month, getDaysInMonth(new Date(2021, month))),
    })
  }

  const formatSingleDay = (theDate: Date) => {
    return format(theDate.valueOf(), 'd')
  }

  let currentDays;

  currentDays = daysOfMonth(currentMonth)
  const groupByDate = groupBy('menuDate')
  const currentMenus = groupByDate(menus)
  const mpd = (menuDate: Date) => currentMenus[dateForMenu(menuDate)]


  const renderTag = (currentTag: string) =>
    currentTag === 'null' ? '' : currentTag
  return (
    <div>
      <div className="flex">
        <div
          onClick={() => setCurrentMonth(currentMonth - 1)}
          className="w-4 pt-1 mr-2 cursor-pointer hover:text-red-500"
        >
          <ChevronLeft />
        </div>
        <h3 className="mb-2 text-xl font-bold text-center">
          {format(new Date(2021, currentMonth, 1).valueOf(), 'MMMM yyyy', {
            locale: esLocale,
          })}
        </h3>
        <div
          onClick={() => setCurrentMonth(currentMonth + 1)}
          className="w-4 pt-1 ml-2 cursor-pointer hover:text-red-500"
        >
          <ChevronRight />
        </div>
        </div>
        <div className="grid grid-cols-7">
          {diasSemana.map((dia: IDiaSemana) => (
            <span
              className="my-2 text-sm font-light text-center"
              key={dia.weekDayName}
            >
              {dia.weekDayName.slice(0, 1)}
            </span>
          ))}
        </div>
        <div className="text-xl text-center grid grid-cols-7 gap-1">
          {currentDays.map((day) => (
            <div
              key={day.valueOf()}
              className={`border-crema-200 py-4 px-2 border-2 border-solid bg-white hover:bg-white border-transparent hover:border-mostaza-300 cursor-pointer rounded hover:shadow-sm  
              col-start-${`${(getDay(day) + 1)}` || `6`}
              ${mpd(day)?.length >= 3 ?
                  `bg-crema-200 border-mostaza-300 ` :
                  mpd(day)?.length >= 1 ?
                    `bg-crema-125 border-mostaza-200` :
                    `bg-crema-100 border-crema-200`} 
              `}
              onClick={() => {

                setCurrentDay(day.valueOf());
                setMenusPerDay(mpd(day))
              }}
            >
              {formatSingleDay(day)}
            </div>
          ))}
        </div>
      </div>
  )
}

export default MenuCalendar
