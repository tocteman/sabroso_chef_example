import React from 'react'
import {atom} from 'jotai'
import {initialToast, IToast} from '../models/UiTypes'

export const Loading = atom<boolean>(false)
export const ToastState = atom<IToast>(initialToast)
export const SidebarState =atom<boolean>(false)

export const PanelTransitionProps = {
	enter: "transition transform ease-linear duration-200",
	enterFrom: "translate-x-1/3 opacity-50",
	enterTo: "opacity-100",
	leave: "transition transform ease-linear duration-100",
	leaveFrom: "opacity-100",
	leaveTo: " translate-x-1/3 opacity-50",
	className:"block w-full absolute z-20 sm:relative sm:w-1/2"
}
export const PopoverTransitionProps = {
	enter:"transition ease-out duration-200",
	enterFrom:"opacity-0 translate-y-1",
	enterTo:"opacity-100 translate-y-0",
	leave:"transition ease-in duration-150",
	leaveFrom:"opacity-100 translate-y-0",
	leaveTo:"opacity-0 translate-y-1",
}
