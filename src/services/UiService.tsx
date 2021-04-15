import React from 'react'
import {atom} from 'jotai'
import {initialToast, IToast} from '../models/UiTypes'

export const ToastState = atom<IToast>(initialToast)
