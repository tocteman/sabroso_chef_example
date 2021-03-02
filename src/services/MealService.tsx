import React from 'react'
import {atom} from 'jotai'
import type {IMeal} from '../models/MealTypes'
import {initialMeal} from '../models/MealTypes'
import type {ISliceRange} from '../models/UiTypes'

const is:ISliceRange = {from: 0, to:5}

export const MainSlice = atom<ISliceRange>(is)
export const EntreeSlice = atom<ISliceRange>(is)
export const DessertSlice = atom<ISliceRange>(is)

export const CurrentMeal = atom<IMeal>(initialMeal)



