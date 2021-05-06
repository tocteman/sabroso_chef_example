import React from 'react'
import {useAtom} from 'jotai'
import {CurrentMenuType} from '../../../services/MenuService'
import SelectChevron from '../../../svgs/SelectChevron'

const MenuTypeFilter = ({menuTypes, className}) => {

  const [currentMenuType, setCurrentMenuType] = useAtom(CurrentMenuType)

	return (
		<div className={`flex flex-col ${className}`}>
			<label className="text-sm uppercase">Tipo de Menú</label>
			<div className="inline-block relative std-input">
				<select onChange={(e) => setCurrentMenuType(e.target.value)}
					className="uppercase std-input-inner"
					defaultValue={ currentMenuType === 'ALL' ?
												 "Todos" :
												 menuTypes.filter(mt => currentMenuType === mt.code)[0].code
					}
				>
					{menuTypes.map(mt => (
						<option value={mt.code} key={`option-${mt.code}`}>
							{mt.name}
						</option>
					))}
					<option value={"ALL"}>Todos</option>
				</select>
				<SelectChevron/>
			</div>

		</div>
	)
}

export default MenuTypeFilter
