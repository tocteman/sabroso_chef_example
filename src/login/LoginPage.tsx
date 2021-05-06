import React from 'react'
import LoginForm from './components/LoginForm' //@ts-ignore
import Logo from '../assets/images/sabroso_chica.png'

const LoginPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-crema-100 font-sans">
      <div className="pb-8">
        <img src={Logo}/>
      </div>
      <div className="w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/4">
        <LoginForm/>
      </div>
    </main>
  )
}

export default LoginPage
