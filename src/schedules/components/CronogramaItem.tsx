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
import { FilterEncodeString, singleScheduleFiltersAtom, SimpleFilter } from '../../services/FilterService'
import { FilteredFetcher, Fetcher } from '../../services/Fetcher'
import Loader from '../../general/components/Loader'
import { CurrentWeek, weekPostPromise } from '../../services/ScheduleService'
import { initialScheduleWeek } from '../../models/ScheduleTypes'
import { v4 as uuidv4 } from 'uuid';
import { Loading, ToastState } from '../../services/UiService';
import RoughTitle from "../../general/components/RoughTitle"
import { Transition } from '@headlessui/react'

const initialWeeks =  {
   1: {number: 1, status: "inactive"},
   2: {number: 2, status: "inactive"}, 
   3: {number: 3, status: "inactive"},
   4: {number: 4, status: "inactive"}
}

const CronogramaItem = () => {
	const [currentScheduleFilters, setCurrentScheduleFilters] = useAtom(singleScheduleFiltersAtom)
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
		const newWeek ={
			id: uuidv4(),
			weekPosition: weeks ? weeks.length + 1 : 1,
			scheduleId: schedule.id
		}
		weekPostPromise(newWeek)
			.then(() =>
				mutate([`schedule_weeks`, FilterEncodeString(currentScheduleFilters)])
			)
		.catch(err => setToastState({status: "error", message: err}))
	}

	const menusPerWeek = (weekId) =>
		menus?.filter(m => m.scheduleWeekId === weekId) || []



  return (
    <div className="flex">
			<div className="w-1/2 p-8">
				<div className="w-1/3">
					<div className="flex cursor-pointer bg-crema-100 hover:bg-crema-200 hover:underline items-center"
						onClick={()=> history.push("/schedules")}
					>
						<div className="w-4">
							<ChevronLeft />
						</div>
						<div className="font-bold text-xl">
							Cronogramas
						</div>
					</div>
				</div>
				<div className="flex flex-col my-4">
					<div className="flex items-center justify-between mx-2">
					<div className="w-48">
						<RoughTitle title={schedule?.name} strokeWidth={3}/>
					</div>
						<div>
						<button className="secondary-button"
							onClick={() => addWeek(schedule)}>
							Añadir Semana
						</button>
					</div>
					</div>
					<div className="flex flex-col rounded border-crema-200">
						{loading === true && <Loader/>}
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
			<div className="min-h-screen w-1/2">
			{ meals &&
			 <Transition
          show={ displayPanel?.display === true }
          enter="transition transform duration-500"
          enterFrom="translate-x-1/3"
          enterTo=""
					className="w-full"
				>
					<MenuPanel meals={meals}/>
			 </Transition>
			}

			</div>
		</div>
	)

}

export default CronogramaItem
