import React from 'react'
import {DisplayEditMenuPanel} from '../../services/MenuService'
import { useAtom } from 'jotai'
import {useLocalStorage} from '../../utils/LocalStorageHook'
import {EditedMenuMap} from '../../services/MealService'
import {IMenu, initialMenu} from '../../models/MenuTypes'
import CloseIcon from '../../svgs/CloseIcon'
import MenuForm from './MenuForm'
import type {IMeal} from '../../models/MealTypes'

const EditMenuPanel:React.FC<{menu: IMenu, meals:IMeal[]}> = ({menu, meals}) => {
  const [cu] = useLocalStorage('user', '')
  const [displayPanel, setDisplayPanel] = useAtom(DisplayEditMenuPanel)
  const [editedMenuMap, setEditedMenuMap] = useAtom(EditedMenuMap)


    
  return (
  <div className="p-4 border-2 rounded shadow-sm bg-crema-125 border-mostaza-200">
    <div className="flex justify-between">
      <div className="text-lg font-bold">
        Editar Menú
      </div>
      <div className="w-6 cursor-pointer" 
           onClick={()=>setDisplayPanel(initialMenu)} >
        <CloseIcon/>
      </div>
    </div>
    {menu.type === 'LUNCH' && 
    <div>
      <MenuForm
          meals={meals.filter(m => m.type === 'MAIN')}
          menuId = {menu.id}
      />
      <MenuForm
          meals={meals.filter(m => m.type === 'ENTREE')}
          menuId = {menu.id}
      />
      <MenuForm
          meals={meals.filter(m => m.type === 'DESSERT')}
          menuId = {menu.id}
      />
    </div>
    }
    {(menu.type === 'BREAKFAST' || menu.type === 'DINNER') &&
    <div>
        <MenuForm
          meals={meals.filter(m => m.type === 'MAIN')}
          menuId = {menu.id}
        />
    </div>    
    }
    <button className="secondary-button">Publicar</button>


      


    </div>
  )
}

export default EditMenuPanel
