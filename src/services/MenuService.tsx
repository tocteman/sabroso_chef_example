import {atom} from 'jotai'
import type {IMenu, IMenuPerDay, IMenuType} from '../models/MenuTypes'
import {initialMenu, initialMenuPerDay} from '../models/MenuTypes'
import {PosterPromise} from '../services/Fetcher'
import type {AxiosResponse} from 'axios'


export const MenuTypes: IMenuType[] = [
    {code: 'BREAKFAST', name: 'Desayuno', maxHourTime: null},
    {code: 'LUNCH', name: 'Almuerzo', maxHourTime: 10},
    {code: 'DINNER', name: 'Cena', maxHourTime: 15},
  ]

export const CurrentMenu = atom<IMenu>(initialMenu)
export const CurrentMonth = atom<number>(0)
export const CurrentDay = atom<number>(0)
export const MenusPerDay = atom<IMenuPerDay[]>([initialMenuPerDay])
export const CurrentMenuType = atom<string>("LUNCH")
export const CurrentServiceType =atom<string>("Vianda")

interface IDisplayPanel {origin: "schedule"|"menu", display: boolean}

export const DisplayMenuPanel = atom<IDisplayPanel>(
	{origin: "menu", display: false})

export const MenuMap = atom<Map<string, IMenu>>(new Map())
export const DisplayNewMenuPanel =atom<boolean>(false)
export const DisplayEditMenuPanel = atom<IMenu>(initialMenu)
export const CurrentEditMenu = atom<IMenu>(initialMenu)

export const DisplayScheduledMenuPanel = atom<boolean>(false)

export const menusPostPromises = (menus: IMenu[], chefId: string) => 
    menus
    .map(m => PosterPromise(
      `menus/${m.id}`, buildMenuForm(m, chefId)
    ))
export const scheduledMenusPostPromises = (menus: IMenu[], chefId: string) =>
    menus
    .map(m => PosterPromise(
      `schedule_menus/${m.id}`, m))


export const menusPost = (menus: Promise<AxiosResponse<any>>[]) => 
  Promise.all(menus)
    .then(res => {
      return res
    })
  .catch(err => console.log(err))

export const buildMenuForm = (menuData: IMenu, chefId:string) => {
  const f = new FormData()
  const m = menuData
  f.append('type', m.type );
  f.append('entree', m.entree ?  m.entree : '' );
  f.append('main', m.main ?  m.main : '' );
  f.append('dessert', m.dessert ?  m.dessert : '' );
  f.append('date', m.menuDate );
  f.append('id', m.id);
  f.append('tag', m.tag)
  f.append('chefId', chefId)
  return f 
}

export const validateMenus = (menus: IMenu[]) => {
  const resp = (ok: boolean, msg: string) => ({ok, msg})
  const lunches = menus.filter(m => m.type === 'LUNCH')
  const tagsOk = menus
    .every(m => /[A-Z]/.test(m.tag))
  const mainsOk = menus
    .every(m => m.main.length > 1)
  const lunchesOk = lunches?.every(m => m.dessert.length > 1 && m.entree.length > 1)

  if (!tagsOk) return resp(false, "Recuerda etiquetar todos los men??s") 
  if (!mainsOk) return resp(false, "Todos los men??s deben tener un fuerte")
  if (lunches.length > 0 && !lunchesOk) return resp(false, "Almuerzos incompletos")
  return resp(true, "ok")
}
