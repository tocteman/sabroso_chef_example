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
            className={`first:mr-4 text-lg last:ml-4 bg-crema-100 p-2 rounded border-2 border-crema-300 mb-8 text-xl cursor-pointer
          ${cmt === mt ? `border-mostaza-300 bg-crema-200`: `hover:shadow-sm hover:bg-white hover:border-mostaza-300 `}

            `}
              onClick={() => setCurrentMealType(mt)}
            >
              {mt}
            </div>
          ))}

        </div>
        {cmt === 'Fuertes' && (
          <MealList meals={mains} mealType={cmt} atomRef={MainSlice} />
        )}
        {cmt === 'Entradas' && (
          <MealList meals={entrees} mealType={cmt} atomRef={EntreeSlice} />
        )}
        {cmt === 'Postres' && (
          <MealList meals={desserts} mealType={cmt} atomRef={DessertSlice} />
        )}

        <button className="mt-4 rounded-2xl border-2 border-mostaza-200 bg-gradient-to-b from-red-400 to-red-500 text-xl font-bold px-6 py-2 text-crema-100 text-center hover:border-mostaza-200 shadow-sm hover:from-red-300 cursor-not-allowed">Añadir Plato</button>
      </div>

      <div className="w-1/2 min-h-screen relative">
        <Transition
          show={currentMeal.id.length > 1}
          enter="transition transform duration-500"
          enterFrom="translate-x-1/3"
          enterTo=""
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
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
