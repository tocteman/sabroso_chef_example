import React from 'react'
import { useAtom } from 'jotai'
import {CurrentClient, DisplayClientPanel} from "../../services/WorkspaceService"

const ClientsList = ({workspaces, proposals}) => {
	const [, setCurrentClient] = useAtom(CurrentClient)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayClientPanel)

	const showClient = client => {
		setCurrentClient(client)
		setDisplayPanel(true)
	}

	const printDemoName = (name:string) =>
		name.includes("Britransformadores") ? "Segunda Empresa" :
		name

	return (
		<div>
			{workspaces && proposals &&
			 workspaces
				 .filter((wk: IWorkspace) =>
					 proposals.some((pr: IProposal) => pr.workspaceId === wk.id))
				 .map((wk: IWorkspace) => (
					 <div key={wk.id}
						 className="main-list-item"
						 onClick={() => showClient(wk)}
					 >
						 <h2>
							 {printDemoName(wk.name)}
						 </h2>
					 </div>
			))}
		</div>
	)
}

export default ClientsList
