import React from 'react'

const CronogramaDailyCell = ({status, weekDay}) => (
  <div className={`${ status === "active" ? `bg-white p-8 ` : `bg-crema-125 p-16` } flex bg-transparent my-8 border-mostaza-300 font-bold text-lg`}>
    {status === 'active' && weekDay}
  </div>
) 

export default CronogramaDailyCell
