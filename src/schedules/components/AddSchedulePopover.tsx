import React, {useState} from 'react'
import { Popover, Transition, Switch } from "@headlessui/react";
import { useAtom } from 'jotai'


const AddSchedulePopover = () => {
	const [enabled, setEnabled] = useState(true)

	const addSchedule = () => {}

	return (
		<div>
			<div>
				{/* NOMBRE */}
				<label></label>
				<input type="" name="" value="" />
				{/* START DATE  */}
				<label></label>
				<input name="" type="text" value=""/>
				{/* ACTIVE TOGGLE */}
				<Switch
					checked={enabled}
					onChange={setEnabled}
					className={`${enabled ? "bg-teal-900" : "bg-teal-700"}
					relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
				>
				</Switch>
			</div>
			<div>
				<button className="secondary-button"
								onClick={()=> addSchedule()}>
					Añadir Cronograma
				</button>
			</div>





		</div>
	)
}

export default AddSchedulePopover
