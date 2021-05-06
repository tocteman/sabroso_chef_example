import React, {useState, useEffect, Fragment} from 'react'
import Toast from './components/Toast'
import InnerPageRouter from './InnerPageRouter'
import NavigationSidebar from './navigation/NavigationSidebar'
import Topbar from './navigation/Topbar'
import {useAtom} from 'jotai'
import { SidebarState, ToastState } from '../services/UiService'
import { Transition } from '@headlessui/react'

const PageContainer = () => {
  const [toastState] = useAtom(ToastState)
  const [open, setOpen] = useAtom(SidebarState)


	useEffect(() => {
		window.innerWidth >= 640 && setOpen(true)
	}, [])

  return (
    <div className="flex min-h-screen font-sans bg-crema-100">
      {toastState.status !== "hidden" &&<div className="absolute flex items-center justify-center w-full min-h-screen">
         <div className="z-30 mx-8 my-8">
          <Toast/>
        </div>
      </div>
      }
			 <Transition
				 as={Fragment}
				 show={ open }
				 enter="transition transform ease-linear duration-75"
				 enterFrom="-translate-x-1/3 opacity-50"
				 enterTo="opacity-100"
				 leave="transition transform ease-linear duration-100"
				 leaveFrom="opacity-100"
				 leaveTo="opacity-50 -translate-x-1/3"
				>
				 <aside className={`block min-h-screen z-50  absolute border-r-2 sm:block sm:h-auto sm:relative sm:w-1/6 bg-crema-150 border-mostaza-300`}>

					 <NavigationSidebar/>
				 </aside>
			 </Transition>

      <main className="w-full overflow-x-hidden sm:w-5/6">
          <Topbar/>
          <InnerPageRouter/>
      </main>
    </div>
  )
}

export default PageContainer
