import React from 'react'
import {CurrentDay, DisplayEditMenuPanel, menusPost, menusPostPromises, validateMenus, CurrentEditMenu, MenuMap, scheduledMenusPostPromises, DisplayMenuPanel} from '../../services/MenuService'
import { useAtom } from 'jotai'
import {useLocalStorage} from '../../utils/LocalStorageHook'
import {IMenu, initialMenu} from '../../models/MenuTypes'
import CloseIcon from '../../svgs/CloseIcon'
import { ToastState } from '../../services/UiService'
import MenuForm from './MenuForm'
import type {IMeal} from '../../models/MealTypes'
import {mutate} from 'swr'
import {FilterEncodeString, MenusFiltersAtom} from '../../services/FilterService'
import TrashIcon from '../../svgs/TrashIcon'
import {DeleterPromise} from '../../services/Fetcher'

const EditMenuPanel:React.FC<{menu: IMenu, meals:IMeal[]}> = ({menu, meals}) => {
  const [cu] = useLocalStorage('user', '')
  const [menuMap, setMenuMap] = useAtom(MenuMap)
  const [, setToastState] = useAtom(ToastState)
  const [currentMenuFilters] = useAtom(MenusFiltersAtom)
  const [, setCurrentDay] = useAtom(CurrentDay)
	const [currentEditMenu, setCurrentEditMenu] = useAtom(CurrentEditMenu)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayMenuPanel)

  const validateAndPublishMenus = () => {
    const menus: IMenu[] = Array.from(menuMap, ([id, menu]) => ({id, menu})).map(m => m.menu) 
    const validation = validateMenus(menus)
    validation.ok !== true ?
      showPublishError(validation) :
				displayPanel.origin === 'schedule' ?
					postScheduledMenus(menus) : postMenus(menus)

  } 

  const showPublishError = (validation) => setToastState({status: "error", message: validation.msg}) 

  const postMenus = (menus) =>  
    menusPost(menusPostPromises(menus, cu.id))
     .then(()=> {
       mutate(['menus', FilterEncodeString(currentMenuFilters)])
       setCurrentEditMenu(initialMenu)
       setToastState({status: "ok", message:"Has editado los menús"})
       setMenuMap(new Map())
     })
     .catch(err =>
       setToastState({status: "error", message: err})
     )

	const postScheduledMenus = (menus) =>
		menusPost(scheduledMenusPostPromises(menus, cu.id))
			.then(() => {
				mutate(['schedule_menus'])
       setCurrentEditMenu(initialMenu)
				setToastState({status: "ok", message:"Has editado los menús programados"})
				setMenuMap(new Map())
			})
			.catch(err => {
				console.log({err})
				setToastState({status: "error", message: err})
			})


  const deleteCurrentMenu = () => {
		if (!confirm("¿Desea eliminar este menú?")) return
    DeleterPromise(`menus/${menu.id}`) 
      .then(()=> {
        mutate(['menus', FilterEncodeString(currentMenuFilters)])
        setCurrentEditMenu(initialMenu)
        setCurrentDay(0)
        setToastState({status: 'ok', message: "Has eliminado el menú."})
        setMenuMap(new Map())
				setDisplayPanel(false)
      })
      .catch(err => {
        setToastState({status: "error", message: err})
      })
  }
 
    
  return (
  <div className="p-4 border-2 rounded shadow-sm bg-crema-125 border-mostaza-200">
    <div className="flex justify-between">
      <div className="text-lg font-bold">
        Editar Menú
      </div>
      <div className="flex">
        <div className="w-6 cursor-pointer" 
             onClick={()=> deleteCurrentMenu()} >
          <TrashIcon/>
        </div>
        <div className="w-6 cursor-pointer" 
             onClick={()=>setCurrentEditMenu(initialMenu)} >
          <CloseIcon/>
        </div>
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
    <button onClick={() => validateAndPublishMenus()}
    className="secondary-button">Publicar</button>
    </div>
  )
}

export default EditMenuPanel
