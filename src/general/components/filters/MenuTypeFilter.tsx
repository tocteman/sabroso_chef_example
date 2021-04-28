import React from 'react'
import {useAtom} from 'jotai'
import {CurrentMenuType} from '../../../services/MenuService'

const MenuTypeFilter = ({menuTypes}) => {

  const [currentMenuType, setCurrentMenuType] = useAtom(CurrentMenuType)

	return (
		<div className="flex flex-col ml-8">
			<label className="text-sm uppercase">Tipo de Menú</label>
			<select onChange={(e) => setCurrentMenuType(e.target.value)}
				className="uppercase std-input"
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
		</div>
	)
}

export default MenuTypeFilter
