import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import {Fetcher, FilteredFetcher} from '../services/Fetcher'
import type {IOrder, IOrderDetails} from '../models/OrderTypes'
import type {IGroup, IParsedGroup} from '../models/GroupTypes'
import { orderFiltersAtom, FilterEncodeString, menusFiltersAtom } from '../services/FilterService'
import { PicksFilter, TodayPicks, InBetweenDays, dateForFilter } from '../utils/DateUtils'
import {menuKey} from '../utils/StringUtils'
import { useAtom, atom } from 'jotai'
import type {IWorkspace} from '../models/WorkspaceTypes'
import type {IMenu} from '../models/MenuTypes'
import {useLocalStorage} from '../utils/LocalStorageHook'
import ReportTable from './components/ReportTable'
import {viewAtom} from '../services/OrderService'
import Loader from '../general/components/Loader'
import { RoughNotation} from "react-rough-notation";
import { generatePdf } from '../services/OrderReportService'
import { CurrentMenuType, MenuTypes } from '../services/MenuService'

const OrdersPage = () => {
  const [cu] = useLocalStorage('user', '')
  const [view, setView] = useAtom(viewAtom)
  
  const [currentOrderFilters, setCurrentOrderFilters] = useAtom( orderFiltersAtom)
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(menusFiltersAtom)
  const [prev, setPrev] = useState(TodayPicks)
  const [next, setNext] = useState(TodayPicks)


  const { data: workspaces} = useSWR( ['workspaces'], Fetcher)
  const { data: orders} = useSWR(
    ['orders', FilterEncodeString(currentOrderFilters)], FilteredFetcher
  )
  const { data: groups} = useSWR(['groups'], Fetcher)
  const { data: menus} = useSWR(
    ['menus', FilterEncodeString(currentMenuFilters)],
    FilteredFetcher
  )

  const [currentMenuType, setCurrentMenuType] = useAtom(CurrentMenuType)

  useEffect(() => {
    const dateStrings: string = InBetweenDays([prev, next])
    setCurrentMenuFilters([PicksFilter(cu.chefId, 'chefId', '=')])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
    setCurrentMenuType(MenuTypes.find(mt => mt.code === 'LUNCH'))
  }, [])

    if (!workspaces) return <Loader/>
    if (!orders) return <Loader/>
    if (!groups) return <Loader/>

  const setDate = (dateString: string) => {
    setPrev(dateString), setNext(dateString)
    updateDates(dateString, dateString)
  }

  const updateDates = (antes = prev, despues = next) => {
    const dateStrings: string = InBetweenDays([antes, despues])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
  }

  const parsedGroups = (groupsByWk: IGroup[] = groups) => {
    const filteredGroups = groupsByWk.filter(
      (g: IGroup) => g.configurations.length > 5,
    )
    return filteredGroups.map((g: IGroup) => ({
      id: g.id,
      workspaceId: g.workspaceId,
      name: g.name,
      serviceType: JSON.parse(g.configurations)[0]?.serviceType,
    }))
  }

  const menuCount = (parsedOrders: IOrder[]) =>
    parsedOrders
      .map((o: IOrder) =>
        JSON.parse(o.details).map((d: IOrderDetails) => d.quantity),
      )
      .flat()
      .reduce((rquant: number, quant: number) => rquant + Number(quant), 0)

  const ordersByWk = (wk: IWorkspace, selectedOrders: IOrder[] = orders) =>
    selectedOrders
      .filter((o: IOrder) => o.status !== 'CANCELED')
      .filter((order: IOrder) => order.workspaceId === wk.id)


  const mapTheMenus = (menusToMap: IMenu[]) => {
    const mapMenu = new Map()
    menusToMap
      .filter((m: IMenu) =>
          m.menuDate.slice(0, 10) == dateForFilter(next).slice(0, 10),
      )
      .forEach((m: IMenu) => mapMenu.set(menuKey(m), m.tag))
    return mapMenu
  }

  const wk = workspaces.filter((w:IWorkspace) => w.id === "c03e25dc-dc48-44a0-850d-32126416fb6d")

  const setMenuType = (menuCode: string) => {
    console.log(menuCode)
    console.log(MenuTypes.find(mt => mt.code===menuCode))
    menuCode === 'ALL' ? 
      setCurrentMenuType('ALL') :
      setCurrentMenuType(MenuTypes.find(mt => mt.code===menuCode)[0])

  }
    


  return (
    <main className="p-8">
      <div className="w-1/6">
      <RoughNotation strokeWidth={2} type="underline" color={'#ff3331'} show={true} animationDuration={300} iterations={1}>
      <h1 className="my-8 text-3xl font-bold">Órdenes</h1>
      </RoughNotation>
      </div>
      <div className="flex">
        <div className="flex flex-col rounded border-mostaza-300">
          <label className="text-sm uppercase">fecha</label>
          <input
            type="date"
            className="std-input"
            value={prev}
            onChange={(e) => {
              setDate(e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col ml-8">
          <label className="text-sm uppercase">presentación</label>
            <select onChange={(e) => setView(e.target.value) }
              className="uppercase std-input">
            <option value="cocina" >
              COCINA
            </option>
            <option value="reparto" onSelect={() => setView('r')}>
              REPARTO
            </option>
          </select>
        </div>
        <div className="flex flex-col ml-8">
          <label className="text-sm uppercase">Tipo de Menú</label>
          <select onChange={(e) => setMenuType(e.target.value)}
            className="uppercase std-input">
            {MenuTypes.map(mt => (
              <option value={mt.code}>
                {mt.name}
              </option>
            ))}
            <option value={"ALL"}>Todos</option>
            
          </select>
        </div>
        <div>
          <label className="text-sm uppercase">Tipo de Servicio</label>
        </div>
        <button onClick={() => generatePdf(
          ordersByWk(wk[0]),
          parsedGroups()?.filter(g => g.workspaceId === wk[0].id),
          mapTheMenus(menus),
          new Date(TodayPicks()).valueOf()
        )}
        className="mt-1 ml-8 main-button">
          Descargar Reporte
          </button>
      </div>
      <div key={wk.id} className="mt-8">
        {orders && ordersByWk(wk[0]).length > 0 && menus && (
          <div>
            <h3 className="my-2 text-2xl font-bold">
              {wk.name}
            </h3>
            {orders && (
              <h5 className="mt-2 text-lg font-normal">
                <span className="font-bold">
                  {menuCount(ordersByWk(wk[0]))}
                </span> menús servidos.  </h5>
            )}
            <ReportTable
              orders={ordersByWk(wk[0])}
              parsedGroups={parsedGroups()?.filter(
                (g: IParsedGroup) => g.workspaceId === wk[0].id,
              )}
              currentMenus={mapTheMenus(menus)} />
          </div>
        )}
      </div>
    </main>
  )
}

export default OrdersPage
