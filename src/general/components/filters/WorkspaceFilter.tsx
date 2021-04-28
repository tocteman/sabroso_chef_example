import React from 'react'
import {useAtom} from 'jotai'
import {printDemoName, CurrentWorkspace} from '../../../services/WorkspaceService'

const WorkspaceFilter = ({workspaces}) => {
	const [currentWorkspace, setCurrentWorkspace] = useAtom(CurrentWorkspace)
	const wks = () => workspaces.map(w => ({...w, name: printDemoName(w.name)}))

	return (
		<div className="flex flex-col ml-8">
			<label className="text-sm uppercase">Clientes</label>
			<select onChange={(e) => setCurrentWorkspace(e.target.value)}
				className="uppercase std-input"
				value={currentWorkspace}
			>
				<option value={""}>-</option>
				{wks().map(wk => (
						<option key={`workspace-${wk.id}`} value={wk.id}>
							{wk.name}
						</option>
				))}
				<option value={"ALL"}>Todos</option>
			</select>
		</div>

	)
}

export default WorkspaceFilter
