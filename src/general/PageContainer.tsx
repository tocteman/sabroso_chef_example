import React, {useState} from 'react'
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
  return (
    <div className="flex min-h-screen font-sans bg-crema-100">
      {toastState.status !== "hidden" &&<div className="absolute flex items-center justify-center w-full min-h-screen">
         <div className="z-10 mx-8 my-8">
          <Toast/>
        </div>
      </div>
      }
        <aside className={`${!open ? `block` : `hidden`} min-h-screen z-10 absolute border-r-2 sm:block sm:h-auto sm:relative sm:w-1/6 bg-crema-150 border-mostaza-300`}>
        <NavigationSidebar/>
      </aside>
      <main className="w-full overflow-x-hidden sm:w-5/6">
          <Topbar/>
          <InnerPageRouter/>
      </main>
    </div>
  )
}

export default PageContainer
