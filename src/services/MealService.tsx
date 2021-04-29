import React from 'react'
import {atom} from 'jotai'
import {ICompositeMenu, IMeal, initialCompositeMenu} from '../models/MealTypes'
import {initialMeal} from '../models/MealTypes'
import type {ISliceRange} from '../models/UiTypes'
import type {IMenu} from 'src/models/MenuTypes'
import { mutate } from 'swr'
import type {AxiosResponse} from 'axios'
import {PosterPromise} from './Fetcher'

const is:ISliceRange = {from: 0, to:5}

export const MainSlice = atom<ISliceRange>(is)
export const EntreeSlice = atom<ISliceRange>(is)
export const DessertSlice = atom<ISliceRange>(is)

export const CurrentMeal = atom<IMeal>(initialMeal)
export const BreakfastMenu = atom<string>("")
export const DinnerMenu = atom<string>("")
export const LunchMenu = atom<ICompositeMenu>(initialCompositeMenu)
export const MealMap = atom<Map<string, IMeal>>(new Map())

export const DisplayAddMealPanel = atom<boolean>(false)
export const DisplayEditMealPanel = atom<boolean>(false)

export const DisplayExcelImportPanel = atom<boolean>(false)
// QUÉ TIPO DE ARCHIVO ES ESTE
export const ExcelMeals = atom<File|null>(null)

export const selectedMeal = atom<string>("")

export const buildMealForm = (mealData: IMeal, chefId: string  ) => {
    const f = new FormData();
    const m = mealData
    f.append('id', m.id );
    f.append('chefId', chefId );
    f.append('name', m.name );
    f.append('description', m.description );
    f.append('type', m.type );
    f.append('allergens', m.allergens ?? "" );
    f.append('image', m.image ?? "" );
    f.append('kcal', m.kcal.toString() ?? "");
    f.append('ingredients', m.ingredients ?? "");
    f.append('macros', m.macros ?? "");
  return f
  }

export const importData = (mealsObj) =>
	PosterPromise(`meals/import_excel`, buildExcelForm(mealsObj))

export const buildExcelForm = (mealsObj) => {
	 const f = new FormData();
	 f.append('chefId', mealsObj.chefId );
	 f.append('meals', mealsObj.meals );
	 return f
}

const buildMealObj = (m:IMeal, chefId:string) => ({
  id: m.id,
  chefId,
  description: m.description,
  name: m.name,
  type: m.type,
  kcal: m.kcal
})

export const mealsPostPromises = (meals: IMeal[], chefId: string) =>
  meals.map(m => PosterPromise(
  `meals/${m.id}`, buildMealObj(m, chefId)
))

export const mealsPost = (meals: Promise<AxiosResponse<any>>[]) => 
  Promise.all(meals)
    .then(res => {
      mutate(['meals'])
      return res
    })
    .catch(err => console.log(err))

export const validateNewMeals = (meals: IMeal[]) => {
	console.log({meals})
  const resp = (ok: boolean, msg: string) => ({ok, msg})
  const namesOk = meals.every(m => m.name.length>0)
  const typesOk = meals.every(m => m.type.length > 0)
  if (!namesOk) return resp(false, "Recuerda nombrar a cada comida") 
  if (!typesOk) return resp(false, "Recuerda seleccionar el tipo de cada comida")
  return resp(true, "ok")
}

export const validateExcelImport = ({meals, chefId}) => {
  const resp = (ok: boolean, msg: string) => ({ok, msg})
	console.log({meals})
	if (!meals) return resp(false, "Asegúrate de importar el archivo correcto")
	return resp(true, "ok")
}
