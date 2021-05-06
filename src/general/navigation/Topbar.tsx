import React from 'react'
import {useAtom} from 'jotai'
import {SidebarState} from '../../services/UiService'
import Hamburger from '../../svgs/Hamburger'
import LogoBlanco from '../../assets/images/sabroso_blanca.png'

const Topbar = () => {
  const [open, setOpen] = useAtom(SidebarState)
  return (
    <div className="flex justify-between w-full py-1 overflow-x-hidden text-white bg-gradient-to-b from-red-400 to-red-500 md:py-2">
			<div className="w-16 my-1 ml-8">
				{window.innerWidth < 640 && <img src={LogoBlanco}/> }
			</div>
      <div className="flex items-center">
          <div className="block w-4 mx-8 text-white cursor-pointer sm:hidden hover:text-crema-125 p-1"
               onClick={() => setOpen(!open)}>
          <Hamburger/>
        </div>
				{window?.innerWidth >= 640 && (
				<div className="px-4 py-1 mr-6 font-bold bg-red-400 rounded-lg cursor-pointer md:py-2 hover:shadow-sm hover:bg-red-300 text-sm"
          onClick={() => {
            localStorage.clear()
            window && window.location.replace('login')
          }}>
            Salir
          </div>
				)}
      </div>
    </div>
  )
}

export default Topbar
