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
            setToken(res.data.token)
            setUser(res.data.collaborator)
            history.push('')
          })
          .catch((err:any)=> {
            setLoginError(true)
            console.log(err)
          })
          actions.setSubmitting(false);
        }}
      >
        <Form className="flex flex-col w-full mt-6 text-black">
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
            className="p-2 my-1 text-lg font-bold border-2 rounded-lg shadow bg-crema-200 focus:bg-crema-100 border-mostaza-300"
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
            className="p-2 my-1 text-lg font-bold border-2 rounded-lg shadow bg-crema-200 focus:bg-crema-100 border-mostaza-300"
            type="password"
            />
           <button
            type="submit"
            className="w-48 py-2 mx-auto mt-8 mb-4 text-lg font-bold rounded-lg shadow bg-mostaza-300 hover:bg-crema-300"
            >
              Ingresar
            </button>
            {loginError && 
            <div className="my-4 text-center text-red-800">
              Hubo un error al ingresar, por favor intenta nuevamente.
            </div>
            }
         </Form>
      </Formik>
  )
}

export default LoginForm
