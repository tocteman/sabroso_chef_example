import React, {useState} from 'react'
import type {IGroup, IParsedGroup, IMappedGroup, IGroupsByService} from 'src/models/GroupTypes'
import type {IOrder, IOrderDetails, IParsedOrderDetails} from '../../models/OrderTypes'
import {useAtom} from 'jotai'
import { viewAtom, groupByGroupAndTag } from '../../services/OrderService'
import { sortByStr } from '../../utils/StringUtils'

const OrdersOtherReport:React.FC<{orders: IOrder[], parsedGroups: IParsedGroup[], currentMenus: Map<string, string>}> 
  = ({orders, parsedGroups, currentMenus}) => {
  const [view] = useAtom(viewAtom)  

    const revertMap = (aMap: Map<string, string>) => {
      const finalMap: Record<string, string> = {}
      currentMenus.forEach((tagValue, menuKey)=> {
        finalMap[tagValue] = menuKey
      })
      return Object.entries(finalMap)
                   .sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))
    }

    const grouped = () => 
      Object.entries(
        groupByGroupAndTag(orders, parsedGroups, currentMenus)
      ).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))


    const ogn = () => ["Etiqueta"].concat(grouped()[0][1]
      .map(o => o.groupName))

  const quantities = () => 
    grouped().map(([tagKey, tagValue]) => ({
      tag: tagKey,
      quantities: tagValue.reduce((rtotal, val) => rtotal + val.quantity,0)
    })
   )

  return (
    <div>
      {view === 'reparto' &&
      <div className="flex flex-col">
      <table className="table-auto text-lg mt-4 pr-8">
        <thead className="pb-2 text-center">
          <tr>
          {ogn().map((o: string, index: number) => (
          <th className="pr-4 pb-2 text-center" key={`${o}-${index}`}>
            {o}
            </th>
          ))}
          </tr>
        </thead>
        <tbody>
          {grouped().map(([tag, menuArray]) => (
            <tr className="border-b border-mostaza-200" key={tag}>
              <td className="pr-4 font-bold text-center pb-1">
                ~ {tag !== 'null' ? `${tag}` : ``} ~
                </td>
              {menuArray.map((groupDetails, index) => (
                <td className="pr-4 text-center" key={`${index}key`}>
                  {groupDetails.quantity === 0 ? '-' : groupDetails.quantity}
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
          <div className="ml-4 mt-12 text-lg">
            {revertMap(currentMenus).map(([key, value]) => (
              <div key={value} className="flex mb-2">
                <div className="pr-2 font-bold">~ {key} ~</div>
                <div className={`flex 
                ${value.split(', ').length > 2 ? ` divide-x divide-mostaza-200` : ``}
                  `}>
                  {value.split(', ').map((k, i) => (
                    <div key={`${k}-${i}`}
                      className="first:font-bold first:pr-2 px-2">
                      {k.includes('null') ? '' : k}
                    </div>
                  ))}
                </div>
                <div className="font-bold">
                  :: {quantities().filter(qs => qs.tag === key)[0]?.quantities}
                </div>
              </div>
            ))}
          </div>
        </div>
      }

      { view === 'cocina' &&
        <div>
          <div className="my-8 flex divide-x divide-mostaza-200">
            {revertMap(currentMenus).map(([key, value]) => (
              <div key={value} className="">
                <div className="text-center text-3xl font-bold">
                  {quantities().filter(qs => qs.tag === key)[0]?.quantities}
                </div>
                <div className="px-8 text-center text-xl">
                  {value.split(', ').map((k, i) => (
                    <div key={`${k}-${i}`} className="first:font-bold">
                      {k.includes('null') ? '' : k}
                    </div>
                  ))}
                </div>
                <div className="text-2xl font-bold text-center">
                  ~ {key.includes('null') ? '' : key.slice(0, 1)} ~
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default OrdersOtherReport
