import React, { useEffect, useState} from 'react'
import {useAtom} from 'jotai'
import useSWR, {mutate} from 'swr'
import {useParams, useHistory} from 'react-router-dom'
import ChevronLeft from '../../svgs/ChevronLeft'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import ExampleData from './ExampleData'
import CronogramaWeeklyColumn from './CronogramaWeeklyColumn'
import {DisplayScheduledMenuPanel, DisplayMenuPanel} from '../../services/MenuService'
import MenuPanel from '../../menus/components/MenuPanel'
import { FilterEncodeString, SingleScheduleFiltersAtom, SimpleFilter } from '../../services/FilterService'
import { FilteredFetcher, Fetcher } from '../../services/Fetcher'
import Loader from '../../general/components/Loader'
import { CurrentWeek, weekPostPromise } from '../../services/ScheduleService'
import { initialScheduleWeek } from '../../models/ScheduleTypes'
import { v4 as uuidv4 } from 'uuid';
import { Loading, ToastState } from '../../services/UiService';
import RoughTitle from "../../general/components/RoughTitle"
import { Transition } from '@headlessui/react'
import {PanelTransitionProps} from '../../services/UiService'

const initialWeeks =  {
   1: {number: 1, status: "inactive"},
   2: {number: 2, status: "inactive"}, 
   3: {number: 3, status: "inactive"},
   4: {number: 4, status: "inactive"}
}

const CronogramaItem = () => {
	const [currentScheduleFilters, setCurrentScheduleFilters] = useAtom(SingleScheduleFiltersAtom)
  let {id} = useParams()
	const {data: schedule, error: schErr} = useSWR([`schedules/${id}`], Fetcher )
	const {data: weeks, error: weekErr} = useSWR(
		FilterEncodeString(currentScheduleFilters) !== "" ?
		[`schedule_weeks`, FilterEncodeString(currentScheduleFilters)] : null, FilteredFetcher
	)
	const {data: menus, error: menusErr} = useSWR(['schedule_menus'], Fetcher)
	const {data: meals, error: mealsErr} = useSWR(['meals'], Fetcher)
	const [currentWeek, setCurrentWeek] = useAtom(CurrentWeek)
	const [loading] = useAtom(Loading)
	const [displayPanel] = useAtom(DisplayMenuPanel)
	const [, setToastState] = useAtom(ToastState)
	const [addingWeek, setAddingWeek] = useState(false)

  const history = useHistory()
  const isHere = () => history.location.pathname.split("/").slice(-1)[0] === id
	useEffect(()=> {
		setCurrentScheduleFilters([SimpleFilter(id, "scheduleId", "=")])
		setCurrentWeek(initialScheduleWeek)
	},[])

	if (!schedule) <Loader/>
	if (!weeks || weekErr) <Loader/>
	if (!menus || menusErr) <Loader/>
	if (!meals || mealsErr) <Loader/>


	const addWeek = (schedule) => {
		if (weeks?.length > 4 && !confirm("¿Añadir nueva semana?")) {return}
		setAddingWeek(true)
		const newWeek ={
			id: uuidv4(),
			weekPosition: weeks ? weeks.length + 1 : 1,
			scheduleId: schedule.id
		}
		weekPostPromise(newWeek)
			.then(() =>{
				setAddingWeek(false)
				mutate([`schedule_weeks`, FilterEncodeString(currentScheduleFilters)])
			})
			.catch(err => {
				setAddingWeek(false)
				setToastState({status: "error", message: err})
			})
	}

	const menusPerWeek = (weekId) =>
		menus?.filter(m => m.scheduleWeekId === weekId) || []


  return (
		<div className="flex">
			<div className="w-full sm:w-1/2 p-8">
				<div className="w-3/5">
					<div className="flex cursor-pointer bg-crema-100 hover:bg-crema-200 hover:underline items-center sm:items-center"
						onClick={()=> history.push("/schedules")}
					>
						<div className="w-4">
							<ChevronLeft />
						</div>
						<div className="font-bold text-lg sm:text-xl">
							Cronogramas
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between">
						<div className="w-1/3">
							<RoughTitle title={schedule?.name} strokeWidth={3}/>
						</div>
						<div className="-mt-2 sm:mt-0">
							<button className=" secondary-button"
								onClick={() => addWeek(schedule)}>
								Añadir Semana
							</button>
						</div>
					</div>
					<div className="flex flex-col rounded border-crema-200">
						{loading === true && <Loader/>}
						{addingWeek === true && <Loader/>}
						{loading === false && weeks && weeks.map(w=> (
							<div key={`key-${w.id}`}
								onClick={() => setCurrentWeek(w)}>
								<CronogramaWeeklyColumn
									menusPerWeek = {menusPerWeek(w.id)}
									weekPosition={w.weekPosition}
								/>
							</div>
						))}
					</div>

				</div>
			</div>
			<Transition
				show={ displayPanel?.display === true }
				{...PanelTransitionProps}
			>
				<MenuPanel meals={meals}/>
			</Transition>
		</div>
	)

}

export default CronogramaItem
