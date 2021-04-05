import React from 'react'
import {useAtom} from 'jotai'
import type {IMeal} from '../../models/MealTypes';
import { Hint } from 'react-autocomplete-hint';
import {NewMenuMap} from '../../services/MealService';

const NewMenuForm: React.FC<{meals: IMeal[], type: string, menuId}> = ({meals, type, menuId}) => {


  const [newMenuMap, setNewMenuMap] = useAtom(NewMenuMap)

  const currentMeals = () => meals.map(m => m.name)

  const getSpec = () => meals[0].type.toLowerCase()


  const getValue = () => newMenuMap.get(menuId)[`${getSpec()}`] || ""
  

  const setText = (mealName: string) => {
    const newMap = new Map(newMenuMap)
    newMap.set(menuId, {...newMap.get(menuId), [`${getSpec()}`]: mealName})
    return setNewMenuMap(newMap)
  }

  const printLabel = () =>{ 
    if (getSpec() === 'entree') { return "Entrada"}
    if (getSpec() === 'main') { return "Fuerte"}
    if (getSpec() === 'dessert') {return  "Postre"}
  }

  const tagOptions = ["A", "B", "C", "D", "N"]

  return (
    <div className="flex">
      <div>
        <label className="text-sm tracking-widest text-gray-400 uppercase">
          {printLabel()}
        </label>
        <Hint options={currentMeals()}
              allowTabFill={true}

        >
          <input
            className="font-normal meal-input"
            value={getValue()}
            onChange={e => setText(e.target.value)} />
        </Hint>
      </div>
      {getSpec() === 'main' && <div className="flex flex-col mt-1 ml-2">
        <label className="text-sm tracking-widest text-gray-400 uppercase">
          Etiqueta
        </label>
        <select className="font-normal meal-input">
          <option>--</option>
          {tagOptions.map(t => (<option>{t}</option>))}
        </select>
      </div>}
    </div>
  ) 
}

export default NewMenuForm
