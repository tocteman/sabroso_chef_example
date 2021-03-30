import React from 'react'
import type {IMenu} from '../models/MenuTypes'
import type { IOrderDetails } from '../models/OrderTypes'

export const Capitalize = (str: string) => {
  return str.toUpperCase()
}

 export const sortByStr = (arr:any[], prop:string) =>        
      arr.sort((a, b) => (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0))

export const menuKey = (menu: IMenu) => 
   (menu.type === 'BREAKFAST' || menu.type === 'DINNER') ?
   singleMealMenu(menu.main) :
   menuStr(`${menu.main}, ${menu.entree}, ${menu.dessert}`)

export const menuStr = (menuString:string) =>
     menuString
      .replace(/^\s/, "")
      .replace(/\s$/, "")
      .replace(/\s+,/g, ",")

export const singleMealMenu = (menuString: string) => 
     menuString
      .trim()
      .replace(/[\s]?,[\s]?[\s]?/g, "")

export const replaceMenuStr = (orderDetails: IOrderDetails) => 
    (orderDetails.type === 'BREAKFAST' || orderDetails.type === 'DINNER') ?
       singleMealMenu(orderDetails.details) :
       menuStr(orderDetails.details)

