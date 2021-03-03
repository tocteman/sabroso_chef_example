import React from 'react'
import {atom} from 'jotai'
import type {IMenu, IMenuPerDay} from '../models/MenuTypes'
import {initialMenu, initialMenuPerDay} from '../models/MenuTypes'

export const CurrentMenu = atom<IMenu>(initialMenu)

export const CurrentMonth = atom<number>(0)
export const CurrentDay = atom<number>(0)
export const MenusPerDay = atom<IMenuPerDay[]>([initialMenuPerDay])
