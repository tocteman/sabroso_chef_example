import React from 'react'
import {useAtom} from 'jotai'
import {CurrentMeal, DisplayEditMealPanel, MealMap, validateNewMeals, mealsPost, mealsPostPromises} from '../../services/MealService'
import {groupBy} from '../../utils/JsUtils'
import type {IMenu} from 'src/models/MenuTypes'
import {Ddmm} from '../../utils/DateUtils'
import CloseIcon from '../../svgs/CloseIcon'
import {IMeal, initialMeal} from '../../models/MealTypes'
import { Transition  } from '@headlessui/react'
import EditIcon from '../../svgs/EditIcon'
import MealForm from './MealForm'
import {ToastState} from '../../services/UiService'
import {useLocalStorage} from '../../utils/LocalStorageHook'


const MealPanel: React.FC<{ menus: IMenu[] }> = ({ menus }) => {
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)
  const [editPanel, setEditPanel] = useAtom(DisplayEditMealPanel)
  const groupByType = groupBy(currentMeal.type.toLowerCase())
  const menusByType = groupByType(menus)
  const [mealMap, setMealMap] =  useAtom(MealMap)
  const [, setToastState] = useAtom(ToastState)
  const [cu] = useLocalStorage('user', '')
  
  const renderMenus = () => menusByType[currentMeal.name] ? 
    Object.entries(menusByType[currentMeal.name]) : null

  const validateAndPublishMeals = () => {
    const meals: IMeal[] = Array.from(mealMap, ([id, meal]) => ({id, meal})).map(m => m.meal)
    const validation = validateNewMeals(meals)
    if (validation.ok === true ) {
      postMeals(meals) 
      setCurrentMeal(initialMeal)
    } else {
      showPublishError(validation)
    }
  }
  
  const showPublishError = (validation) => 
    setToastState({status: "error", message: validation.msg})

  const postMeals = (meals) => 
    mealsPost(mealsPostPromises(meals, cu.id))
      .then(()=> {
        setToastState({status: "ok", message: "Has publicado las comidas"})
        setMealMap(new Map()) 
        setEditPanel(false)
      })
      .catch(err => setToastState({status: "error", message: err}))

  const setNewMap = () => {
    const map = new Map()
    map.set(currentMeal.id, currentMeal)
    setMealMap(map)
  }


  const disableEdit = () =>{
    setMealMap(new Map())
    currentMeal.id.length > 0  ?
      setEditPanel(false) :
      setCurrentMeal(initialMeal);
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ml-8
        ${currentMeal.id.length > 1 &&
        `min-h-screen bg-white pr-4 sm:pr-8 border-l-2 border-mostaza-300` }
        ${currentMeal.id.length>1 && `slide-in-fwd-right ` }
        `}
    >
      {currentMeal.id.length > 1 &&  editPanel === false && ( 
        <div className="p-4 sm:p-8">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="text-xl sm:text-2xl font-bold">{currentMeal.name}</div>
              <div onClick={() => {setEditPanel(true); setNewMap()}} 
                className="w-2 sm:w-3 ml-2 cursor-pointer hover:text-gray-700"
              >
                <EditIcon/>
              </div>
            </div>
            <div
              className="w-6 text-black cursor-pointer hover:text-red-500"
              onClick={() => setCurrentMeal(initialMeal)}
            >
              <CloseIcon />
            </div>
          </div>
          {currentMeal.kcal && (
            <div className="mt-2 text-lg">
              <span className="font-bold">{currentMeal.kcal} </span>
              kcal
            </div>
          )}
              <hr className="border border-crema-200"/>
              {renderMenus()?.length > 0 && 
            <div className="mt-4 mb-2 text-lg">
              Se ha ofrecido <span className="font-bold">{renderMenus()?.length}</span> {renderMenus()?.length === 1 ? 'vez' : 'veces'}.
            </div>
          }
          <div className="grid grid-flow-col grid-rows-6 gap-2">
            {renderMenus()?.length> 0 && renderMenus().map(([k, v]) => (
              <div  className="text-sm text-gray-800">{Ddmm(v.menuDate).toUpperCase()}</div>
            ))}
          </div>
        </div>
      )}
  { currentMeal.id.length > 1 && editPanel === true && (
    <div className="w-11/12">
			<div className="flex justify-between my-4">
				<div className=" text-xl font-bold">
					Editar Comida
				</div>
				<div className="w-6 cursor-pointer hover:text-gray-700"
					onClick={() => disableEdit()}>
					<CloseIcon/>
				</div>
			</div>

			<MealForm/>
      <button onClick={() => validateAndPublishMeals()}
        className="secondary-button">
        Publicar Cambios
      </button>
    </div>
    )
  }
    </div>
  )
}

export default MealPanel
