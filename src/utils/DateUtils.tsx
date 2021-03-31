import React from 'react'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'
import type { Filter } from '../models/FilterTypes'
import parse from 'date-fns/parse'

export const LocalHourFix = 21600000
21600000
export const PicksFilter = (valueString: string, fieldString:string, operator:string) => ({
    field: fieldString,
    value: valueString,
    operator: operator
  })

export const InBetweenDays = (dateStrings: string[]) => {
  const newDateStrings =  dateStrings
    .map(ds => `${format(new Date(ds).valueOf() + LocalHourFix, 'yyyy-MM-dd')} 00:00:00`)
    .toString().replace(',', ', ')
  return newDateStrings
}

export const dateForMenu = (menuDate: Date) => 
  `${format(menuDate.valueOf() + LocalHourFix, 'yyyy-MM-dd')}`

export const dateForFilter = (dateString: string) => 
  `${format(new Date(dateString).valueOf() + LocalHourFix, 'yyyy-MM-dd hh:mm:ss')}`.replace(',', ', ')

export const numberToDate = (dateNumber: number) => 
  `${format(dateNumber + LocalHourFix, 'yyyy-MM-dd hh:mm:ss')}`.replace(',', ', ')

export const Ddmm = (dateString: string) => 
  format(new Date(dateString).valueOf(), 'dd/MMM', {locale: esLocale})

export interface IDiaSemana {
  weekDayNumber: number;
  weekDayName: string;
}

export const diasSemana: IDiaSemana[] = [
  {weekDayNumber: 0, weekDayName: 'Domingo'},
  {weekDayNumber: 1, weekDayName: 'Lunes'},
  {weekDayNumber: 2, weekDayName: 'Martes'},
  {weekDayNumber: 3, weekDayName: 'Miércoles'},
  {weekDayNumber: 4, weekDayName: 'Jueves'},
  {weekDayNumber: 5, weekDayName: 'Viernes'},
  {weekDayNumber: 6, weekDayName: 'Sábado'},

]

export const TodayPicks = () => {
  return format(new Date().valueOf(), 'yyyy-MM-dd') 
}

export const parsed = (dateString: string, fmt ="yyyy-MM-dd")  =>
  parse(dateString, fmt, new Date())

