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
import { RoughNotation, RoughNotationGroup } from "react-rough-notation"; //@ts-ignore
import Vianda from '../assets/images/vianda.svg' //@ts-ignore
import Plato from '../assets/images/catering.svg'

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

  const parsedServicesTypes = (proposal) => JSON.parse(proposal.servicesTypes)
  
  console.log(proposals)
  if (!workspaces || workspacesFetchError) return <Loader />
  if (!proposals) return <Loader />
  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <div className="w-1/3">
          <RoughNotation strokeWidth={2} type="underline" color={'#fc8e5f'} show={true} animationDuration={400} iterations={1}>
            <h2 className="text-3xl font-bold my-8">Clientes</h2>
          </RoughNotation>
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
                className="my-1 border-2 border-crema-300 bg-white hover:bg-white p-2 rounded hover:border-mostaza-300 max-w-sm cursor-pointer hover:shadow-sm text-lg"
                onClick={() => setCurrentClient(wk)}
              >
                <h2>
                  {wk.name === 'Santa Priscila / Profremar' ? 'Una Empresa' : wk.name === 'Los sabrositos' ? 'Universales' : wk.name}
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

          <div className="text-2xl font-bold mt-8">
                  {currentClient.name === 'Santa Priscila / Profremar' ? 'Una Empresa' : currentClient.name === 'Los sabrositos' ? 'Universales' : currentClient.name}
          </div>
            <hr className="border border-crema-200 my-2"/>
        </div>
          }
        {currentClient && proposals.filter(p => p.workspaceId === currentClient.id).map(p => (
        <div key={p.id} className="mt-4">
          { parsedServicesTypes(p).map((pst, index) => (
          <div key={pst.name} className="my-4 flex items-center text-xl divide-x divide-mostaza-200">
            {index === 0 && <div className="w-12 pr-2"><img src={Vianda}/></div>}
            {index === 1 && <div className="w-12 pr-2"><img src={Plato}/></div>}
              <div className="px-2 font-bold">
                  {pst.name}
              </div>
            <div className="px-2">${pst.price.toFixed(2)}</div>
            <div className="pl-2">{pst.maxOrderTime}</div>
            </div>)) }
            <div className="mt-32 text-2xl">[ ... ]</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsPage
