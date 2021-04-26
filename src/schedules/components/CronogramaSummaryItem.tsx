import React from 'react'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

const CronogramaSummaryItem = ({name, progress}) => {

  const renderProgress = () => progress < 25 ?  
    "w-1/3" : "w-3/4" 
  

  return (
    <div className="px-8 pt-6 pb-8 my-4 border-8 rounded-lg border-crema-200 bg-crema-100 hover:bg-white shadow-sm">
      <div className="text-2xl font-bold">
        {name}
      </div>
      <div className={`pt-1 rounded-lg ${renderProgress()}`}>
        <RoughNotation strokeWidth={1} type="underline" color={'#ff3331'} show={true} animationDuration={400} iterations={1}>
            <div className="text-sm">alguna_cosa</div>
          </RoughNotation>

      </div>
    </div>
  )
}

export default CronogramaSummaryItem
