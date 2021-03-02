import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginPage from '../login/LoginPage'
import PageContainer from './PageContainer'



const MainRouter = () => {
  return (
  <Switch>
    <Route path="/login">
      <LoginPage/>
    </Route>
    <Route path="/">
      <PageContainer/>
    </Route>
  </Switch>
  )
}

export default MainRouter
