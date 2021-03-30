import React, {useState} from 'react'
import type {IGroup, IParsedGroup, IMappedGroup, IGroupsByService} from 'src/models/GroupTypes'
import type {IGroupAndQuantity, IOrder, IOrderDetails, IParsedOrderDetails, ITagAndQuantity} from '../../models/OrderTypes'
import {useAtom} from 'jotai'
import { viewAtom, groupByGroupAndTag } from '../../services/OrderService'
import { sortByStr } from '../../utils/StringUtils'
import CocinaReportTable from './CocinaReportTable'
import RepartoReportTable from './RepartoReportTable'

const ReportTable:React.FC<{
  orders: IOrder[], 
  parsedGroups: IParsedGroup[], 
  currentMenus: Map<string, string>
  menus
}> = ({orders, parsedGroups, currentMenus, menus}) => {
 console.log({menus}) 
  const [view] = useAtom(viewAtom)  

  const revertMap: (aMap: Map<string, string>) => [string, string][]
    = (aMap) => {
      const finalMap: Record<string, string> = {}
      aMap.forEach((tagValue, menuKey)=> {
        finalMap[tagValue] = menuKey
      })
      return Object.entries(finalMap)
        .sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))
    }

  const grouped: () => [string, IGroupAndQuantity[]][] 
    = () => 
      Object.entries(
        groupByGroupAndTag(orders, parsedGroups, currentMenus)
      ).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))

  const groupNamesHeader: () => string[]
    = () => ["Etiqueta"].concat(grouped()[0][1]
      .map(o => o.groupName))

  const quantities: () => {tag: string, quantities: number}[] 
    = () => 
    grouped().map(([tagKey, tagValue]) => ({
      tag: tagKey,
      quantities: tagValue.reduce((rtotal:number, val:IGroupAndQuantity) => rtotal + val.quantity, 0)
    })
    )



  return (
    <div>
      {view === 'reparto' &&
        <RepartoReportTable
          menus={revertMap(currentMenus)}
          quantities={quantities()}
          grouped = {grouped()}
          groupNamesHeader = {groupNamesHeader()}
        />
      }
      { view === 'cocina' &&
        <CocinaReportTable 
          quantities = {quantities()}
          menus={revertMap(currentMenus)}

          />
      }
    </div>
    )
  }

export default ReportTable
