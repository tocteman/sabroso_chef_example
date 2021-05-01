import React from 'react'
import {useAtom} from 'jotai'
import { mutate } from 'swr'
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import TrashIcon from '../../svgs/TrashIcon'
import { ToastState } from '../../services/UiService'
import { DeleterPromise, Fetcher } from '../../services/Fetcher';
import { Link, useRouteMatch } from 'react-router-dom'
import ChevronRight from '../../svgs/ChevronRight'

const CronogramaSummaryItem = ({schedule}) => {
	let {path, url} = useRouteMatch()

  const [, setToastState] = useAtom(ToastState)

	const progressPercentage = () => schedule.progress.toString() + "%"

  const trimAddr = (addr: string) =>  /[\/]$/.exec(addr) ? addr.slice(0, -1) : addr

	const deleteSchedule = (schedule) => {
		if (!confirm("¿Deseas eliminar este cronograma?")) {return false}
		DeleterPromise(`schedules/${schedule.id}`)
			.then(()=> {
				mutate(['schedules'], Fetcher)
        setToastState({status: 'ok', message: "Has eliminado el cronograma."})
			})
			.catch(err => setToastState({status: "error", message: err}))
	}

  return (
    <div className="px-8 pt-6 pb-4 my-4 border-8 rounded-lg border-crema-200 bg-gradient-to-b from-crema-50 to-crema-100 hover:bg-white shadow-sm">
			<div className="flex justify-between">

			<Link to={`${trimAddr(url)}/${schedule.id}`} key={`${schedule.id}`}>
				<div className="text-2xl font-bold hover:bg-crema-200 p-1">
					{schedule.name}
				</div>
			</Link>
				<div className="w-6 cursor-pointer"
						 onClick={()=> deleteSchedule(schedule)}>
					<TrashIcon/>
				</div>
			</div>
      <div className={`pt-1 rounded-lg px-1`}
				style={{width: progressPercentage()}}
			>
				<RoughNotation strokeWidth={2} type="underline" color={'#ff3331'} show={true} animationDuration={400} iterations={1}>
						<div className="text-sm">{schedule.progress}%</div>
				</RoughNotation>
			</div>
				<div className="flex flex-row-reverse">
					<Link to={`${trimAddr(url)}/${schedule.id}`} key={`${schedule.id}`}
						className="mt-2 w-8 h-8 p-2 hover:bg-crema-200 rounded-full">
						<ChevronRight/>
					</Link>
				</div>
    </div>
  )
}

export default CronogramaSummaryItem
