import React from 'react'
import axios from 'axios'
import {logout} from './AuthService'
import {useLocalStorage} from '../utils/LocalStorageHook'

import {useHistory, useLocation, Redirect, withRouter} from 'react-router'
const apiUrl = import.meta.env.SNOWPACK_PUBLIC_API_URL

const redirecter = () => {
  const history = useHistory()
  history.push('/login')
}

export const FilteredFetcher = (url: string, filterString:string) => {
  return InterceptedAxios()
    .get(`${url}?${filterString}`)
    .then(res => res.data)
    .catch(err => console.log(err)
  )
}

export const PosterPromise = (url: string, data) => 
   InterceptedAxios().put(`${apiUrl}/${url}`, data)

export const DeleterPromise = (url: string) => 
  InterceptedAxios().delete(`${apiUrl}/${url}`)

export const Fetcher = (url:string, history:any) => {
  return InterceptedAxios().get(url)
  .then(res => res.data)
  .catch(err => {
    if (err.response.status === 403) {
      window.localStorage.clear()
      window.location.replace('/login')
    }
  })
}

const logouter = (history: any) => {
  const historyHook = useHistory()
  const locationHook = useLocation()
  window?.location.replace('/login')
  localStorage.clear()
  location.replace('/login')
  historyHook.replace('/login')
}


export const InterceptedAxios = () => {
  const newAxios = axios.create({baseURL: `${apiUrl}`})
  newAxios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    error => {
      Promise.reject(error)
    })
  return newAxios
}

