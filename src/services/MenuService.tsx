import React from 'react'
import {atom} from 'jotai'
import type {IMenu, IMenuPerDay, IMenuType} from '../models/MenuTypes'
import {initialMenu, initialMenuPerDay} from '../models/MenuTypes'


export const MenuTypes: IMenuType[] = [
    {code: 'BREAKFAST', name: 'Desayuno', maxHourTime: null},
    {code: 'LUNCH', name: 'Almuerzo', maxHourTime: 10},
    {code: 'DINNER', name: 'Cena', maxHourTime: 15},
  ]

export const CurrentMenu = atom<IMenu>(initialMenu)

export const CurrentMonth = atom<number>(0)
export const CurrentDay = atom<number>(0)
export const MenusPerDay = atom<IMenuPerDay[]>([initialMenuPerDay])
export const CurrentMenuType = atom<string>("LUNCH")
export const CurrentServiceType =atom<string>("Vianda")


export const DisplayPanel =atom<boolean>(false)
