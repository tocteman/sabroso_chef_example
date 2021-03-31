import React from 'react'
import { atom } from 'jotai'
import type { IGroupAndQuantity, IGrouppedObj, IOrder, IOrderDetails, IReducedOrder } from '../models/OrderTypes'
import type {IParsedGroup} from '../models/GroupTypes'
import type {IMenu} from 'src/models/MenuTypes'

export const viewAtom = atom<String>('cocina') 


export const groupByGroupAndTag: (groupedOrders: IOrder[], parsedGroups: IParsedGroup[], menus: IMenu[]) => IGrouppedObj
  = (groupedOrders, parsedGroups, menus) => 
  extractOrderDetails(groupedOrders, parsedGroups, menus)
  .reduce((grouped, od) => 
    grouped[od.tag] ?
      grouped = { 
        ...grouped, 
        [od.tag]: addToGrouped(grouped[od.tag], od) }
      :
      grouped = { 
        ...grouped, 
        [od.tag]: parsedGroups.map(g => ({
          groupName: g.name,
          quantity: (g.name === od.groupName) ? od.quantity : 0,
        }))
      }
    , {})

const extractOrderDetails = (groupedOrders: IOrder[], parsedGroups: IParsedGroup[], menus: IMenu[]) => 
    groupedOrders
    .filter(o => o.status !== 'CANCELED')
    .map(o => o.details.length > 1 ?
      o.details.map(d => mapDeliveryDetails(o, d, parsedGroups)) :
      [mapDeliveryDetails(o, o.details[0], parsedGroups)]
    )
    .flat()
    

const mapDeliveryDetails = (order:IOrder, details:IOrderDetails, groups: IParsedGroup[], ) =>  ({
      tag: details.tag,
      quantity: details.quantity,
      groupName: groups.filter(group => order.groupId === group.id)[0]?.name,
  })

const addToGrouped = (grouped:IGroupAndQuantity[], o:IReducedOrder) => {
    const theIndex = grouped.findIndex(group => 
      o.groupName === group.groupName)
    theIndex >= 0 ?
        grouped[theIndex] = {
          groupName: o.groupName,
          quantity: grouped[theIndex].quantity + o.quantity
      } :
      grouped = [
        ...grouped,
        {groupName: o.groupName, quantity: o.quantity}
      ]
    return grouped
  }

