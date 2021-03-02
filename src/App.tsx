import React, {useEffect} from 'react'
import tw, { GlobalStyles } from 'twin.macro'
import OtherGlobalStyles from './general/OtherGlobalStyles'
import {BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MainRouter from './general/MainRouter'
import { Provider as JotaiProvider} from 'jotai'

interface AppProps {}

const App = ({}: AppProps) => {
  return (
    <JotaiProvider>
    <Router>
      <GlobalStyles />
      <OtherGlobalStyles/>
      <MainRouter/>
    </Router>
    </JotaiProvider>
  )
}
export default App
