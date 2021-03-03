import React from 'react'
import type {IOrder} from '../../models/OrderTypes'
import type {IGroup} from '../../models/GroupTypes'
import type {IWorkspace} from '../../models/WorkspaceTypes'

const ClientOrdersTable: React.FC<{orders: IOrder[], groups:IGroup[]}> = ({orders, groups}) => {

const groupName = (groupId: string) => groups.filter((group: IGroup) => group.id === groupId)[0]?.name

const moneyFormat = (amount:string|number) => `$${amount}`


  return (
  <div>
  <table className="mx-auto table-auto overflow-x-auto text-left">
    <thead className="font-bold">
      <tr className="py-2 text-left">
        <th className="pr-4"> total </th>
        <th className="px-2"> subtotal </th>
        <th className="pl-4"> grupo </th>
      </tr>
    </thead>
    <tbody className="font-light">
      {orders && orders.map((order: IOrder) => (
        <tr key={order.id}>
          <td className="pr-4">{moneyFormat(Number(order.subtotal) + (Number(order.subtotal)* 0.12))}</td>
          <td className="px-2">{moneyFormat(order.subtotal)}</td>
          <td className="pl-4">{groupName(order.groupId)}</td>
        </tr>
      ))}

    </tbody>
  </table>

  </div>
  )
}

export default ClientOrdersTable
