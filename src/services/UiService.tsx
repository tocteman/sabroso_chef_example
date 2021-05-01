import React from 'react'
import {atom} from 'jotai'
import {initialToast, IToast} from '../models/UiTypes'

export const Loading = atom<boolean>(false)
export const ToastState = atom<IToast>(initialToast)
export const SidebarState =atom<boolean>(false)
