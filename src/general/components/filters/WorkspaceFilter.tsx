import React from 'react'
import {useAtom} from 'jotai'
import {printDemoName, CurrentWorkspaceId} from '../../../services/WorkspaceService'
import SelectChevron from '../../../svgs/SelectChevron'

const WorkspaceFilter = ({workspaces, className}) => {
	const [currentWorkspaceId, setCurrentWorkspaceId] = useAtom(CurrentWorkspaceId)
	const wks = () => workspaces.map(w => ({...w, name: printDemoName(w.name)}))

	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-sm uppercase">Clientes</label>
			<div className="inline-block relative std-input">
				<select onChange={(e) => setCurrentWorkspaceId(e.target.value)}
					className="uppercase std-input-inner"
					value={currentWorkspaceId}
				>
					<option value={""}>-</option>
					{wks().map(wk => (
						<option key={`workspace-${wk.id}`} value={wk.id}>
							{wk.name}
						</option>
					))}
				</select>
				<SelectChevron/>
			</div>

		</div>

	)
}

export default WorkspaceFilter
