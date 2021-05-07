import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import {Fetcher, FilteredFetcher} from '../services/Fetcher'
import type {IOrder, IOrderDetails} from '../models/OrderTypes'
import type {IGroup, IParsedGroup} from '../models/GroupTypes'
import { OrderFiltersAtom, FilterEncodeString, MenusFiltersAtom } from '../services/FilterService'
import { PicksFilter, TodayPicks, InBetweenDays, dateForFilter, parsed } from '../utils/DateUtils'
import {menuKey} from '../utils/StringUtils'
import { useAtom, atom } from 'jotai'
import type {IWorkspace} from '../models/WorkspaceTypes'
import type {IMenu} from '../models/MenuTypes'
import {useLocalStorage} from '../utils/LocalStorageHook'
import ReportTable from './components/ReportTable'
import {ViewAtom, SingleDayDate} from '../services/OrderService'
import Loader from '../general/components/Loader'
import { RoughNotation} from "react-rough-notation";
import { CurrentMenuType, CurrentServiceType, MenuTypes } from '../services/MenuService'
import {CurrentWorkspaceId} from '../services/WorkspaceService'
import RoughTitle from "../general/components/RoughTitle"
import ServiceTypeFilter from "../general/components/filters/ServiceTypeFilter"
import MenuTypesFilter   from "../general/components/filters/MenuTypeFilter"
import WorkspaceFilter   from "../general/components/filters/WorkspaceFilter"
import SingleDayFilter   from "../general/components/filters/SingleDayFilter"
import ViewLayoutOrdersFilter from "./components/ViewLayoutOrdersFilter"
import {printDemoName} from '../services/WorkspaceService'
import ReportButton from "./components/ReportButton"

