import React from 'react'
import {atom, useAtom} from 'jotai'
import {CurrentMeal, DisplayEditMealPanel} from '../../services/MealService'
import {groupBy} from '../../utils/JsUtils'
import type {IMenu} from 'src/models/MenuTypes'
import {Ddmm} from '../../utils/DateUtils'
import CloseIcon from '../../svgs/CloseIcon'
import {initialMeal} from '../../models/MealTypes'
import { Transition  } from '@headlessui/react'
import EditIcon from '../../svgs/EditIcon'
import MealForm from './MealForm'


const MealPanel: React.FC<{ menus: IMenu[] }> = ({ menus }) => {
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)
  const [editPanel, setEditPanel] = useAtom(DisplayEditMealPanel)
  const groupByType = groupBy(currentMeal.type.toLowerCase())
  const menusByType = groupByType(menus)

  const renderMenus = () => menusByType[currentMeal.name] ? 
    Object.entries(menusByType[currentMeal.name]) : 
    null


  const publishChanges = () => {

  }
  
  
  return (
    <div
      className={`min-h-screen p-8 ml-8  
        ${currentMeal.id.length > 1 &&
        `min-h-screen bg-white pr-8 border-l-2 border-mostaza-300` } 
        ${currentMeal.id.length>1 && `slide-in-fwd-right ` }
        `}
    >
      {currentMeal.id.length > 1 &&  editPanel === false && ( 
        <div className="p-8">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="text-2xl font-bold">{currentMeal.name}</div>
              <div onClick={() => setEditPanel(true)} 
                className="w-3 ml-3 cursor-pointer hover:text-gray-700"                
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
    <div>
      <MealForm/>

      <button onClick={() => publishChanges()}
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
