import React from 'react'
import type {IMenu} from '../models/MenuTypes'

export const Capitalize = (str: string) => {
  return str.toUpperCase()
}

 export const sortByStr = (arr:any[], prop:string) =>        
      arr.sort((a, b) => (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0))

export const menuKey = (menu: IMenu) => `${menu.main}, ${menu.entree}, ${menu.dessert}`.replace(/\s+,/g , ",")
