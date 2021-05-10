import React, {useState, useEffect, useRef} from 'react'
import useSWR from 'swr'
import { useAtom } from 'jotai'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import type {IWorkspace} from '../models/WorkspaceTypes'
import type {IProposal} from '../models/ProposalTypes'
import {useLocalStorage} from '../utils/LocalStorageHook'
import {ClientsFiltersAtom, FilterEncodeString, ProposalsFiltersAtom} from '../services/FilterService'
import {PicksFilter} from '../utils/DateUtils'
import Loader from '../general/components/Loader'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import ClientPanel from "./components/ClientPanel"
import ClientsList from "./components/ClientsList"
import { CurrentClient, DisplayAddClientPanel, DisplayClientPanel} from "../services/WorkspaceService"
import RoughTitle from "../general/components/RoughTitle"
import {Transition} from '@headlessui/react'
import {PanelTransitionProps} from '../services/UiService'

const ClientsPage = () => {
	const [cu] = useLocalStorage('user', '')
	const [currentClients, setCurrentClients] = useAtom(ClientsFiltersAtom)
	const [currentProposals, setCurrentProposals] = useAtom(ProposalsFiltersAtom)
	const [currentClient, setCurrentClient] = useAtom(CurrentClient)
	const [addClientPanel, setAddClientPanel] = useAtom(DisplayAddClientPanel)
	const [displayPanel] = useAtom(DisplayClientPanel)
	const { data: workspaces, error: workspacesFetchError } = useSWR(
		['workspaces'],
		Fetcher,
	)
	const { data: proposals } = useSWR(
		['proposals', FilterEncodeString(currentClients)],
		FilteredFetcher,
	)
	const myRef = useRef("ClientPanelRef")
	useEffect(() => {
		setCurrentProposals([PicksFilter(cu.chefId, 'chefId', '=')])
	}, [])


	if (!workspaces || workspacesFetchError) return <Loader />
	if (!proposals) return <Loader />

	const filteredProposals = () => proposals.filter(p => p.chefId === cu.chefId)
	const filteredWorkspaces = () => {
		const proposedWks = filteredProposals().map(fp => fp.workspaceId)
		return workspaces.filter(w => proposedWks.includes(w.id))
	}

	return (
		<div className="flex">
			<div className="w-full sm:w-1/2 p-8">
				<div className="w-1/3">
					<RoughTitle title={"Clientes"}/>
				</div>
				<ClientsList workspaces={filteredWorkspaces()}
				proposals={filteredProposals()}/>
				<div className="pt-8">
					<div className="main-button w-64 md:w-48 mt-32 cursor-not-allowed opacity-50">Añadir Cliente</div>
				</div>
			</div>
				 <Transition
          show={displayPanel === true}
					 {...PanelTransitionProps}
				>
						<ClientPanel proposals={proposals}/>
				</Transition>

		</div>
	)
}

export default ClientsPage
