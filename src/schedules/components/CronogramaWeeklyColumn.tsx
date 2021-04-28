import React from 'react'
import CronogramaDailyCell from './CronogramaDailyCell'
import {WeekDays} from '../../services/ScheduleService'

const CronogramaWeeklyColumn = ({weekNumber, status}) => {

  return (
    <div className={`${status === "active"? `bg-crema-100` : `bg-crema-125 `}  border-crema-200 border-8 rounded-lg my-4 mx-4 flex flex-col px-4 py-4 cursor-pointer`}>
      {WeekDays.map(d => (
        <CronogramaDailyCell weekDay={d} status={status} key={`${weekNumber}-${d.code}`}/>
        ))} 
    </div>
  ) 


}


export default CronogramaWeeklyColumn
