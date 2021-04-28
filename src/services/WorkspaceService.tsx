import React from 'react'
import {atom} from 'jotai'

export const CurrentWorkspace = atom<string>("")

export const printDemoName = (name:string) =>
		name?.includes("Santa") ? "Primera Empresa" :
		name.includes("Britransformadores") ? "Segunda Empresa" :
		name
