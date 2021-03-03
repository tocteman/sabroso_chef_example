import React, {useState} from 'react'
import type {IGroup, IParsedGroup, IMappedGroup, IGroupsByService} from 'src/models/GroupTypes'
import type {IOrder, IOrderDetails, IParsedOrderDetails} from '../../models/OrderTypes'
import {useAtom} from 'jotai'
import {viewAtom} from '../../services/OrderService'

const OrdersOtherReport:React.FC<{orders: IOrder[], parsedGroups: IParsedGroup[], currentMenus: Map<string, string>}> 
  = ({orders, parsedGroups, currentMenus}) => {
  const [view] = useAtom(viewAtom)  
    console.log(parsedGroups) 
    const groupByGroupAndTag = (groupedOrders: IOrder[] = orders) => {
      const finalparse:any[] = []
      groupedOrders
      .map(order => ({...order, details: JSON.parse(order.details)}))
      .filter(order => order.status !== 'CANCELED')
      .forEach((po:IOrder) => {
        po.details.length>1 ?
          po.details.forEach((detail:IOrderDetails) =>
            finalparse.push(mapDetails(po, detail))
          ) :
          finalparse.push(mapDetails(po, po.details[0]))
      })
      return finalparse
      .reduce ((rmenus, menu) => rmenus[menu.tag] ?
        rmenus = {
          ...rmenus,
          [menu.tag]: addToRMenu(rmenus[menu.tag], menu)
        } :
        rmenus = {
          ...rmenus,
          [menu.tag]: addMenuFirstTime(menu)
        }
       ,{})
  }


  const mapDetails = (order:any, details:IOrderDetails, groups=parsedGroups) => ({
      tag:currentMenus.get(details.details.replace(/\s+,/g , ",")),
      quantity: details.quantity,
      groupName: groups.filter(group => order.groupId === group.id)[0]?.name,
    })

  const addToRMenu = (reducedMenu, menu) => {
    const theIndex = reducedMenu .findIndex(group => 
      menu.groupName === group.groupName)
    theIndex >= 0 ?
        reducedMenu[theIndex] = {
          groupName: menu.groupName,
          quantity: reducedMenu[theIndex].quantity + menu.quantity
      } :
      reducedMenu = [
        ...reducedMenu,
        {groupName: menu.groupName, quantity: menu.quantity}
      ]
    return reducedMenu
  }

  const addMenuFirstTime = (menu, groups=parsedGroups) => {
    const groupNamed = groups.map(g => ({
      groupName: g.name,
      quantity: (g.name === menu.groupName) ? menu.quantity : 0,
    }))
    return groupNamed
  }

    const revertMap = (aMap: Map<string, string>) => {
      const finalMap: Record<string, string> = {}
      currentMenus.forEach((tagValue, menuKey)=> {
        finalMap[tagValue] = menuKey
      })
      return Object.entries(finalMap)
    }

  const grouped = () => Object.entries(groupByGroupAndTag())


  const ogn = () => ["Etiqueta"].concat(grouped()[0][1]
      .map(o => o.groupName))

  const quantities = () => 
    grouped().map(([tagKey, tagValue]) => ({
      tag: tagKey,
      quantities: tagValue.reduce((rtotal, val) => rtotal + val.quantity,0)
    })
    )

  const divideMenu = (menuValue:string) => menuValue.split(', ')

  return (
    <div>
      {view === 'reparto' &&
      <div className="felx flex-col divide-x-2 divide-mostaza-200">
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
      <div className="pl-8 mt-12 text-lg">
        {revertMap(currentMenus).map(([key, value]) => (
          <div key={value} className="flex mb-2">
            <div className="pr-2 font-bold">~ {key} ~</div>
              <div className={`flex 
                ${value.split(', ').length > 2 ? ` divide-x divide-mostaza-200` : ``}`}>
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
            <div className="text-2xl font-bold text-center">~ {key.includes('null') ? '': key.slice(0,1)} ~</div>
          </div>
        ))}

      </div>

      </div>

        }
    </div>
  )
}

export default OrdersOtherReport
