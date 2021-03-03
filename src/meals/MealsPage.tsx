import React, {useState} from 'react'
import useSWR from 'swr'
import { useAtom, atom } from 'jotai'
import { mealsFiltersAtom, FilterEncodeString } from '../services/FilterService'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import type {IMeal} from 'src/models/MealTypes'
import MealList from './components/MealList'
import MealPanel from './components/MealPanel'
import {MainSlice, EntreeSlice, DessertSlice} from '../services/MealService'
import Loader from '../general/components/Loader'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { CurrentMeal } from '../services/MealService'
import { Transition  } from '@headlessui/react'
import { sortByStr } from '../utils/StringUtils'

const MealsPage = () => {
  const { data: meals, error: mealsFetchError } = useSWR(['meals'], Fetcher)
  const { data: menus, error: menuError } = useSWR(['menus'], Fetcher)
  const [cmt, setCurrentMealType] = useState('Fuertes')
  const mealTypes = ['Fuertes', 'Entradas', 'Postres']
  const [currentMeal] = useAtom(CurrentMeal)

  if (!meals || mealsFetchError) return <Loader />
  if (!menus || menuError) return <Loader />

  const mains = meals && meals.filter((meal: IMeal, index: number) => meal.type === 'MAIN')
  const entrees = meals && meals.filter((meal: IMeal) => meal.type === 'ENTREE')
  const desserts = meals && meals.filter((meal: IMeal) => meal.type === 'DESSERT')

  return (
    <div className="flex">
      <div className="p-8 w-1/2">
        <div className="w-1/3">
          <RoughNotation strokeWidth={2} type="underline" color={'#ff3331'} show={true} animationDuration={400} iterations={1}>
            <h2 className="text-3xl font-bold my-8">Comidas</h2>
          </RoughNotation>
        </div>
        <div className="flex">
          {mealTypes.map((mt: string) => (
            <div
              key={`${mt}1`}
            className={`first:mr-4 mx-2 text-lg last:ml-4 bg-crema-100 p-2 rounded border-2 border-crema-300 mb-8 text-xl cursor-pointer
          ${cmt === mt ? ` border-mostaza-300 bg-crema-200`: ` hover:shadow-sm hover:bg-white hover:border-mostaza-300 `}
            `}
              onClick={() => setCurrentMealType(mt)}
            >
              {mt}
            </div>
          ))}
        </div>
          
          {cmt === 'Fuertes' && (
          <MealList meals={sortByStr(mains, 'name')} mealType={cmt} atomRef={MainSlice} />
        )}
        {cmt === 'Entradas' && (
          <MealList meals={sortByStr(entrees, 'name')} mealType={cmt} atomRef={EntreeSlice} />
        )}
        {cmt === 'Postres' && (
          <MealList meals={sortByStr(desserts, 'name')} mealType={cmt} atomRef={DessertSlice} />
        )}

         <button className="main-button cursor-not-allowed">
           Añadir Plato
         </button>
      </div>

      <div className="w-1/2 min-h-screen relative">
        <Transition
          show={currentMeal.id.length > 1}
          enter="transition transform duration-500"
          enterFrom="translate-x-1/3"
        >
          <div className="min-h-screen inset-0">
          <MealPanel menus={menus} />
        </div>
        </Transition>
      </div>

    </div>
  )
}

export default MealsPage
