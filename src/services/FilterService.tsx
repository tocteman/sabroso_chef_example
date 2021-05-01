import React from 'react'
import type {Filter} from '../models/FilterTypes'
import { initialFilter } from '../models/FilterTypes'
import { Atom, atom, useAtom  } from 'jotai'

export const orderFiltersAtom = atom<Filter[]>([])
export const mealsFiltersAtom = atom<Filter[]>([])
export const menusFiltersAtom = atom<Filter[]>([])
export const clientsFiltersAtom = atom<Filter[]>([])
export const proposalsFiltersAtom = atom<Filter[]>([])
export const singleScheduleFiltersAtom = atom<Filter[]>([])
export const FilterEncodeString = (currentAtomValue:any) => {
  const filters = currentAtomValue
  if (filters.length > 0) {
    return filters.map((filter:Filter, index:number) => {
      const field = encodeURIComponent(`filters[${index}][field]`) + `=${filter.field}`;
      const value = encodeURIComponent(`filters[${index}][value]`) + `=${filter.value}`;
      const operator = encodeURIComponent(`filters[${index}][operator]`) + `=${filter.operator}`;
      return `${field}&${value}&${operator}`;
    }).join('&').trim();

  } else { 
    return ""
  }
}

export const SimpleFilter = (valueString: string, fieldString:string, operator:string) => ({
    field: fieldString,
    value: valueString,
    operator: operator
  })
