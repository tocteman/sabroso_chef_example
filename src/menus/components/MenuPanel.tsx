import React from 'react'
import { atom, useAtom } from 'jotai'
import { CurrentDay,  MenusPerDay } from '../../services/MenuService'
import CloseIcon from '../../svgs/CloseIcon'
import format from 'date-fns/format'
import esLocale from 'date-fns/locale/es'
import { diasSemana } from '../../utils/DateUtils'
import getDay from 'date-fns/getDay'

const MenuPanel: React.FC = () => {
  const [currentDay, setCurrentDay] = useAtom(CurrentDay)
  const [menusPerDay, setMenusPerDay] = useAtom(MenusPerDay)

  const renderDay = () => Object.entries(menusPerDay)

  return (
      <div
        className={`w-1/2 pl-8 ml-8 ${currentDay > 0 && `h-full min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`}  `}
        >
          <div className="flex flex-col">
            <div className="mt-16 flex justify-beclassNameeen w-full">
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
                  className="cursor-pointer text-black hover:text-red-500 w-6"
                  onClick={() => setCurrentDay(0)}
                >
                  <CloseIcon />
                </div>
              )}
            </div>
              {currentDay > 0 && 
              <hr className="mt-2 border border-mostaza-200" />}
            <div className="mt-4">
              {currentDay > 0 &&
                renderDay().map(([k, v], i) => (
                  <div key={`${v.main}-${i}`}>
                    <div className="my-2 flex items-center rounded hover:bg-crema-100 p-2 cursor-not-allowed border-2 border-transparent hover:border-crema-200">
                      <div className="text-xl font-bold">
                        ~ {v.tag.includes('null') ? '' : v.tag.slice(0, 1)} ~
                      </div>
                      <div className="ml-4 text-lg">
                        <span className="font-bold text-xl"> {v.main} </span> 
                          <br />
                            {v.entree} | {v.dessert}
                      </div>
                    </div>
                    <hr className="border border-crema-200" />
                  </div>
                ))}
            </div>
              {currentDay > 0 &&
              <div className="mt-40">
                <button className="rounded-2xl border-2 border-mostaza-200 bg-gradient-to-b from-red-400 to-red-500 text-xl font-bold mx-auto block px-6 py-2 text-crema-100 text-center hover:border-mostaza-200 shadow-sm hover:from-red-300 cursor-not-allowed">Añadir Menú</button>
              </div>
                }
          </div>
        </div>
  )
}

export default MenuPanel
