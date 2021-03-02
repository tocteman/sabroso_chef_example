import React, {useState, useEffect} from 'react'
import 'twin.macro'
import useSWR from 'swr'
import {Fetcher, FilteredFetcher} from '../services/Fetcher'
import type {IOrder, IOrderDetails} from '../models/OrderTypes'
import type {IGroup, IParsedGroup} from '../models/GroupTypes'
import { orderFiltersAtom, FilterEncodeString, menusFiltersAtom } from '../services/FilterService'
import { PicksFilter, TodayPicks, InBetweenDays, dateForFilter } from '../utils/DateUtils'
import {menuKey} from '../utils/StringUtils'
import { useAtom, atom } from 'jotai'
import type {IWorkspace} from '../models/WorkspaceTypes'
import ClientOrdersTable from './components/ClientOrdersTable'
import type {IMenu} from '../models/MenuTypes'
import {useLocalStorage} from '../utils/LocalStorageHook'
import OrdersReported from './components/OrdersReported'
import OrdersOtherReport from './components/OrdersOtherReport'
import {viewAtom} from '../services/OrderService'
import Loader from '../general/components/Loader'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

const OrdersPage = () => {
  const [cu] = useLocalStorage('user', '')
  const [view, setView] = useAtom(viewAtom)
  const [currentOrderFilters, setCurrentOrderFilters] = useAtom(
    orderFiltersAtom,
  )
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
  useEffect(() => {
    const dateStrings: string = InBetweenDays([prev, next])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
    setCurrentMenuFilters([PicksFilter(cu.chefId, 'chefId', '=')])
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
        JSON.parse(o.details).map((detalle: IOrderDetails) => detalle.quantity),
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
      .filter(
        (m: IMenu) =>
          m.menuDate.slice(0, 10) == dateForFilter(next).slice(0, 10),
      )
      .forEach((m: IMenu) => mapMenu.set(menuKey(m), m.tag))
    return mapMenu
  }

  const wk = workspaces[8]
  console.log(wk)


  return (
    <main tw="p-8">
      <div tw="w-1/6">
      <RoughNotation strokeWidth={2} type="underline" color={'#ff3331'} show={true} animationDuration={300} iterations={1}>
      <h1 tw="text-3xl font-bold my-8">Órdenes</h1>
      </RoughNotation>
      </div>
      <div tw="flex">
        <div tw="flex flex-col border-mostaza-300 rounded">
          <label tw="text-sm uppercase">fecha</label>
          <input
            type="date"
            tw="p-2 bg-crema-100 text-xl font-bold appearance-none border-mostaza-200  border-2 rounded shadow-sm focus:bg-white"
            value={prev}
            onChange={(e) => {
              setDate(e.target.value)
            }}
          />
        </div>
        <div tw="flex flex-col ml-8">
          <label tw="text-sm uppercase">presentación</label>
            <select onChange={(e) => setView(e.target.value) }
              tw="border-mostaza-200 border-2 p-2 bg-crema-100 text-xl  rounded shadow-sm focus:bg-white uppercase font-bold">
            <option value="cocina" >
              COCINA
            </option>
            <option value="reparto" onSelect={() => setView('r')}>
              REPARTO
            </option>
          </select>
        </div>
      </div>
          <div key={wk.id} tw="mt-8">
            {orders && ordersByWk(workspaces[8]).length > 0 && menus && (
              <div>
                <h3 tw="text-2xl font-bold my-2">
                  {wk.name === 'Santa Priscila / Profremar' ? 'Una Empresa' : wk.name}
                  </h3>
                {orders && (
                  <h5 tw="mt-2 text-lg font-normal">
                    <span tw="font-bold">
                      {menuCount(ordersByWk(wk))}
                      </span> almuerzos.  </h5>
                )}
                <OrdersOtherReport
                  orders={ordersByWk(wk)}
                  parsedGroups={parsedGroups()?.filter(
                    (g: IParsedGroup) => g.workspaceId === wk.id,
                  )}
                  currentMenus={mapTheMenus(menus)}
                />
              </div>
            )}
          </div>
    </main>
  )
}

export default OrdersPage
