import React from "react"
import { useAtom } from "jotai"
import {DisplayAddMealPanel, MealMap, mealsPost, mealsPostPromises, validateNewMeals} from "../../services/MealService"
import CloseIcon from "../../svgs/CloseIcon"
import MealForm from "./MealForm"
import type { IMeal } from '../../models/MealTypes'
import { ToastState } from '../../services/UiService'
import {useLocalStorage} from '../../utils/LocalStorageHook'
import {mutate} from "swr"

const AddMealPanel = () => {

  const [cu] = useLocalStorage('user', '')
  const [displayPanel, setDisplayPanel] = useAtom(DisplayAddMealPanel)
  const [mealMap, setMealMap] =  useAtom(MealMap)
  const [, setToastState] = useAtom(ToastState)

  const validateAndPublishMeals = () => {
    const meals: IMeal[] = Array.from(mealMap, ([id, meal]) => ({id, meal})).map(m => m.meal)
    const validation = validateNewMeals(meals)
    return validation.ok === true ?
      postMeals(meals) :
      showPublishError(validation)
    }
  
  const showPublishError = (validation) => 
    setToastState({status: "error", message: validation.msg})

  const postMeals = (meals) => 
    mealsPost(mealsPostPromises(meals, cu.id))
      .then(()=> {
        setToastState({status: "ok", message: "Has publicado las comidas"})
        setMealMap(new Map()) 
        setDisplayPanel(false)
      })
      .catch(err => setToastState({status: "error", message: err}) )

  return (
    <div className={`min-h-screen p-8 ml-8 bg-crema-125 border-mostaza-200 border-l-2 shadow-sm`}>
      <div className="flex flex-col max-w-md px-8 mx-auto">
        <div className="flex justify-between">
          <div className="text-xl font-bold">
            Añadir Comidas
          </div>
          <div className="w-6 cursor-pointer" 
            onClick={()=>setDisplayPanel(false)} >
            <CloseIcon/>
          </div>
        </div>
        <MealForm />
        <button className="secondary-button"
          onClick={() => validateAndPublishMeals()}>
          Publicar Comidas
        </button>
      </div>
    </div>
  )
}

export default AddMealPanel
