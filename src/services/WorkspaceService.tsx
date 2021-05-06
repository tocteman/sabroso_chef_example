import React from 'react'
import {atom} from 'jotai'
import type {IWorkspace} from '../models/WorkspaceTypes'
import {initialWorkspace} from '../models/WorkspaceTypes'

export const CurrentWorkspace = atom<string>("")
export const CurrentWorkspaceId = atom<string>("")
export const DisplayAddClientPanel = atom<boolean>(false)
export const DisplayClientPanel = atom<boolean>(false)

export const CurrentClient = atom<IWorkspace>(initialWorkspace)

export const printDemoName = (name:string) =>
		name?.includes("Santa") ? "Primera Empresa" :
		name.includes("Britransformadores") ? "Segunda Empresa" :
		name
