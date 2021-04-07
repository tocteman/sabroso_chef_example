import React from 'react'
import {useAtom} from 'jotai'
import type {IMeal} from '../../models/MealTypes';
import {NewMenuMap} from '../../services/MealService';
import DataListInput from "react-datalist-input";

const NewMenuForm: React.FC<{meals: IMeal[], type: string, menuId}> = ({meals, type, menuId}) => {
  const [newMenuMap, setNewMenuMap] = useAtom(NewMenuMap)
  // const currentMeals = () => meals.map(m => m.name)
  const currentMeals = () => meals.map((m, i) => ({key: `${i}-${m.name}`, value: m.name, label: m.name}))
  const [currentInput, setCurrentInput] = React.useState("")
  const getSpec = () => meals[0].type.toLowerCase()
  const getValue = () => newMenuMap.get(menuId)[`${getSpec()}`] || ""
  const setText = (mealName: string) => {
    const newMap = new Map(newMenuMap)
    newMap.set(menuId, {...newMap.get(menuId), [`${getSpec()}`]: mealName})
    console.log({newMap})
    return setNewMenuMap(newMap)
  }

  const printLabel = () =>{ 
    if (getSpec() === 'entree')  { return "Entrada"}
    if (getSpec() === 'main')    { return "Fuerte"}
    if (getSpec() === 'dessert') { return  "Postre"}
  }

  const tagOptions = ["A", "B", "C", "D", "N"]

  const selectTag = (tag:string) => {
    const newMap = new Map(newMenuMap)
    newMap.set(menuId, {...newMap.get(menuId), tag})
    return setNewMenuMap(newMap)
  }

  const selectSuggestion = (mealName) => {console.log(mealName); setText(mealName.value)}

  return (
    <div className="flex">
      <div className="flex flex-col">
        <label className="text-sm tracking-widest text-gray-400 uppercase">
          {printLabel()}
        </label>
        <DataListInput
          placeholder=""
          inputClassName="meal-input"
          items={currentMeals()}
          onSelect={m => selectSuggestion(m)}
          requiredInputLength = {1}
          value = {getValue()}
        />
      </div>
    {getSpec() === 'main' && 
    <div className="flex flex-col ml-2">
      <label className="text-sm tracking-widest text-gray-400 uppercase">
        Etiqueta
      </label>
      <select className="font-normal meal-input" onChange={e => selectTag(e.target.value)}>
        <option>--</option>
        {tagOptions.map((t, i) => (<option key={`${t}-${i}`}>{t}</option>))}
    </select>
    </div>
    }
  </div>
  ) 
}

export default NewMenuForm
