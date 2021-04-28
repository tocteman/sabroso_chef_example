import React from 'react'
import {useAtom} from 'jotai'
import {Switch, Route, useRouteMatch, Link, useHistory} from 'react-router-dom'
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

const SchedulesPage = () => {
  let {path, url} = useRouteMatch()
  const history = useHistory()
	const {data: schedules, error: schErr} = useSWR(['schedules'], Fetcher)
  const [, setToastState] = useAtom(ToastState)
  const trimAddr = (addr: string) =>  /[\/]$/.exec(addr) ? addr.slice(0, -1) : addr

	if (!schedules || schErr) return <Loader/>

  const includesId: () => boolean = () =>
    ExampleData
    .map(e => e.id.toString())
    .some(id => id === history.location.pathname.slice(-1)[0])

	const addSchedule = () => {
		schedulePostPromise()
			.then(res =>{
				console.log({res})
				mutate(['schedules'], Fetcher)
				setToastState({status: "ok", message:"Has publicado un cronograma"})
			})
		.catch(err => console.log({err}))
	}


    return (
      <div className="flex flex-col p-8">
				<div className="flex justify-between pr-8">
					<div className="w-1/6">
						<RoughTitle title={"Cronogramas"} roughProps={{strokeWidth: 3}}/>
					</div>
					<div>
						<button className="secondary-button"
							onClick={()=> addSchedule()}
						>
							Añadir Cronograma
						</button>
					</div>
				</div>
        <Switch>
          <Route exact path={`${path}/:id`}>
            <CronogramaItem/>
          </Route>
        </Switch>
        <div className="w-2/3 my-4">
          {!includesId() && ExampleData.map(e =>
          <Link to={`${trimAddr(url)}/${e.id}`}
            key={`${e.id}`}>
            <CronogramaSummaryItem
              name={e.name}
              progress={e.progress}
            />
          </Link>
          )}
        </div>
      </div>
  )
}

export default SchedulesPage
