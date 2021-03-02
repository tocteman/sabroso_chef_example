import React from 'react'
import 'twin.macro'
import LoginForm from './components/LoginForm' //@ts-ignore
import Logo from '../assets/images/sabroso_chica.png'

const LoginPage = () => {
  return (
    <main tw="flex flex-col items-center justify-center min-h-screen bg-crema-100 font-sans">
      <div tw="pb-8">
        <img src={Logo}/>
      </div>
      <div tw="w-1/4">
        <LoginForm/>
      </div>
    </main>
  )
}

export default LoginPage
