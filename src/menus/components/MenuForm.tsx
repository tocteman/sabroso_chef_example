import React, {useState} from 'react'
import {useAtom} from 'jotai'
import type {IMeal} from '../../models/MealTypes';
import {MenuMap} from '../../services/MealService';
import DataListInput from "react-datalist-input";

const MenuForm: React.FC<{meals: IMeal[], menuId}> = ({meals, menuId}) => {
  const [newMenuMap, setNewMenuMap] = useAtom(MenuMap)
  // const currentMeals = () => meals.map(m => m.name)
  const currentMeals = () => meals.map((m, i) => ({key: `${i}-${m.name}`, value: m.name, label: m.name}))
  const [menuMap, setMenuMap] = useAtom(MenuMap)
  const getSpec = () => meals[0].type.toLowerCase()
  const getValue = () => menuMap.get(menuId)[`${getSpec()}`] || ""
  const setText = (mealName: string) => {
  const newMap = new Map(newMenuMap)
    newMap.set(menuId, {...newMap.get(menuId), [`${getSpec()}`]: mealName})
    return setNewMenuMap(newMap)
  }
  const getTag = () => menuMap.get(menuId)['tag'] || ""

  const printLabel = () =>{ 
    if (getSpec() === 'entree')  { return "Entrada"}
    if (getSpec() === 'main')    { return "Fuerte"}
    if (getSpec() === 'dessert') { return  "Postre"}
  }

  const tagOptions = ["A", "B", "C", "D", "N"]

  const selectTag = (tag:string) => {
    const newMap = new Map(menuMap)
    newMap.set(menuId, {...menuMap.get(menuId), tag})
    return setNewMenuMap(newMap)
  }

  const selectSuggestion = (mealName) => setText(mealName.value)


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
      <select className="font-normal meal-input" onChange={e => selectTag(e.target.value)} value={getTag()}>
        <option>--</option>
        {tagOptions.map((t, i) => (<option key={`${t}-${i}`}>{t}</option>))}
    </select>
    </div>
    }
  </div>
  ) 
}

export default MenuForm
