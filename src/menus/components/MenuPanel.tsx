import React from 'react'
import { atom, useAtom } from 'jotai'
import { CurrentDay,  DisplayNewMenuPanel,  MenusPerDay } from '../../services/MenuService'
import CloseIcon from '../../svgs/CloseIcon'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'
import { diasSemana } from '../../utils/DateUtils'
import getDay from 'date-fns/getDay'
import { sortByStr } from '../../utils/StringUtils'
import NewMenuPanel from './NewMenuPanel'
import type {IMeal} from '../../models/MealTypes'


const MenuPanel: React.FC<{meals: IMeal[]}> = ({meals}) => {
  const [currentDay, setCurrentDay] = useAtom(CurrentDay)
  const [menusPerDay, setMenusPerDay] = useAtom(MenusPerDay)
  const [displayPanel, setDisplayPanel] = useAtom(DisplayNewMenuPanel)

  const renderDay = () => menusPerDay?.length > 0 ? 
    Object.entries(sortByStr(menusPerDay, 'tag')) : []

  return (
      <div
        className={`w-full pl-8 ${currentDay > 0 && `h-full min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`}  `}
        >
          <div className="flex flex-col">
            <div className="flex justify-between w-full mt-8">
              <h3 className="text-xl">
                {currentDay > 0 && (
                  <div>
                    <span className="font-bold">
                      {`${
                        diasSemana.filter(
                          (dia) => dia.weekDayNumber === getDay(currentDay),
                        )[0].weekDayName
                      }`}
                    </span>
                    {`, ${format(currentDay, 'dd/MMM/yyyy', {
                      locale: esLocale,
                    })}`}
                  </div>
                )}
              </h3>
              {currentDay > 0 && (
                <div
                  className="w-6 text-black cursor-pointer hover:text-red-500"
                  onClick={() => setCurrentDay(0)}
                >
                  <CloseIcon />
                </div>
              )}
            </div>
              {currentDay > 0 && 
              <hr className="mt-2 border border-mostaza-200" />}
            <div className="mt-2">
              {currentDay > 0 &&
                renderDay().map(([k, v], i) => (
                  <div key={`${v.main}-${i}`}>
                    <div className="flex items-center px-2 my-1 border-2 border-transparent rounded cursor-not-allowed hover:bg-crema-100 hover:border-crema-200">
                      <div className="font-bold">
                        ~ {v.tag.includes('null') ? '' : v.tag.slice(0, 1)} ~
                      </div>
                      <div className="ml-4">
                        <span className="font-bold"> {v.main} </span> 
                        <br />
                        {v.entree !== 'null' && v.dessert !== 'null' && <div>
                            {v.entree} | {v.dessert}
                          </div> }
                     </div>
                    </div>
                    <hr className="border border-crema-200" />
                  </div>
                ))}
            </div>
              {currentDay > 0 &&
              <div className="mt-25">
                { !displayPanel &&
                  <button className="main-button" 
                    onClick={() => setDisplayPanel(true)}>
                    Añadir Menús +
                  </button>
                }
                { displayPanel &&
                <NewMenuPanel meals={meals}/>
                }

              </div>
                }
          </div>
        </div>
  )
}

export default MenuPanel