const OrdersPage = () => {
  const [cu] = useLocalStorage('user', '')
  const [view, setView] = useAtom(ViewAtom)
  
  const [currentOrderFilters, setCurrentOrderFilters] = useAtom( OrderFiltersAtom)
  const [currentMenuFilters, setCurrentMenuFilters] = useAtom(MenusFiltersAtom)
	const [today, setToday] = useAtom(SingleDayDate)

  const { data: workspaces} = useSWR( ['workspaces'], Fetcher)
  const { data: orders} = useSWR(
		FilterEncodeString(currentOrderFilters) !== "" ?
			['orders', FilterEncodeString(currentOrderFilters)] : null, FilteredFetcher
  )
  const { data: groups} = useSWR(['groups'], Fetcher)
  const { data: menus} = useSWR(
    ['menus', FilterEncodeString(currentMenuFilters)],
    FilteredFetcher
  )

  const [currentMenuType, setCurrentMenuType] = useAtom(CurrentMenuType)
  const [currentServiceType, setCurrentServiceType] = useAtom(CurrentServiceType)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useAtom(CurrentWorkspaceId)
  
  const setFirstWorkspace = () => {
		const hardCoded = "c03e25dc-dc48-44a0-850d-32126416fb6d"
		workspaces.map(w => w.id).includes(hardCoded) ?
			setCurrentWorkspaceId(hardCoded) :
			setCurrentWorkspaceId(workspaces[0]?.id)
	}



  useEffect(() => {
    const dateStrings: string = InBetweenDays([today, today])
    setCurrentMenuFilters([PicksFilter(cu.chefId, 'chefId', '=')])
    setCurrentOrderFilters([PicksFilter(dateStrings, 'orderDate', 'BETWEEN')])
    setTimeout(()=> {workspaces && setFirstWorkspace()}, 300 )
  }, [])

  if (!workspaces) return <Loader/>
  if (!orders) return <Loader/>
  if (!groups) return <Loader/>

  const setDate = (dateString: string) => {
		setToday(dateString)
    updateDates(dateString, dateString)
  }

  const updateDates = (antes = today, despues = today) => {
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


  const wks = () => workspaces.map(w => ({...w, name: printDemoName(w.name)}))
  
  const filteredGroups = () => parsedGroups()
      .filter(g => currentServiceType === 'ALL' ? true :
        currentServiceType === g.serviceType?.name)

  const menuCount = (parsedOrders: IOrder[]) =>
    parsedOrders
      .map((o: IOrder) => o.details.map(d => d.quantity))
      .flat()
      .reduce((rquant: number, quant: number) => rquant + Number(quant), 0)

  const ordersByWk = (wkId:string, selectedOrders = orders) => 
    selectedOrders
      .map(o => ({...o, details: JSON.parse(o.details)}))
      .filter((o: IOrder) => o.status !== 'CANCELED')
      .filter(o => o.workspaceId === currentWorkspaceId)
      .filter(o => currentMenuType === 'ALL' ?  true : o.details[0].type === currentMenuType) 
      .filter(o => filteredGroups().map(g => g.id).includes(o.groupId))
      
  const mapTheMenus = (menusToMap: IMenu[]) => {
    const mapMenu = new Map()
    menusToMap
      .filter((m: IMenu) =>
          m.menuDate.slice(0, 10) == dateForFilter(today).slice(0, 10),
      )
      .filter(m => currentMenuType === 'ALL' ?  true : m.type === currentMenuType) 
      .forEach((m: IMenu) => mapMenu.set(menuKey(m), m.tag))
    return mapMenu
  }


const ServiceTypes = () =>
    Array.from(new Set(
      mappedGroups()
      .map(g => g.serviceType.name))
    )
  

  const printDemoName = (name:string) => 
    name.includes("Britransformadores") ? "Segunda Empresa" :
    name


  return (
    <main className="p-8">
      <div className="flex justify-between">
        <div className="w-1/6">
					<RoughTitle title={"Órdenes"}/>
        </div>
        <div>
					{menuCount(ordersByWk(currentWorkspaceId)) > 0  &&
						<ReportButton
								wkId   = {currentWorkspaceId}
								date   = {parsed(today).valueOf()}
								orders = {ordersByWk(currentWorkspaceId)}
								groups = {parsedGroups()?.filter(g=>
														g.workspaceId === currentWorkspaceId)}
								menus  = {menus.filter(m => currentMenuType === 'ALL' ?
														true: m.type === currentMenuType )}
								serviceType = {currentServiceType}
						/>
					}
        </div>
      </div>
			<div className="flex flex-col sm:flex-row w-5/6 sm:mt-0">
				<div className="flex">
					<SingleDayFilter className="w-1/2 sm:w-auto"/>
					<ViewLayoutOrdersFilter className="ml-8 w-1/2"/>
				</div>
				<div className="flex ml-0 sm:ml-8 mt-1 sm:mt-0">
					<MenuTypesFilter menuTypes={MenuTypes} className="w-1/2 sm:w-auto"/>
					<ServiceTypeFilter serviceTypes={ServiceTypes()} className="w-1/2 ml-8"/>
				</div>
				<div className="flex ml-0 mt-1 sm:mt-0 sm:ml-8">
					<WorkspaceFilter workspaces={workspaces}/>
				</div>
      </div>
			{window.innerWidth < 640 && (<hr className="border border-crema-200 mt-4"/>)}
      <div key={currentWorkspaceId} className="mt-4 sm:mt-8">
        {orders && ordersByWk(currentWorkspaceId) && menus && (
          <div>
            <h3 className="my-2 text-lg sm:text-2xl font-bold">
              {wks().filter(wk => wk.id === currentWorkspaceId)[0]?.name}
            </h3>
          {orders && menuCount(ordersByWk(currentWorkspaceId)) > 0 ? (
              <h5 className="mt-0 sm:mt-2 text-normal sm:text-lg font-normal">
                <span className="font-bold">
                  {menuCount(ordersByWk(currentWorkspaceId))}
                </span> comidas.
              </h5>
          ) : (
						<h5 className="mt-0 sm:mt-2 text-normal sm:text-lg font-normal">
							Aún no has recibido pedidos.</h5>
					)
          }
            <ReportTable
              orders={ordersByWk(currentWorkspaceId)}
              parsedGroups={parsedGroups()?.filter(
                (g: IParsedGroup) => g.workspaceId === currentWorkspaceId,
              )}
              menus={menus.filter(m => m.menuDate.slice(0, 10) == dateForFilter(today).slice(0,10))}
              currentMenus={mapTheMenus(menus)} />
          </div>
        )}
      </div>
    </main>
  )
}

export default OrdersPage
