import React, {useState} from 'react'
import tw from "twin.macro"
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
import { Transition } from '@headlessui/react'

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
    <div tw="flex">
      <div tw="p-8 w-1/2">
        <div tw="w-1/3">
          <RoughNotation strokeWidth={2} type="underline" color={'#ff3331'} show={true} animationDuration={400} iterations={1}>
            <h2 tw="text-3xl font-bold my-8">Comidas</h2>
          </RoughNotation>
        </div>
        <div tw="flex">
          {mealTypes.map((mt: string) => (
            <div
              key={`${mt}1`}
              tw="first:mr-4 text-lg last:ml-4 bg-crema-100 p-2 rounded border-2 border-crema-300 mb-8 text-xl cursor-pointer"
              css={[
                cmt === mt
                  ? tw`border-mostaza-300 bg-crema-200`
                  : tw`hover:shadow-sm hover:bg-white hover:border-mostaza-300 `,
              ]}
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

        <button tw="mt-4 rounded-2xl border-2 border-mostaza-200 bg-gradient-to-b from-red-400 to-red-500 text-xl font-bold px-6 py-2 text-crema-100 text-center hover:border-mostaza-200 shadow-sm hover:from-red-300 cursor-not-allowed">Añadir Plato</button>
      </div>

      <div tw="w-1/2 min-h-screen">
        <Transition
        show={currentMeal.id.length > 1}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="absolute right-0 mt-2 origin-top-right rounded-md shadow-lg"
      >
          <MealPanel menus={menus} />
        </Transition>
      </div>

    </div>
  )
}

export default MealsPage
