import React, {useState, useEffect} from 'react'
import {useAtom} from 'jotai'
import {DisplayAddMealPanel, MealMap, CurrentMeal, DisplayEditMealPanel} from '../../services/MealService'
import CloseIcon from '../../svgs/CloseIcon'
import { initialMeal } from '../../models/MealTypes'

const MealForm = () => {

  const [mealMap, setMealMap] = useAtom(MealMap)
  const [displayPanel, setDisplayPanel] = useAtom(DisplayAddMealPanel)
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)
  const [editPanel, setEditPanel] = useAtom(DisplayEditMealPanel)


  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [kcal, setKcal] = useState(0)

  const isEdit = () => currentMeal.id.length > 0 ? true : false

  const props = () => ["name", "type", "description", "kcal"]

  const setInitialValues = () => {
    setName(currentMeal.name)
    setType(currentMeal.type)
    setDescription(currentMeal.description)
    setKcal(currentMeal.kcal)
    props().forEach(p =>  setProp(p, currentMeal[p]))
  }

  const setBlankValues = () => 
    props().forEach(p => p === "kcal" ? setProp("kcal", 0) : setProp(p, ""))
 
  const setProp = (prop:string, value:string|number) => {
    const mealKey = mealMap.keys().next().value
    const current = mealMap.get(mealKey)
    mealMap.set(mealKey,{ ...current, [prop]: value})
    setMealMap(mealMap)
  }

  const mealTypes = [
    {name: "Fuerte", code: "MAIN"},
    {name: "Entrada", code: "ENTREE"},
    {name: "Postre", code: "DESSERT"}
  ]


  useEffect(() => {
    isEdit() === true && setInitialValues()
  }, [])

  return (
    <div className={` ${displayPanel && `slide-in-fwd-right`}` }>
      <div className="flex justify-between">
        <div className="flex flex-col mt-2">
          <label className="text-sm tracking-widest uppercase">
            Nombre
          </label>
          <input className="my-1 meal-input"
            type="text"
            value={ name || ""}
            onChange={(e)=> {setName(e.target.value); setProp("name", e.target.value)}}/
          >
        </div>
      </div>
      <div className="flex flex-col my-2">
        <label className="text-sm tracking-widest uppercase">
          Tipo de Menú
        </label>
        <select className="my-1 meal-input"
          value={ type || ""}
          onChange={e => {setType(e.target.value); setProp("type", e.target.value)}}>
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
        <textarea className="my-1 meal-input" 
          value={ description || ""}
          rows={3} cols={20} 
          onChange={e => {setDescription(e.target.value); setProp("description", e.target.value)}}
        />
      </div>
      <div className="flex flex-col my-2">
        <label className="text-sm tracking-widest uppercase">
          Kcals
        </label>
        <input type="number" className="my-1 meal-input"
          value={ kcal || 0}
          onChange={e => {setKcal(Number(e.target.value)); setProp("kcal", Number(e.target.value))}}
          />
    </div>
  </div>
  )
}


export default MealForm
