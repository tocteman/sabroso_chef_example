import React from 'react'
import "twin.macro"
import type {IMeal} from '../../models/MealTypes'
import {atom, useAtom, WritableAtom} from 'jotai'
import Paginator, {SliceRange} from '../../general/components/Paginator'
import {CurrentMeal} from '../../services/MealService'

const MealList:
React.FC<{meals: IMeal[], mealType: string, atomRef: WritableAtom<any, any>}> = 
  ({meals, mealType, atomRef}) => {

  const currentSliced = atom(get => get(atomRef))
  const [mealSlice] = useAtom(currentSliced)
  const [, setCurrentMeal] = useAtom(CurrentMeal)
  return (
    <div>
      <h3 tw="font-bold text-xl mb-2">{mealType}</h3>
        <div tw="flex flex-col">
          {meals && meals.slice(mealSlice.from, mealSlice.to).map((main: IMeal)=> (
          <div key={main.id} onClick={()=> setCurrentMeal(main)} 
            tw="my-1 border-2 border-crema-300 bg-white hover:bg-white p-2 rounded hover:border-mostaza-300 max-w-sm cursor-pointer">
            {main.name}
          </div>
          ))}
        </div>
        <Paginator count={meals.length} atomRef={atomRef}/>
    </div>
  )
}

export default MealList
