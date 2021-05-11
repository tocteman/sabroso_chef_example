import React from 'react'
import type {IGroupAndQuantity} from '../../models/OrderTypes'
import type {IMenu} from '../../models/MenuTypes'
import {generateAutoTable, generateAutoTableBody, printGroups, printFoodRows} from "../../services/OrderReportService"
import type {IParsedGroup} from '../../models/GroupTypes'

const RepartoReportTable:React.FC<{
  menus: [tag:string, detail:string][], 
  quantities:{tag: string, quantities:number}[]
	parsedGroups: IParsedGroup[]
	grouped: any
}> = ({menus, quantities, parsedGroups, grouped}) => {

	const mapped = new Map(grouped)
  mapped.forEach((v, k)=> {  //@ts-ignore
    mapped.set(k, v.reduce(
      (rvalue, innerObj)=> rvalue.concat(Object.values(innerObj)) ,[])
    )
  })

  const tableContent = generateAutoTable(mapped)
	const table = printGroups(tableContent, parsedGroups)
	const {head, body} = table

	const trimTableTitle = title => title.length > 10 ? title.slice(0,7) + "..." : title
	const trimMonitoreo = title => title.includes("Monitoreo ") ?
						`Monit--${title.slice(-1)}` : title

  return (
    <div className="flex flex-col">
			<div className="overflow-x-scroll sm:overflow-x-hidden">
				<table className="pr-8 mt-4 sm:text-lg ">
					<thead className="pb-2 text-center">
						<tr>
							{head[0].map((groupName: string, index: number) => (
								<th className="pb-2 pr-4 text-center" key={`head-${groupName}`}>
									{trimMonitoreo(groupName)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{body.map(row => (
							<tr key={row[0]}
								className="border-b border-mostaza-200"
							>
								{row.map((cell, index) => (
									<td key={`${row[0]}--${cell}--${index}`}
										className="pr-4 text-center"
									>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
	<div className="mt-12 ml-4 sm:text-lg">
    {menus.map(([key, value]) => (
			<div key={`${key}-${value}`}>
      <div className="flex mb-2 sm:mb-0">
        <div className="pr-2 font-bold">~ {key} ~</div>
        <div className={`flex flex-col sm:flex-row
                ${value.split(', ').length > 2 
                    ? ` divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-mostaza-200` :
                    ``}
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
            <hr className="mb-2 border-2 border-crema-200"/>
			</div>
					))}
        </div>
      </div>
    )
}

export default RepartoReportTable
