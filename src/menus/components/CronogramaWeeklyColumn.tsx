import React from 'react'
import CronogramaDailyCell from './CronogramaDailyCell'

const CronogramaWeeklyColumn = ({weekNumber, status}) => {

  const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  return (
    <div className={`${status === "active"? `bg-crema-100` : `bg-crema-125 `}  border-crema-200 border-8 rounded-lg my-4 mx-4 flex flex-col px-4 py-4 cursor-pointer`}>
      {weekDays.map(d => (
        <CronogramaDailyCell weekDay={d} status={status} key={`${weekNumber}-${d}`}/>
        ))} 
    </div>
  ) 


}


export default CronogramaWeeklyColumn
