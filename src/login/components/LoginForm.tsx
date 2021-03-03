import React from 'react'
import {
  Formik,
  Form,
  Field,
} from "formik";
import { loginRequest } from '../../services/AuthService'
import {Link, useHistory} from 'react-router-dom'
import {useAtom} from 'jotai'
import {currentUserAtom} from '../../services/CurrentUser'
// import {useLocalStorageState} from 'ahooks'
import {useLocalStorage} from '../../utils/LocalStorageHook'

const LoginForm = () => {
  const [loginError, setLoginError] = React.useState(false)
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  const history = useHistory()
  const [token, setToken] = useLocalStorage('accessToken', '')
  const [user, setUser] = useLocalStorage('user', '')
  const initialValues = { 
    email: "",
    password: ""
  };
  return  (
    <Formik
        initialValues = {initialValues}
        onSubmit={(values, actions) => {
          loginRequest({email: values.email, password: values.password})
          .then((res:any) => {
            // localStorage.setItem('accessToken', res.data.token)
            // localStorage.setItem('user', res.data.collaborator)
            // set('user', res.data.collaborator)
            setToken(res.data.token)
            setUser(res.data.collaborator)
            // setCurrentUser(res.data.collaborator) 
            history.push('')
          })
          .catch((err:any)=> {
            setLoginError(true)
            console.log(err)
          })
          actions.setSubmitting(false);
        }}
      >
        <Form className="flex flex-col text-black mt-6 w-full">
           <label
            htmlFor="email"
            className="mt-2 text-gray-900"
            >
             Correo
            </label>
           <Field
            id="email"
            name="email"
            placeholder="Email"
            className="bg-crema-200 focus:bg-crema-100 border-2 border-mostaza-300 rounded-lg shadow my-1 p-2 font-bold text-lg"
            type="email"
            />
           <label
            htmlFor="password"
            className="mt-2 text-gray-900"
            >
             Contraseña
            </label>
           <Field
            id="password"
            name="password"
            placeholder="8 caracteres"
            className="bg-crema-200 focus:bg-crema-100 border-mostaza-300 border-2 rounded-lg shadow my-1 p-2 font-bold text-lg"
            type="password"
            />
           <button
            type="submit"
            className="mt-8 mb-4 rounded-lg bg-mostaza-300 hover:bg-crema-300 shadow mx-auto w-48 py-2 font-bold text-lg"
            >
              Ingresar
            </button>
            {loginError && 
            <div className="text-red-800 my-4 text-center">
              Hubo un error al ingresar, por favor intenta nuevamente.
            </div>
            }
         </Form>
      </Formik>
  )
}

export default LoginForm
