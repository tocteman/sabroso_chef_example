import React from 'react'
import tw from 'twin.macro'
import InnerPageRouter from './InnerPageRouter'
import NavigationSidebar from './navigation/NavigationSidebar'

const PageContainer = () => {
  return (
    <div tw="bg-crema-100 min-h-screen flex font-sans">
      <aside tw="bg-crema-200 w-1/6 border-r-2 border-mostaza-300">
        <NavigationSidebar/>
      </aside>
        <main tw="w-5/6">
        <div tw="py-4 bg-red-500 w-full"></div>
        <InnerPageRouter/>
      </main>
    </div>
  )
}

export default PageContainer
