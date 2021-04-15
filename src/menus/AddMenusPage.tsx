import React from 'react'
import {
  Switch,
  Route,
  useRouteMatch,
  Link, 
  useHistory
} from 'react-router-dom'
import ExampleData from './components/ExampleData'
import CronogramaSummaryItem from './components/CronogramaSummaryItem'
import CronogramaItem from './components/CronogramaItem'
import { Transition } from '@headlessui/react'


const AddMenusPage = () => {
  let {path, url} = useRouteMatch() 
  const history = useHistory()
  const trimAddr = (addr: string) =>  /[\/]$/.exec(addr) ? addr.slice(0, -1) : addr

  const includesId: () => boolean = () => 
    ExampleData
    .map(e => e.id.toString())
    .some(id => id === history.location.pathname.slice(-1)[0])

  const GetIn = (props) => 
  <Transition
    show= {props.shouldEnter}
    enter="transition transform duration-500"
    enterFrom="translate-x-1/3"
    enterTo=""
  >
    {props.children}
  </Transition>

    return (
      <div className="flex flex-col p-8">
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

export default AddMenusPage
