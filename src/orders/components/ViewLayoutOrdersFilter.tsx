import React from 'react'
import {useAtom} from 'jotai'
import {ViewAtom} from '../../services/OrderService'
import {Listbox} from '@headlessui/react'
import SelectChevron from '../../svgs/SelectChevron'

const ViewLayoutOrdersFilter = ({className}) => {
	const [, setView] = useAtom(ViewAtom)
	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-sm uppercase">presentación</label>
			<div className="inline-block relative std-input">
			<select onChange={(e) => setView(e.target.value) }
				className="uppercase std-input-inner">
				<option value="cocina" >
					COCINA
				</option>
				<option value="reparto" onSelect={() => setView('r')}>
					REPARTO
				</option>
			</select>
			<SelectChevron/>
			</div>
		</div>
	)
}

export default ViewLayoutOrdersFilter
