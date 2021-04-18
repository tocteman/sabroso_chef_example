import React from 'react'
import {useAtom} from 'jotai'
import {SidebarState} from '../../services/UiService'
import Hamburger from '../../svgs/Hamburger'

const Topbar = () => {
  const [open, setOpen] = useAtom(SidebarState)
  return (
    <div className="flex flex-row-reverse w-full py-1 overflow-x-hidden text-white bg-red-500 md:py-2">
      <div className="flex items-center">
        <div className="block w-4 mx-4 text-white cursor-pointer sm:hidden hover:text-crema-125" onClick={() => setOpen(!open)}>
          <Hamburger/>

        </div>
        <div className="px-4 py-1 mr-6 text-lg font-bold bg-red-400 rounded-lg cursor-pointer md:py-2 hover:shadow-sm hover:bg-red-300"
          onClick={() => {
            localStorage.clear()
            window && window.location.replace('login')
          }}>
            Salir
          </div>

      </div>
    </div>
  )
}

export default Topbar
