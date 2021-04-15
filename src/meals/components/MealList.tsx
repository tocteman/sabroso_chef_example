import React from 'react'
import type {IMeal} from '../../models/MealTypes'
import {atom, useAtom, WritableAtom} from 'jotai'
import Paginator, {SliceRange} from '../../general/components/Paginator'
import {CurrentMeal, DisplayAddMealPanel} from '../../services/MealService'

const MealList:
React.FC<{meals: IMeal[], mealType: string, atomRef: WritableAtom<any, any>}> = 
  ({meals, mealType, atomRef}) => {

  const [, setAddMealPanel] = useAtom(DisplayAddMealPanel)
  const currentSliced = atom(get => get(atomRef))
  const [mealSlice] = useAtom(currentSliced)
  const [, setCurrentMeal] = useAtom(CurrentMeal)

    const setMeal = (meal) => {
      setCurrentMeal(meal)
      setAddMealPanel(false)
    }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">{mealType}</h3>
        <div className="flex flex-col">
          {meals && meals.slice(mealSlice.from, mealSlice.to).map((main: IMeal)=> (
          <div key={main.id} onClick={()=> setMeal(main)}
            className="max-w-sm p-2 my-1 bg-white border-2 rounded cursor-pointer border-crema-300 hover:bg-white hover:border-mostaza-300">
            {main.name}
          </div>
          ))}
        </div>
        <Paginator count={meals.length} atomRef={atomRef}/>
    </div>
  )
}

export default MealList
