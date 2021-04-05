import {useAtom} from 'jotai'
import React, {useState} from 'react'

const CronogramaDailyCell = ({status, weekDay}) => {
  const [activeCell, setActiveCell] = useState(false)  // <- useAtom
  const mts = [
    {name: "Desayuno"},
    {name: "Almuerzo"},
    {name: "Cena"}
  ]

  return (
  <div className={`${ status === "active" ? `bg-white p-6 border-crema-150 border-2 rounded shadow-sm ` : `bg-crema-125 p-16` } flex justify-center bg-transparent my-4 text-center text-xl border-mostaza-300 font-bold text-lg`}>
    {status === 'active' && !activeCell && (<div onClick={()=>setActiveCell(true)}>{weekDay}</div>)}
  {status === 'active' && activeCell && (
    <div>{mts.map(m => (
      <div key={`mt-${m.name}`} onClick={()=>console.log("clicked")}>
        {m.name}

      </div>
    ))}</div>)
  }
  </div>
  ) 
}

export default CronogramaDailyCell
