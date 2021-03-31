import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import {Fetcher, FilteredFetcher} from '../services/Fetcher'
import type {IOrder, IOrderDetails} from '../models/OrderTypes'
import type {IGroup, IParsedGroup} from '../models/GroupTypes'
import { orderFiltersAtom, FilterEncodeString, menusFiltersAtom } from '../services/FilterService'
import { PicksFilter, TodayPicks, InBetweenDays, dateForFilter, parsed } from '../utils/DateUtils'
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
import { CurrentMenuType, CurrentServiceType, MenuTypes } from '../services/MenuService'

const OrdersPage = () => {
  const [cu] = useLocalStorage('user', '')
  const [view, setView] = useAtom(viewAtom)
  
  const [currentOrderFilters, setCurrentOrderFilters] = useAtom( orderFiltersAtom)
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(menusFiltersAtom)
  const [prev, setPrev] = useState(TodayPicks)
  const [next, setNext] = useState(TodayPicks)

  const { data: workspaces} = useSWR( ['workspaces'], Fetcher)
  const { data: orders} = useSWR(FilterEncodeString(currentOrderFilters) !== "" ? 
    ['orders', FilterEncodeString(currentOrderFilters)] : null, FilteredFetcher
  )
  const { data: groups} = useSWR(['groups'], Fetcher)
  const { data: menus} = useSWR(
    ['menus', FilterEncodeString(currentMenuFilters)],
    FilteredFetcher
  )

  const [currentMenuType, setCurrentMenuType] = useAtom(CurrentMenuType)
  const [currentServiceType, setCurrentServiceType] = useAtom(CurrentServiceType)

  useEffect(() => {
    const dateStrings: string = InBetweenDays([prev, next])
    setCurrentMenuFilters([PicksFilter(cu.chefId, 'chefId', '=')])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
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

  const parsedGroups = (groupsByWk: IGroup[] = groups) => 
    mappedGroups()
    .filter(g => currentServiceType === 'ALL' ? true : g.serviceType.name === currentServiceType)

  const mappedGroups = (groupsByWk: IGroup[] = groups) => 
    groupsByWk
      .filter(g => g.configurations.length > 5)
      .map((g: IGroup) => ({
        id: g.id,
        workspaceId: g.workspaceId,
        name: g.name,
        serviceType: JSON.parse(g.configurations)[0]?.serviceType
      }))


  const filteredGroups = () => parsedGroups()
      .filter(g => currentServiceType === 'ALL' ? true :
        currentServiceType === g.serviceType?.name)

  const menuCount = (parsedOrders: IOrder[]) =>
    parsedOrders
      .map((o: IOrder) => o.details.map(d => d.quantity))
      .flat()
      .reduce((rquant: number, quant: number) => rquant + Number(quant), 0)

  const ordersByWk = (wk: IWorkspace, selectedOrders = orders) => 
    selectedOrders
      .map(o => ({...o, details: JSON.parse(o.details)}))
      .filter((o: IOrder) => o.status !== 'CANCELED')
      .filter(o => o.workspaceId === wk.id)
      .filter(o => currentMenuType === 'ALL' ?  true : o.details[0].type === currentMenuType) 
      .filter(o => filteredGroups().map(g => g.id).includes(o.groupId))
      
  const mapTheMenus = (menusToMap: IMenu[]) => {
    const mapMenu = new Map()
    menusToMap
      .filter((m: IMenu) =>
          m.menuDate.slice(0, 10) == dateForFilter(next).slice(0, 10),
      )
      .filter(m => currentMenuType === 'ALL' ?  true : m.type === currentMenuType) 
      .forEach((m: IMenu) => mapMenu.set(menuKey(m), m.tag))
    return mapMenu
  }

  

  const wk = workspaces.filter((w:IWorkspace) => w.id === "c03e25dc-dc48-44a0-850d-32126416fb6d")[0]

  const ServiceTypes = () => 
    Array.from(new Set(
      mappedGroups()
      .map(g => g.serviceType.name))
    )

  const pdfGen = (wk) => {
    const currentGroups = parsedGroups()?.filter(g => g.workspaceId === wk.id)
    const currentDate = parsed(next).valueOf()
    const currentMenus = menus
                        .filter(m => currentMenuType === 'ALL' ? true : m.type === currentMenuType)
    if (currentServiceType === 'ALL') {
      Array.from(new Set(currentGroups.map(g => g.serviceType.name)))
        .forEach(gst => {
          const stGroups = currentGroups.filter(g => g.serviceType.name === gst)
          const stGroupsIds = stGroups.map(g => g.id)
          const stOrders = ordersByWk(wk).filter(o => stGroupsIds.includes(o.groupId))
          if (stOrders.length > 0 ) return generatePdf(stOrders, stGroups, currentMenus, currentDate)
        })
    } else {
      return generatePdf (ordersByWk(wk), currentGroups, currentMenus, currentDate)
    }
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
          <select onChange={(e) => setCurrentMenuType(e.target.value)}
            className="uppercase std-input"
            defaultValue={
              currentMenuType === 'ALL' ?  "Todos" :
                MenuTypes.filter(mt => currentMenuType === mt.code)[0].code
          }
            >
            {MenuTypes.map(mt => (
              <option value={mt.code}>
                {mt.name}
              </option>
            ))}
            <option value={"ALL"}>Todos</option>
            
          </select>
        </div>
        <div className="flex flex-col ml-8">
          <label className="text-sm uppercase">Tipo de Servicio</label>
          <select onChange={(e) => setCurrentServiceType(e.target.value)}
            className="uppercase std-input" 
            defaultValue={
              currentServiceType === 'ALL' ? "Todos" :
              ServiceTypes().filter(st => currentServiceType === st)[0]
            }
          >
            {ServiceTypes()
              .map(st => (
              <option key={`st-${st}`} value={st}>
                {st}
              </option>
            ))}
            <option value={"ALL"}>Todos</option>
            
          </select>

        </div>
        <button onClick={() => pdfGen(wk)}
          className={`mt-1 ml-8 main-button ${menuCount(ordersByWk(wk)) === 0 ? ` opacity-50 cursor-not-allowed ` : ` cursor-pointer `}`}>
          Descargar Reporte
          </button>
      </div>
      <div key={wk.id} className="mt-8">
        {orders && ordersByWk(wk) && menus && (
          <div>
            <h3 className="my-2 text-2xl font-bold">
              {wk.name}
            </h3>
          {orders && menuCount(ordersByWk(wk)) > 0 ? (
              <h5 className="mt-2 text-lg font-normal">
                <span className="font-bold">
                  {menuCount(ordersByWk(wk))}
                </span> comidas.
              </h5>
          ) : (<h5 className="mt-2 text-lg font-normal">Aún no has recibido pedidos.</h5>)
          }
            <ReportTable
              orders={ordersByWk(wk)}
              parsedGroups={parsedGroups()?.filter(
                (g: IParsedGroup) => g.workspaceId === wk.id,
              )}
              menus={menus.filter(m => m.menuDate.slice(0, 10) == dateForFilter(next).slice(0,10))}
              currentMenus={mapTheMenus(menus)} />
          </div>
        )}
      </div>
    </main>
  )
}

export default OrdersPage
