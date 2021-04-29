import React, {useState, useEffect} from 'react'
import { Popover, Transition, Switch } from "@headlessui/react";
import { useAtom } from 'jotai'


const AddSchedulePopover = () => {
	const [enabled, setEnabled] = useState(true)
	const [scheduleName, setScheduleName] = useState("")
	const [startDate, setStartDate] = useState("")

	useEffect(() => {}, [])
	const addSchedule = () => {}

	return (
		<div className="bg-crema-200 p-6 border-2 border-mostaza-200 rounded shadow-sm mt-2">
			<div className="flex flex-col">
				<div className="">
					<label className="text-sm uppercase">
						Nombre
					</label>
					<input type="" name="" value=""
					className="meal-input"
					onChange={e => setScheduleName(e.target.value)}
					/>
				</div>
				<div className="mt-2 flex items-center">
					<div>
						<label className="text-sm uppercase">
							Fecha de Inicio
						</label>
						<input name="" type="date" value=""
						className="meal-input"
						onChange={e => setStartDate(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm uppercase">
							Activo
						</label>
						<Switch
							checked={enabled}
							onChange={setEnabled}
							className={`${enabled ? "bg-red-300" : "bg-red-500"}
						my-2 relative inline-flex items-center h-6 rounded-full w-11`}
						>
							<span
							className={`${
					enabled ? "translate-x-6" : "translate-x-1"
				} inline-block w-4 h-4 transform bg-white rounded-full`}
							/>
						</Switch>
					</div>

				</div>
			</div>
			<div className="flex flex-row-reverse">
				<button className="secondary-button"
					onClick={()=> addSchedule()}>
					Añadir
				</button>
			</div>
		</div>
	)
}

export default AddSchedulePopover
