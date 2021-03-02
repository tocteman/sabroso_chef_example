import React from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.SNOWPACK_PUBLIC_API_URL

export const loginRequest = (data: any) => {
  return axios.post(`${apiUrl}/auth/login`, data)
}


export const logout = () => {
  window && window.location.replace('login')
}

