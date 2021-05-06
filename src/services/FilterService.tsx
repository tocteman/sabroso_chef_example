import React from 'react'
import type {Filter} from '../models/FilterTypes'
import { initialFilter } from '../models/FilterTypes'
import { Atom, atom, useAtom  } from 'jotai'

export const OrderFiltersAtom = atom<Filter[]>([])
export const MealsFiltersAtom = atom<Filter[]>([])
export const MenusFiltersAtom = atom<Filter[]>([])
export const ClientsFiltersAtom = atom<Filter[]>([])
export const ProposalsFiltersAtom = atom<Filter[]>([])
export const SingleScheduleFiltersAtom = atom<Filter[]>([])

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
