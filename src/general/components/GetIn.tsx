import React from 'react'
import { Transition } from '@headlessui/react'

  const GetIn = (props) =>
  <Transition
    show= {props.shouldEnter}
    enter="transition transform duration-500"
    enterFrom="translate-x-1/3"
    enterTo=""
  >
    {props.children}
  </Transition>

export default GetIn
