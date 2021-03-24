import React from 'react'
import type {IGroupAndQuantity} from '../../models/OrderTypes'

const RepartoReportTable:React.FC<{
  menus: [string, string][], 
  quantities:{tag: string, quantities:number}[]
  grouped: [string, IGroupAndQuantity[]][]
  groupNamesHeader: string[]
}> = ({menus, quantities, grouped, groupNamesHeader}) => {
  return (
    <div className="flex flex-col">
      <table className="pr-8 mt-4 text-lg table-auto">
        <thead className="pb-2 text-center">
          <tr>
            {groupNamesHeader.map((o: string, index: number) => (
              <th className="pb-2 pr-4 text-center" key={`${o}-${index}`}>
                {o}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map(([tag, menuArray]) => (
            <tr className="border-b border-mostaza-200" key={tag}>
              <td className="pb-1 pr-4 font-bold text-center">
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
  <div className="mt-12 ml-4 text-lg">
    {menus.map(([key, value]) => (
      <div key={value} className="flex mb-2">
        <div className="pr-2 font-bold">~ {key} ~</div>
        <div className={`flex 
                ${value.split(', ').length > 2 ? ` divide-x divide-mostaza-200` : ``}
                  `}>
                  {value.split(', ').map((k, i) => (
                    <div key={`${k}-${i}`}
                      className="px-2 first:font-bold first:pr-2">
                      {k.includes('null') ? '' : k}
                    </div>
                  ))}
                </div>
                <div className="font-bold">
                  :: {quantities.filter(qs => qs.tag === key)[0]?.quantities}
                </div>
              </div>
          ))}
        </div>
      </div>
    )
}

export default RepartoReportTable
