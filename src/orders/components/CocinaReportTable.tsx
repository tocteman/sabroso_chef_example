import React from 'react'

const CocinaReportTable:React.FC<{
  menus: [tag:string, detail:string][],
  quantities:{tag: string, quantities:number}[]
}> = ({menus, quantities}) => {

  const filterByQty = (mns=menus, qtts=quantities) => 
    mns.map(([t, detail]) => 
         qtts.filter(q => q.tag === t)[0]?.quantities > 0 ? [t, detail] : null)
       .filter(m => m)

    return (
      <div className="flex flex-col sm:flex-row my-4 sm:my-8 divide-x-0 sm:divide-x divide-y sm:divide-y divide-mostaza-200">
        {filterByQty().map(([key, value]) => (
          <div key={`${key}`} className="mt-2 mb-1 sm:mt-0 sm:mb-0 flex flex-row sm:flex-col-reverse">
            <div className="text-lg sm:text-2xl font-bold text-center">
              ~ {key.includes('null') ? '' : key.slice(0, 1)} ~
            </div>
            <div className="px-4 sm:px-4 sm:text-xl text-left sm:text-center">
              {value.split(', ').map((k, i) => (
                <div key={`${k}-${i}`} className="first:font-bold">
                  {k.includes('null') ? '' : k}
                </div>
              ))}
            </div>
            <div className="text-lg sm:text-3xl font-bold text-center">
              {quantities.filter(qs => qs.tag === key)[0]?.quantities}
            </div>
          </div>
      ))}
    </div>
    )
  }

export default CocinaReportTable
