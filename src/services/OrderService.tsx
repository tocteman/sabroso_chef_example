import React from 'react'
import { atom } from 'jotai'
import type { IGroupAndQuantity, IGrouppedObj, IOrder, IOrderDetails, IReducedMenu } from '../models/OrderTypes'
import type {IParsedGroup} from '../models/GroupTypes'

export const viewAtom = atom<String>('cocina') 


export const groupByGroupAndTag: (groupedOrders: IOrder[], parsedGroups: IParsedGroup[], currentMenus: Map<string, string>) => IGrouppedObj
  = (groupedOrders, parsedGroups, currentMenus) => {
    const extracted =  extractOrderDetails(groupedOrders, parsedGroups, currentMenus)
    return extracted .reduce ((rmenus, menu) => rmenus[menu.tag] ?
        rmenus = { ...rmenus, [menu.tag]: addToRMenu(rmenus[menu.tag], menu) }
      :
        rmenus = { ...rmenus, [menu.tag]: addMenuFirstTime(menu, parsedGroups)}
     , {})
 }

const extractOrderDetails = (groupedOrders: IOrder[], parsedGroups: IParsedGroup[], currentMenus: Map<string, string>) => {
    const finalparse:any[] = []
    groupedOrders
    .filter(order => order.status !== 'CANCELED')
    .map((o: IOrder) => ({...o, details: JSON.parse(o.details)}))
    .forEach((po:IOrder) => { 
      po.details.length> 1 ?
        po.details.forEach((detail:IOrderDetails) =>
          finalparse.push(
            mapDeliveryDetails(po, detail, parsedGroups, currentMenus)
          )
        ) : 
        finalparse.push(
          mapDeliveryDetails(po, po.details[0], parsedGroups, currentMenus)
        )
    }) 
    return finalparse
  }

const mapDeliveryDetails = (order:IOrder, detalle:IOrderDetails, groups: IParsedGroup[], currentMenus: Map<string, string>) =>  {
    return {
      tag:currentMenus.get(detalle.details.replace(/\s+,/g , ",")),
      quantity: detalle.quantity,
      groupName: groups.filter(group => order.groupId === group.id)[0]?.name,
    }
  }

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
