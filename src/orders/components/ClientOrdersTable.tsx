import React from 'react'
import tw from 'twin.macro'
import type {IOrder} from '../../models/OrderTypes'
import type {IGroup} from '../../models/GroupTypes'
import type {IWorkspace} from '../../models/WorkspaceTypes'

const ClientOrdersTable: React.FC<{orders: IOrder[], groups:IGroup[]}> = ({orders, groups}) => {

const groupName = (groupId: string) => groups.filter((group: IGroup) => group.id === groupId)[0]?.name

const moneyFormat = (amount:string|number) => `$${amount}`


  return (
  <div>
  <table className="mx-auto table-auto overflow-x-auto text-left">
    <thead tw="font-bold">
      <tr tw="py-2 text-left">
        <th tw="pr-4"> total </th>
        <th tw="px-2"> subtotal </th>
        <th tw="pl-4"> grupo </th>
      </tr>
    </thead>
    <tbody tw="font-light">
      {orders && orders.map((order: IOrder) => (
        <tr key={order.id}>
          <td tw="pr-4">{moneyFormat(Number(order.subtotal) + (Number(order.subtotal)* 0.12))}</td>
          <td tw="px-2">{moneyFormat(order.subtotal)}</td>
          <td tw="pl-4">{groupName(order.groupId)}</td>
        </tr>
      ))}

    </tbody>
  </table>

  </div>
  )
}

export default ClientOrdersTable
