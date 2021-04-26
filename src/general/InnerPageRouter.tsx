import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import OrdersPage from '../orders/OrdersPage';
import MenusPage from '../menus/MenusPage'
import MealsPage from '../meals/MealsPage'
import ClientsPage from '../clients/ClientsPage';
import SchedulesPage from '../schedules/SchedulesPage'

const InnerPageRouter = () => {
  return (
    <Switch>
      <Route path='/orders'>
        <OrdersPage/>
      </Route>
      <Route path='/menus'>
        <MenusPage/>
      </Route>
      <Route path='/meals'>
        <MealsPage/>
      </Route>
      <Route path='/clients'>
        <ClientsPage/>
      </Route>
      <Route path='/schedules'>
        <SchedulesPage/>
      </Route>
      <Route path='/'>
        <OrdersPage/>
      </Route>
    </Switch>
  )
}

export default InnerPageRouter
