import React from 'react'
import {useAtom} from 'jotai'
import {DisplayAddMealPanel, MealMap, CurrentMeal, DisplayEditMealPanel} from '../../services/MealService'
import CloseIcon from '../../svgs/CloseIcon'
import { initialMeal } from '../../models/MealTypes'

const MealForm = () => {

  const [mealMap, setMealMap] = useAtom(MealMap)
  const [displayPanel, setDisplayPanel] = useAtom(DisplayAddMealPanel)
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)
  const [editPanel, setEditPanel] = useAtom(DisplayEditMealPanel)

  const setName = (name:string) => {
    const key = mealMap.keys().next().value
    const current = mealMap.get(key)
    const newMap = new Map()
    newMap.set(key,{ ...current, name })
    setMealMap(newMap)
  } 

  const setType = (code:string) => {
    const key = mealMap.keys().next().value
    const current = mealMap.get(key)
    const newMap = new Map()
    newMap.set(key,{ ...current, type: code })
    setMealMap(newMap)
  }

  const mealTypes = [
    {name: "Fuerte", code: "MAIN"},
    {name: "Entrada", code: "ENTREE"},
    {name: "Postre", code: "DESSERT"}
  ]

  const isEdit = () => currentMeal.id.length > 0 ? true : false

  const getInitialName = () => isEdit() ?  currentMeal.name : ""

  const getInitialType = () => isEdit() ? currentMeal.type : ""

  const getInitialKcal = () => isEdit() ?  currentMeal.kcal : ""

  const getInitialDescription = () => isEdit() ? currentMeal.description : ""

  const disableEdit = () => currentMeal.id.length > 0 ?
      setEditPanel(false)
    : setCurrentMeal(initialMeal); 
  
  

  return (
    <div className={` ${displayPanel && `slide-in-fwd-right`}` }>
      <div className="flex justify-between">
        <div className="flex flex-col mt-2">
          <label className="text-sm tracking-widest uppercase">
            Nombre
          </label>
          <input className="my-1 meal-input"
            type="text"
            value={getInitialName()}
            onChange={(e)=> setName(e.target.value)}/>
        </div>
        { currentMeal.id.length > 0 &&
          <div className="w-6 cursor-pointer hover:text-gray-700"
            onClick={() => disableEdit()}>
            <CloseIcon/>
          </div>
        }
      </div>
      <div className="flex flex-col my-2">
        <label className="text-sm tracking-widest uppercase">
          Tipo de Menú
        </label>
        <select className="my-1 meal-input"
          value={getInitialType()}
          onChange={e => setType(e.target.value)}>
          <option value="">-</option>
          {mealTypes.map(m => (
            <option key={m.code} value={m.code}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col my-2">
        <label className="text-sm tracking-widest uppercase">
          Descripción
        </label>
        <textarea className="my-1 meal-input" rows={3} cols={20} value={getInitialDescription()}/>
      </div>
      <div className="flex flex-col my-2">
        <label className="text-sm tracking-widest uppercase">
          Kcals
        </label>
        <input type="number" className="my-1 meal-input" value={getInitialKcal()}/>
    </div>
  </div>
  )
}


export default MealForm
