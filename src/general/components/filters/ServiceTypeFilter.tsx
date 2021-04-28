import React from 'react'
import {useAtom} from 'jotai'
import { CurrentServiceType } from '../../../services/MenuService'


const ServiceTypeFilter = ({serviceTypes}) => {
  const [currentServiceType, setCurrentServiceType] = useAtom(CurrentServiceType)

	return (
		<div className="flex flex-col ml-8">
			<label className="text-sm uppercase">Tipo de Servicio</label>
			<select onChange={(e) => setCurrentServiceType(e.target.value)}
				className="uppercase std-input"
				defaultValue={
				currentServiceType === 'ALL' ? "Todos" :
				serviceTypes.filter(st => currentServiceType === st)[0]
				}
			>
				{serviceTypes.map(st => (
					<option key={`st-${st}`} value={st}>
						{st}
					</option>
				))}
				<option value={"ALL"}>Todos</option>
			</select>
		</div>
	)
}

export default ServiceTypeFilter
