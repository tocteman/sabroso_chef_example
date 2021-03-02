import React from 'react'
import type {IMenu} from '../models/MenuTypes'

export const Capitalize = (str: string) => {
  return str.toUpperCase()
}


export const menuKey = (menu: IMenu) => `${menu.main}, ${menu.entree}, ${menu.dessert}`.replace(/\s+,/g , ",")
