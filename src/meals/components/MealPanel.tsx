import React from 'react'
import tw from 'twin.macro'
import {css} from '@emotion/react'
import {atom, useAtom} from 'jotai'
import {CurrentMeal} from '../../services/MealService'
import {groupBy} from '../../utils/JsUtils'
import type {IMenu} from 'src/models/MenuTypes'
import {Ddmm} from '../../utils/DateUtils'
import CloseIcon from '../../svgs/CloseIcon'
import {initialMeal} from '../../models/MealTypes'
import Bouncer from '../components/BouncingText'


const MealPanel: React.FC<{ menus: IMenu[] }> = ({ menus }) => {
  const [currentMeal, setCurrentMeal] = useAtom(CurrentMeal)

  const groupByType = groupBy(currentMeal.type.toLowerCase())
  const menusByType = groupByType(menus)

  const renderMenus = () => menusByType[currentMeal.name] ? 
    Object.entries(menusByType[currentMeal.name]) : 
    null

  
  return (
    <div
      className={`${currentMeal.id.length>1 && `slide-in-fwd-right`}`}
      css={[
        tw`min-h-screen p-8 ml-8`,
        currentMeal.id.length > 1 &&
        tw`min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`,
      ]}
    >

      {currentMeal.id.length > 1 && (
        <div tw="p-8">
          <div tw="flex justify-between">
            <div tw="text-2xl font-bold">{currentMeal.name}</div>
              <div
                tw="cursor-pointer text-black hover:text-red-500 w-6"
                onClick={() => setCurrentMeal(initialMeal)}
              >
                <CloseIcon />
              </div>

          </div>
          {currentMeal.kcal && (
            <div tw="text-lg mt-2">
              <span tw="font-bold">{currentMeal.kcal} </span>
              kcal
            </div>
          )}
              <hr tw="border border-crema-200"/>
              {renderMenus()?.length > 0 && 
            <div tw="text-lg mt-4 mb-2">
              <Bouncer/>
              Se ha ofrecido <span tw="font-bold">{renderMenus()?.length}</span> {renderMenus()?.length === 1 ? 'vez' : 'veces'}.
            </div>
          }
          <div tw="grid grid-flow-col grid-rows-6 gap-2">
            {renderMenus()?.length> 0 && renderMenus().map(([k, v]) => (
              <div tw="text-gray-800 text-sm">{Ddmm(v.menuDate).toUpperCase()}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPanel
