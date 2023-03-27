/* eslint-disable */
import axios from 'axios'
import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'universal-cookie'
import { axiosJWT } from './axiosJWT'
import { baseURL } from './baseUrl'
import PrivateRoute from './PrivateRoute'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  // const access_token = cookies.get('token')

  useEffect(() => {
    const cookies = new Cookies()
    const refresh_token = cookies.get('refresh_token')
    const refreshToken = async () => {
      try {
        const res = await axios.post(`${baseURL}/api/v1/public/auth/admin-token`, {
          token: refresh_token,
        })
        return res.data
      } catch (err) {
        //console.log(err)
      }
    }

    axiosJWT.interceptors.response.use(
      (response) => {
        // console.log(response)
        if (response?.config.method === 'post' && response.status === 200) {          
          toast.success('Success!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
        return response
      },
      async (err) => {
        const originalRequest = err.config
        if (err?.response?.status === 403 && !originalRequest._retry) {
          const token = await refreshToken()
          cookies.set('token', token?.token, { path: '/' })
          axiosJWT.defaults.headers.common['Authorization'] = `${token?.token}`
          if (cookies.get('token')) originalRequest._retry = true
          return axiosJWT(originalRequest)
        }
        if (err?.response?.status === 400 && err.config.method !== 'get') {
          // console.log(err)
          toast.error('Something went wrong', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
        }
        if (err?.response?.status === 503 && err.config.method !== 'get') {
          // console.log(err)
          toast.error('Something went wrong', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          })
          const token = await refreshToken()
          cookies.set('token', token.token, { path: '/' })
          axiosJWT.defaults.headers.common['Authorization'] = `${token.token}`
          return axiosJWT(originalRequest)
        }
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            path="*"
            name="Home"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default App
