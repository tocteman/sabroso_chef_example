import React from 'react'
import { useAtom } from 'jotai'
import { MenuTypes } from "../../services/MenuService"
import CloseIcon from '../../svgs/CloseIcon'
import {CurrentClient, DisplayClientPanel} from "../../services/WorkspaceService"
import {initialWorkspace} from '../../models/WorkspaceTypes'

const ClientPanel = ({ proposals}) => {

	const [currentClient, setCurrentClient] = useAtom(CurrentClient)
	const [displayPanel, setDisplayPanel] = useAtom(DisplayClientPanel)

	const printMenuTypeName = (code: string) =>
		MenuTypes.find(m => m.code === code)?.name

	const closePanel = () => {
		setDisplayPanel(false)
		setCurrentClient(initialWorkspace)
	}

	return (
		<div className="current-panel-bg">
			 <div >
				 <div className="flex items-center justify-between">
					 <div className="mt-8 text-2xl font-bold">
						 {currentClient.name}
					 </div>
					 <div className="w-6 cursor-pointer"
						 onClick={()=>closePanel()} >
						 <CloseIcon/>
					 </div>
				 </div>
					<hr className="my-2 border border-crema-200"/>
				</div>
				{ proposals.filter(p => p.workspaceId === currentClient.id).map(p => (
					<div key={`panel-${p.id}`} className="mt-4">
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
								<div key={`${currentClient.id}-${st}-${index}`}>
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
							{ p.menuTypes.map((mt, index) => (
								<div className="pr-4" key={`${mt.code}-${index}`}>
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
	)
}

export default ClientPanel
