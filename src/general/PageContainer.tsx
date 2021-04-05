import React from 'react'
import InnerPageRouter from './InnerPageRouter'
import NavigationSidebar from './navigation/NavigationSidebar'
import Topbar from './navigation/Topbar'

const PageContainer = () => {
  return (
    <div className="flex min-h-screen font-sans bg-crema-100">
      <aside className="w-1/6 border-r-2 bg-crema-150 border-mostaza-300">
        <NavigationSidebar/>
      </aside>
      <main className="w-5/6 overflow-x-hidden">
          <Topbar/>
          <InnerPageRouter/>
      </main>
    </div>
  )
}

export default PageContainer
