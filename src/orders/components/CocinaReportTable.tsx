import React from 'react'

const CocinaReportTable:React.FC<{
  menus: [string, string][], 
  quantities:{tag: string, quantities:number}[]
}> = ({menus, quantities}) => {
    return (
      <div className="flex my-8 divide-x divide-mostaza-200">
        {menus.map(([key, value]) => (
          <div key={value} className="">
            <div className="text-3xl font-bold text-center">
              {quantities.filter(qs => qs.tag === key)[0]?.quantities}
            </div>
            <div className="px-8 text-xl text-center">
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
    )
  }

export default CocinaReportTable
