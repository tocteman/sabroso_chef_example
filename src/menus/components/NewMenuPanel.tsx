import React, {useState} from 'react'
import CloseIcon from '../../svgs/CloseIcon'
import {useAtom} from 'jotai'
import {CurrentDay, DisplayPanel} from '../../services/MenuService'
import type {IMeal} from '../../models/MealTypes'
import NewMealForm from './NewMealForm'
import {LunchMenu, NewMenuMap, NewMenuObj} from '../../services/MealService'
import {MenuTypes} from '../../services/MenuService'
import { v4 as uuidv4 } from 'uuid';
import {IMenu, initialMenu} from '../../models/MenuTypes'
import format from 'date-fns/format'

const NewMenuPanel: React.FC<{meals: IMeal[]}> = ({meals}) => {
  const [displayPanel, setDisplayPanel] = useAtom(DisplayPanel)
  const [newMenuMap, setNewMenuMap] = useAtom(NewMenuMap)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const [currentDay] = useAtom(CurrentDay)
  const toggleDropdown = () => setShowDropdown(true) 

  const addMenu = (mt) => {
    const menuId = uuidv4()
    setShowDropdown(false)
    setNewMenuMap(newMenuMap.set(menuId, {
      ...initialMenu, 
      type: mt.code,
      menuDate: format(currentDay, 'yyyy-MM-dd'),
      id: menuId
    }))
  }

  const mappedMenus = () => Array.from(newMenuMap, ([id, menu]) => ({id, menu}))

  const desayunos = () => mappedMenus()
        .filter(m => m.menu.type === 'BREAKFAST')
  const almuerzos = () => mappedMenus()
        .filter(m => m.menu.type === 'LUNCH')
  const cenas = () => mappedMenus()
        .filter(m => m.menu.type === 'DINNER')

  const duplicateLunch = () => {
    const lunch = almuerzos()[0].menu
    const primerosAlmuerzos = almuerzos()
    console.log({primerosAlmuerzos})
    const menuId = uuidv4()
    const newMap = new Map(newMenuMap)
    newMap.set(menuId, {
      ...lunch,
      id: menuId,
      tag: "",
      main: "",
    })
    setNewMenuMap(newMenuMap.set(menuId, {...lunch, id: menuId, tag: "", main: ""}))
    console.log({newMenuMap})
    const newAlmuerzos = almuerzos()
    console.log({newAlmuerzos})
   // setNewMenuMap(newMap)

  }

  return (

  <div className="p-4 border-2 rounded shadow-sm bg-crema-125 border-mostaza-200">
    <div className="flex items-center justify-between">
      <div className="text-lg">
        Añadir Menús
      </div> 
      <div className="w-6 cursor-pointer"
        onClick={()=>setDisplayPanel(false)}
      >
        <CloseIcon/>
      </div>
    </div>
    <div className="flex">
      <div className="px-2 py-1 text-3xl font-bold cursor-pointer hover:bg-white" onClick={()=> setShowDropdown(true)}>
        +
      </div>
    {showDropdown && (
      <div className="p-2 border rounded border-mostaza-200 ">
        {MenuTypes.map(mt => (
          <div className="cursor-pointer hover:bg-white" key={`mt--${mt.name}`} onClick={()=> addMenu(mt)}>
            {mt.name}
          </div>)
        )}

      </div>)
    }
   </div>
   { desayunos().length > 0 && 
   <div>
     <div className="py-1 text-xl font-bold">Desayunos</div>
     {desayunos()
        .map(m => (
          <div key={m.id}>
            <NewMealForm
              meals={meals.filter(m=> m.type==='MAIN')}
              type="breakfast"
              menuId={m.id}
            />
          </div>
        ))}
      </div>
    }
{ almuerzos().length > 0 && 
   <div>
     <div className="py-1 text-xl font-bold">Almuerzos</div>
     {almuerzos()
        .map(m => (
          <div key={m.id} className="flex">
            <div>
            <NewMealForm
              meals={meals.filter(m=> m.type==='MAIN')}
              type="lunch"
              menuId={m.id}
              key={`${m.id}-main`}
            />
            <NewMealForm
              meals={meals.filter(m=> m.type==='ENTREE')}
              type="lunch"
              menuId={m.id}
              key={`${m.id}-entree`}
            />
            <NewMealForm
              meals={meals.filter(m=> m.type==='DESSERT')}
              type="lunch"
              menuId={m.id}
              key={`${m.id}-dessert`}
            />
          </div>
        </div>
        ))}
      </div>
    }
{ cenas().length > 0 && 
   <div>
     Cenas
     {cenas()
        .map(m => (
          <div key={m.id}>{m.id}</div>
        ))}
      </div>
    }

    {almuerzos().length > 0 && <button onClick={() => duplicateLunch()}>duplicar almuerzo</button>}

  </div>
  ) 
}

export default NewMenuPanel
