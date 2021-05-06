import React from 'react'
import {useAtom} from 'jotai'
import { CurrentServiceType } from '../../../services/MenuService'
import SelectChevron from '../../../svgs/SelectChevron'

const ServiceTypeFilter = ({serviceTypes, className}) => {
	const [currentServiceType, setCurrentServiceType] = useAtom(CurrentServiceType)

	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-sm uppercase">Tipo de Servicio</label>
			<div className="inline-block relative std-input">
				<select onChange={(e) => setCurrentServiceType(e.target.value)}
					className="uppercase std-input-inner"
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
				<SelectChevron/>
			</div>

		</div>
	)
}

export default ServiceTypeFilter
