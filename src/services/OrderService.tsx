import React from 'react'
import { atom } from 'jotai'
import type { IGroupAndQuantity, IOrder, IOrderDetails, IReducedMenu } from '../models/OrderTypes'
import type {IParsedGroup} from '../models/GroupTypes'

export const viewAtom = atom<String>('cocina') 

export const groupByGroupAndTag = (
  groupedOrders: IOrder[],
  parsedGroups: IParsedGroup[],
  currentMenus: Map<string, string>
) => {
  const finalparse:any[] = []
  groupedOrders
    .map(order => ({...order, details: JSON.parse(order.details)}))
    .filter(order => order.status !== 'CANCELED')
    .forEach((po:IOrder) => {
      po.details.length> 1 ?
      po.details.forEach((detail:IOrderDetails) =>
        finalparse.push(mapDetails(po, detail, parsedGroups, currentMenus))
      ) :
      finalparse.push(mapDetails(po, po.details[0], parsedGroups, currentMenus))
    })
  return finalparse
    .reduce ((rmenus, menu) => rmenus[menu.tag] ?
    rmenus = {
      ...rmenus,
      [menu.tag]: addToRMenu(rmenus[menu.tag], menu)
    } :
    rmenus = {
      ...rmenus,
      [menu.tag]: addMenuFirstTime(menu, parsedGroups)
    }
      ,{})
}


const mapDetails = (order:any, details:IOrderDetails, groups: IParsedGroup[], currentMenus: Map<string, string>) => ({
      tag:currentMenus.get(details.details.replace(/\s+,/g , ",")),
      quantity: details.quantity,
      groupName: groups.filter(group => order.groupId === group.id)[0]?.name,
    })

const addToRMenu = (rmenus:IGroupAndQuantity[],  menu:IReducedMenu) => {
    const theIndex = rmenus.findIndex(group => 
      menu.groupName === group.groupName)
    theIndex >= 0 ?
        rmenus[theIndex] = {
          groupName: menu.groupName,
          quantity: rmenus[theIndex].quantity + menu.quantity
      } :
      rmenus = [
        ...rmenus,
        {groupName: menu.groupName, quantity: menu.quantity}
      ]
    return rmenus
  }

  const addMenuFirstTime = (menu:IReducedMenu, groups: IParsedGroup[]) => {
    const groupNamed = groups.map(g => ({
      groupName: g.name,
      quantity: (g.name === menu.groupName) ? menu.quantity : 0,
    }))
    return groupNamed
  }
