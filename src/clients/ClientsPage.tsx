import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import type {IWorkspace} from '../models/WorkspaceTypes'
import type {IProposal} from '../models/ProposalTypes'
import {useLocalStorage} from '../utils/LocalStorageHook'
import {clientsFiltersAtom, FilterEncodeString, proposalsFiltersAtom} from '../services/FilterService'
import {PicksFilter} from '../utils/DateUtils'
import Loader from '../general/components/Loader'
import { MenuTypes } from "../services/MenuService"
import RoughTitle from "../general/components/RoughTitle"

const ClientsPage = () => {
  const [cu] = useLocalStorage('user', '')
  const [currentClients, setCurrentClients] = useAtom(clientsFiltersAtom)
  const [currentProposals, setCurrentProposals] = useAtom(proposalsFiltersAtom)
  const { data: workspaces, error: workspacesFetchError } = useSWR(
    ['workspaces'],
    Fetcher,
  )
  const { data: proposals } = useSWR(
    ['proposals', FilterEncodeString(currentClients)],
    FilteredFetcher,
  )
  const [currentClient, setCurrentClient] = useState(null)
  useEffect(() => {
    setCurrentProposals([PicksFilter(cu.chefId, 'chefId', '=')])
  }, [])

  const printMenuTypeName = (code: string) => MenuTypes.find(m => m.code === code)?.name
  
  const printDemoName = (name:string) => 
    name?.includes("Santa") ? "Primera Empresa" : 
    name.includes("Britransformadores") ? "Segunda Empresa" :
    name
 
  if (!workspaces || workspacesFetchError) return <Loader />
  if (!proposals) return <Loader />
  
  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <div className="w-1/3">
					<RoughTitle title={"Clientes"}/>
        </div>
        {workspaces &&
          proposals &&
          workspaces
            .filter((wk: IWorkspace) =>
              proposals.some((pr: IProposal) => pr.workspaceId === wk.id),
            )
            .map((wk: IWorkspace) => (
              <div
                key={wk.id}
                className="max-w-sm p-2 my-1 text-lg bg-white border-2 rounded cursor-pointer border-crema-300 hover:bg-white hover:border-mostaza-300 hover:shadow-sm"
                onClick={() => setCurrentClient(wk)}
              >
                <h2>
                  {printDemoName(wk.name)}
                 </h2>
              </div>
            ))}
      </div>
        <div className={`
            w-1/2 p-8 ml-8 
            ${currentClient &&`min-h-screen pr-8 bg-white border-l-2 border-mostaza-300`}
          `}
      >
        {currentClient && <div>
          <div className="mt-8 text-2xl font-bold">
                  {printDemoName(currentClient.name)}
          </div>
            <hr className="my-2 border border-crema-200"/>
        </div>
          }
        {currentClient && proposals.filter(p => p.workspaceId === currentClient.id).map(p => (
        <div key={p.id} className="mt-4">
          <div className="text-xl font-bold leading-none text-mostaza-500">
            precio base
          </div>
          <div className="text-2xl font-bold leading-tight">
            ${p.basePrice.toFixed(2)}
          </div>
          <hr className="py-1 mt-2 border-crema-200"/>
          <div className="text-xl font-bold text-mostaza-500">tipos de servicios</div>
          <div className="flex">
            { p.servicesTypes.map((st, index) => (
              <div>
                <div className="text-sm tracking-wider uppercase">
                  {st.name}
                </div>
                <div className="text-2xl font-bold leading-none">
                  ${st.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <hr className="py-1 mt-2 border-crema-200"/>
          <div className="text-xl font-bold text-mostaza-500">
            tipos de menús
          </div>
          <div className="flex">
          { p.menuTypes.map(mt => (
            <div className="pr-4">
              <div className="text-sm tracking-wider text-gray-700 uppercase">
                {printMenuTypeName(mt.name)}
              </div>
              <div className="text-2xl font-bold leading-none">
                ${mt.price.toFixed(2)}
              </div>
            </div>
          )) }
          </div>
            <div className="mt-32">( ... agregar kpis )</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsPage

