import React, {useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import ChevronLeft from '../../svgs/ChevronLeft'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import ExampleData from './ExampleData'
import CronogramaWeeklyColumn from './CronogramaWeeklyColumn'


const initialWeeks =  {
   1: {number: 1, status: "inactive"},
   2: {number: 2, status: "inactive"}, 
   3:  {number: 3, status: "inactive"},
   4:  {number: 4, status: "inactive"}
}


const CronogramaItem = () => {
  let {id} = useParams()

  const [weeks, setWeeks] = useState(initialWeeks)

  const history = useHistory()
  
  const isHere = () => history.location.pathname.split("/").slice(-1)[0] === id

  const currentCronograma = () => id ? ExampleData.filter(e => e.id.toString() === id)[0] : null

  return (
    <div className="flex flex-col">
      <div className="w-1/6">
        <div className="flex cursor-pointer bg-crema-100 hover:underline"
          onClick={()=> history.push("/addmenus")}
        >
          <div className="w-4">
            <ChevronLeft />
          </div>
          <div className="text-sm">
            Cronogramas
          </div>
        </div>
      </div>
      <div className="flex flex-col my-4">
        <div className="w-24">
        <RoughNotation
          type="highlight" 
          color={'#ffead3'}
          show={true} 
          animationDuration={400}
          iterations={1}
        >
          <h1 className="text-2xl font-bold">
            {currentCronograma()?.name}
          </h1>
        </RoughNotation>
      </div>
      <div className="flex rounded border-crema-200">
        {Object.entries(weeks).map(([k, v])=> (
          <div onClick={w => setWeeks({
            ...initialWeeks,
            [`${k}`] : {number: v.number, status: "active" }
          })}>
          <CronogramaWeeklyColumn 
            status={v.status} 

            weekNumber={v.number}
          />
        </div>
        ))}
      </div>
      </div>
    </div>
  )

}

export default CronogramaItem
