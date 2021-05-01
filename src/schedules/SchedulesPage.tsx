import React, {Fragment} from 'react'
import {useAtom} from 'jotai'
import {Switch, Route, useRouteMatch,  useHistory, useLocation} from 'react-router-dom'
import ExampleData from './components/ExampleData'
import CronogramaSummaryItem from './components/CronogramaSummaryItem'
import CronogramaItem from './components/CronogramaItem'
import RoughTitle from '../general/components/RoughTitle'
import useSWR, {mutate} from 'swr'
import { mealsFiltersAtom, FilterEncodeString } from '../services/FilterService'
import Loader from '../general/components/Loader'
import {FilteredFetcher, Fetcher} from '../services/Fetcher'
import {schedulePostPromise} from '../services/ScheduleService'
import { ToastState } from '../services/UiService'
import AddSchedulePopover from './components/AddSchedulePopover'
import { Popover, Transition } from "@headlessui/react";
import GenGetIn from '../general/components/GenGetIn'
import ChevronDown from '../svgs/ChevronDown'

const SchedulesPage = () => {
  let {path, url} = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
	const {data: schedules, error: schErr} = useSWR(['schedules'], Fetcher)
  const [, setToastState] = useAtom(ToastState)

	if (!schedules || schErr) return <Loader/>

  const includesId: () => boolean = () =>
    ExampleData
    .map(e => e.id.toString())
    .some(id => id === history.location.pathname.slice(-1)[0])

	const parsedSchedules = () => schedules
	.map(s => ({...s, progress: Math.floor(100 * Math.random())}))

	const checkLocation = () =>
		history.location.pathname.match(/schedules[\/]?$/) ? true : false

	console.log({schedules})

    return (
      <div className="flex flex-col">
				{
					checkLocation() === true &&
					<>
					<div className="flex w-2/3 pr-8 items-center p-8 justify-between">
						<div className="w-1/3 ml-3">
							<RoughTitle title={"Cronogramas"} roughProps={{strokeWidth: 3}}/>
						</div>
						<div className="ml-24">
							<Popover className="relative">
								{({open}) => (
									<>
										<Popover.Button className={`${!open ? `secondary-button` : `blank-button` }`}
										>
											{open && <>Nuevo Cronograma</>}
											{!open &&
											 <div className="flex items-center">
												 Añadir Cronograma
												 <div className="-mt-1 ml-1 w-2 h-2"><ChevronDown/></div>
											 </div>}
										</Popover.Button>
										<Transition
											show={open}
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="opacity-0 translate-y-1"
											enterTo="opacity-100 translate-y-0"
											leave="transition ease-in duration-150"
											leaveFrom="opacity-100 translate-y-0"
											leaveTo="opacity-0 translate-y-1"
										>
											<Popover.Panel className="absolute z-10">
												<AddSchedulePopover/>
											</Popover.Panel>
										</Transition>
									</>
								)}

							</Popover>
						</div>
					</div>
					<div className="w-2/3 my-4 px-8">
						{!includesId() && parsedSchedules().map(s =>
							<CronogramaSummaryItem schedule={s} key={s.id} />
						)}
					</div>
			</>
				}
        <Switch>
          <Route exact path={`${path}/:id`}>
            <CronogramaItem/>
          </Route>
        </Switch>
      </div>
  )
}

export default SchedulesPage
