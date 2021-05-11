import React, {useState} from 'react'
import useSWR from 'swr'
import { useAtom, atom } from 'jotai'
import { MealsFiltersAtom, FilterEncodeString } from '../services/FilterService'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import {IMeal, initialMeal} from '../models/MealTypes'
import MealList from './components/MealList'
import MealPanel from './components/MealPanel'
import {MainSlice, EntreeSlice, DessertSlice, DisplayAddMealPanel, MealMap} from '../services/MealService'
import Loader from '../general/components/Loader'
import { CurrentMeal } from '../services/MealService'
import { Transition  } from '@headlessui/react'
import { sortByStr } from '../utils/StringUtils'
import MealForm from './components/MealForm'
import AddMealPanel from './components/AddMealPanel'
import { v4 as uuidv4 } from 'uuid';
import RoughTitle from "../general/components/RoughTitle"
import {PanelTransitionProps} from '../services/UiService'

const MealsPage = () => {
  const { data: meals, error: mealsFetchError } = useSWR(['meals'], Fetcher)
  const { data: menus, error: menuError } = useSWR(['menus'], Fetcher)
  const [cmt, setCurrentMealType] = useState('Fuertes')
  const mealTypes = ['Fuertes', 'Entradas', 'Postres']
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)
  const [addMealPanel, setAddMealPanel] = useAtom(DisplayAddMealPanel)
  const [mealMap, setMealMap] = useAtom(MealMap)

  if (!meals || mealsFetchError) return <Loader />
  if (!menus || menuError) return <Loader />


  const showPanel = () => {
    const mealId = uuidv4()
    setMealMap(mealMap.set(mealId, {
      ...initialMeal,
      id: mealId
    }))
    setCurrentMeal(initialMeal)
    return setAddMealPanel(true)
	}


	const deduplicated = (meals) => {
		let mealNameCache = []
		let deduplicatedMeals = []
		meals.forEach(m => {
			if (!mealNameCache.includes(m.name)) {
				mealNameCache.push(m.name)
				deduplicatedMeals.push(m)
		}} )
		return deduplicatedMeals
	}

	const demeals = deduplicated(meals)

  const mains = demeals && demeals.filter((m: IMeal) => m.type === 'MAIN')
  const entrees = demeals && demeals.filter((m: IMeal) => m.type === 'ENTREE')
  const desserts = demeals && demeals.filter((m: IMeal) => m.type === 'DESSERT')

  return (
    <div className="flex">
      <div className="w-full sm:w-1/2 p-8">
        <div className="w-1/3">
					<RoughTitle title={"Comidas"}/>
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
				<button className="main-button" onClick={() => showPanel()}>
					Añadir Plato
				</button>
			</div>
			<>
        <Transition
					show={addMealPanel}
					{...PanelTransitionProps}
				>
					<AddMealPanel/>
        </Transition>
        <Transition show={currentMeal.id.length > 1}
					{...PanelTransitionProps}
				>
					<MealPanel menus={menus}/>
        </Transition>
			</>
    </div>
  )
}

export default MealsPage
