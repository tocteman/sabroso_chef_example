import React, {useState, useEffect} from 'react'
import { mutate } from 'swr'
import { Popover, Transition, Switch } from "@headlessui/react";
import { useAtom } from 'jotai'
import { CurrentSchedule, schedulePostPromise } from '../../services/ScheduleService';
import { initialSchedule } from '../../models/ScheduleTypes';
import { validateSchedule } from '../../services/ScheduleService';
import { Fetcher } from '../../services/Fetcher';
import { ToastState } from '../../services/UiService';
import { v4 as uuidv4 } from 'uuid';


const AddSchedulePopover = () => {
	const [currentSchedule, setCurrentSchedule] = useAtom(CurrentSchedule)
	const [enabled, setEnabled] = useState(true)
	const [, setToastState] = useAtom(ToastState)

	useEffect(() => {setCurrentSchedule(initialSchedule)}, [])

	const addSchedule = (schedule) => {
		const newSchedule = {
			...schedule,
			id: uuidv4(),
			status:	enabled === true ? "active" : "inactive"
		}
		const validation = validateSchedule(newSchedule)
		validation.ok === true ?
			 postSchedule(newSchedule) :
			 showPublishError(validation)
	}

	const setScheduleName = (name) =>
		setCurrentSchedule({...currentSchedule, name })

	const postSchedule = (schedule) =>
		schedulePostPromise(schedule)
			.then(()=> {
				mutate(['schedules'], Fetcher)
				setToastState({status: "ok", message: "Has publicado el cronograma"})
			})
			.catch(err => setToastState({status: "error", message: err}))

	const setStartDate = (startDate) =>
		setCurrentSchedule({...currentSchedule, startDate })

	const setScheduleActive = (status) => status === true ?
			setCurrentSchedule({...currentSchedule, status: "active"}) :
			setCurrentSchedule({...currentSchedule, status: "inactive"})

  const showPublishError = (validation) => setToastState({status: "error", message: validation.msg})

	return (
		<div className="bg-crema-200 p-6 border-2 border-mostaza-200 rounded shadow-sm mt-2">
			<div className="flex flex-col">
				<div className="">
					<label className="text-sm uppercase">
						Nombre
					</label>
					<input type="" name="" value={ currentSchedule.name || ""}
					className="meal-input"
					onChange={e => setScheduleName(e.target.value)}
					/>
				</div>
				<div className="mt-2 flex items-center">
					<div>
						<label className="text-sm uppercase">
							Fecha de Inicio
						</label>
						<input name="" type="date"
						value={currentSchedule.startDate || ""}
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
							onChange={()=> setEnabled(!enabled)}
							className={`${enabled ? "bg-red-500" : "bg-red-300"}
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
					onClick={()=> addSchedule(currentSchedule)}>
					Añadir
				</button>
			</div>
		</div>
	)
}

export default AddSchedulePopover
