import React, {useEffect} from 'react'
          <h4 className="text-xl font-bold">
import type {IGroup, IParsedGroup, IMappedGroup, IGroupsByService} from 'src/models/GroupTypes'
import type {IWorkspace} from 'src/models/WorkspaceTypes'
import type {IOrder, IOrderDetails, IParsedOrderDetails} from '../../models/OrderTypes'
import type {IMenu} from '../../models/MenuTypes'
import format from 'date-fns/format'
import {Ddmm} from '../../utils/DateUtils'


const OrdersReported: React.FC<{orders: IOrder[], parsedGroups: IParsedGroup[]}> = ({orders, parsedGroups}) => {

  const groupsByService = () => {
    const gss: IGroupsByService[] = []
    parsedGroups
      .map((pg: IParsedGroup) => (
        {serviceName: pg.serviceType.name, id: pg.id}))
      .forEach(mg => {
        const theIndex = gss
          .findIndex(gs => gs.serviceName === mg.serviceName)
        theIndex >= 0 ?
          gss[theIndex].groupsIds.push(mg.id) :
          gss.push({serviceName: mg.serviceName, groupsIds: [mg.id]})
      })
     return gss 
  }    

  const ordersByDate = () => {
    const retrieved = orders.reduce((rorders:Record<string, any>, order:IOrder) => {
    rorders[order.groupId] ?
        rorders[order.groupId] = addMealQuantities(
          rorders[order.groupId], parseDetails(order.details)
        ) :
        rorders[order.groupId] = parseDetails(order.details)
      return rorders
    }
      , {})
    return retrieved
  }


  const addMealQuantities = (current:IParsedOrderDetails[], incoming:IParsedOrderDetails[]) => {
    incoming.forEach(nod => {
      const theIndex = current.findIndex(cod => cod.meal === nod.meal) 
      theIndex >= 0 ?
        current[theIndex].quantity += nod.quantity :
        current.push(nod)
    })
    return current
  }

  const parseDetails = (details: string) => {
    const parsed = JSON.parse(details).map((detail:IOrderDetails) => ({
      meal: detail.details.replace(/\s+,/g , ","),
      quantity: detail.quantity,
      tag: detail.tag || ""
    }))
    return parsed
  }

  
  (Object.keys(ordersByDate).length < 1 || parsedGroups.length<1) &&
    <div>tomando órdenes...</div> 

  const groupedOrders = (o: Record<string, any>, gsn:IGroupsByService) => 
    Object.entries(o)
    .filter(([okv, ovv]) => gsn.groupsIds.includes(okv))
  
  parsedGroups.length>0 && console.log(parsedGroups)

  return (
    <div>
      {groupsByService().map((gsn: IGroupsByService) => (
        <div className="py-2" key={`${gsn.groupsIds[0]}`}>
          <h4 className="font-bold text-xl">
            {groupedOrders(ordersByDate(), gsn).length > 0 && gsn.serviceName}
          </h4>
          {groupedOrders(ordersByDate(), gsn).map(([ovk, ovv]) => (
            <div className="flex flex-col" key={ovk}>
              <div className="pr-4 font-bold">
                {parsedGroups.filter((g) => g.id == ovk)[0]?.name}
              </div>
              <div className="flex flex-col">
                {ovv.map((sovv: IParsedOrderDetails) => (
                  <div>
                    {sovv.meal} {sovv.quantity} {sovv.tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default OrdersReported
