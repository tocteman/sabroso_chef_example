import React, {useState} from 'react'
import CloseIcon from '../../svgs/CloseIcon'
import {useAtom} from 'jotai'
import {CurrentDay, DisplayNewMenuPanel, menusPost, menusPostPromises, validateNewMenus} from '../../services/MenuService'
import type {IMeal} from '../../models/MealTypes'
import MenuForm from './MenuForm'
import {LunchMenu, MenuMap, NewMenuObj} from '../../services/MealService'
import {MenuTypes} from '../../services/MenuService'
import { v4 as uuidv4 } from 'uuid';
import {IMenu, initialMenu} from '../../models/MenuTypes'
import format from 'date-fns/format'
import {useLocalStorage} from '../../utils/LocalStorageHook'
import DuplicateIcon from '../../svgs/DuplicateIcon'

const NewMenuPanel: React.FC<{meals: IMeal[]}> = ({meals}) => {
  const [cu] = useLocalStorage('user', '')
  const [displayPanel, setDisplayPanel] = useAtom(DisplayNewMenuPanel)
  const [menuMap, setMenuMap] = useAtom(MenuMap)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const [currentDay] = useAtom(CurrentDay)
  const toggleDropdown = () => setShowDropdown(true) 
  const [duplicable, setDuplicable] = useState(true)

  const addMenu = (mt) => {
    const menuId = uuidv4()
    setShowDropdown(false)
    setMenuMap(menuMap.set(menuId, {
      ...initialMenu, 
      type: mt.code,
      menuDate: format(currentDay, 'yyyy-MM-dd'),
      id: menuId
    }))
  }
 
  const duplicateLunch = () => {
    const lunch = almuerzos()[0].menu
    const menuId = uuidv4()
    setDuplicable(false)
    setMenuMap(menuMap.set(menuId, {
      ...lunch,
      type: "LUNCH",
      id: menuId,
      menuDate: format(currentDay, 'yyyy-MM-dd'),
      main: "",
      tag: ""
    }))
    setTimeout(() => setDuplicable(true), 160)
  }

  const mappedMenus = () => Array.from(menuMap, ([id, menu]) => ({id, menu}))

  const desayunos = () => mappedMenus()
        .filter(m => m.menu.type === 'BREAKFAST')
  const almuerzos = () => mappedMenus()
        .filter(m => m.menu.type === 'LUNCH')
  const cenas = () => mappedMenus()
        .filter(m => m.menu.type === 'DINNER')

  const publishMenus = () => {
    const menus: IMenu[] = Array.from(menuMap, ([id, menu]) => ({id, menu})).map(m => m.menu) 
    const validation = validateNewMenus(menus)
    if (validation.ok === false) {
      console.log(validation.msg); 
      return false
    }
    if (validation.ok) {
      console.log(validation.msg)
      menusPost( menusPostPromises(menus, cu.id))
    }   
  } 
 
  return (
  <div className="p-4 border-2 rounded shadow-sm bg-crema-125 border-mostaza-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-lg">
          Añadir Menús
        </div> 
        <div className="flex">
          <div className="px-2 py-1 text-3xl font-bold cursor-pointer hover:bg-white" onClick={()=> setShowDropdown(true)}>
            +
          </div>
          {showDropdown && (
            <div className="absolute z-10 mx-6 my-2 border rounded shadow-sm bg-crema-150 border-mostaza-200 ">
              {MenuTypes.map(mt => (
                <div className="p-2 cursor-pointer hover:bg-white"
                  key={`mt--${mt.name}`}
                  onClick={()=> addMenu(mt)}>
                  {mt.name}
                </div>)
              )}

            </div>)
        }
      </div>

      </div>
      <div className="w-6 cursor-pointer" 
           onClick={()=>setDisplayPanel(false)} >
        <CloseIcon/>
      </div>
    </div>
       { desayunos().length > 0 && 
   <div>
     <div className="py-1 text-xl font-bold">Desayunos</div>
     {desayunos()
        .map(m => (
          <div key={m.id}>
            <MenuForm
              meals={meals.filter(m=> m.type==='MAIN')}
              menuId={m.id}
            />
          </div>
        ))}
      </div>
    }
{ almuerzos().length > 0 && 
   <div>
     <div className="flex items-center">

     <div className="py-1 text-xl font-bold">Almuerzos</div>
    <button className={`${duplicable ? `text-black`: `text-gray-700`} w-6 h-6 cursor-pointer ml-2 hover:text-gray-800` } onClick={() => duplicateLunch()}>
      <DuplicateIcon/>
    </button>
     </div>
     {almuerzos()
        .map((m, i) => (
          <div key={m.id} className="flex">
            <div>
            {i > 0 && <hr className="mt-3 mb-2 border-1 border-mostaza-300"/>}
            <MenuForm
              meals={meals.filter(m=> m.type==='MAIN')}
              menuId={m.id}
              key={`${m.id}-main`}
            />
            <MenuForm
              meals={meals.filter(m=> m.type==='ENTREE')}
              menuId={m.id}
              key={`${m.id}-entree`}
            />
            <MenuForm
              meals={meals.filter(m=> m.type==='DESSERT')}
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
     <div className="py-1 text-xl font-bold">Cenas</div>
     {cenas()
        .map(m => (
          <div key={m.id}>
            <MenuForm
              meals={meals.filter(m => m.type === 'MAIN')}
              menuId={m.id}
              key={`${m.id}-main`}
            />
          </div>
        ))}
      </div>
    }
    {menuMap.size > 0 && <button className="my-4 main-button" onClick={() => publishMenus()}>Publicar</button>}


  </div>
  ) 
}

export default NewMenuPanel
