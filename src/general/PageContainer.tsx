import React from 'react'
import InnerPageRouter from './InnerPageRouter'
import NavigationSidebar from './navigation/NavigationSidebar'

const PageContainer = () => {
  return (
    <div className="bg-crema-100 min-h-screen flex font-sans">
      <aside className="bg-crema-200 w-1/6 border-r-2 border-mostaza-300">
        <NavigationSidebar/>
      </aside>
        <main className="w-5/6">
        <div className="py-4 bg-red-500 w-full overflow-x-hidden"></div>
        <InnerPageRouter/>
      </main>
    </div>
  )
}

export default PageContainer
