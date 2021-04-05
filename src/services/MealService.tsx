import React from 'react'
import {atom} from 'jotai'
import {ICompositeMenu, IMeal, initialCompositeMenu} from '../models/MealTypes'
import {initialMeal} from '../models/MealTypes'
import type {ISliceRange} from '../models/UiTypes'
import type {IMenu} from 'src/models/MenuTypes'

const is:ISliceRange = {from: 0, to:5}

export const MainSlice = atom<ISliceRange>(is)
export const EntreeSlice = atom<ISliceRange>(is)
export const DessertSlice = atom<ISliceRange>(is)

export const CurrentMeal = atom<IMeal>(initialMeal)


export const BreakfastMenu = atom<string>("")
export const DinnerMenu = atom<string>("")
export const LunchMenu = atom<ICompositeMenu>(initialCompositeMenu)

export const NewMenuMap = atom<Map<string, IMenu>>(new Map())
export const NewMenuObj = atom<{[id:string]: IMenu}>({})

export const selectedMeal = atom<string>("")


