import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { baseURL } from 'src/baseUrl'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import logo from '../../../assets/images/logowithtext.png'

const Login = () => {
  let navigate = useNavigate()
  let location = useLocation()

  let from = location.state?.from?.pathname || '/'
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${baseURL}/api/v1/public/auth/admin-login`, data)

      const cookies = new Cookies()
      cookies.set('token', `${res?.data?.token}`, { path: '/' })
      cookies.set('refresh_token', `${res?.data?.refresh_token}`, { path: '/' })
      localStorage.setItem('user', JSON.stringify(res?.data?.user_data))
      const token = cookies.get('token')
      const refresh_token = cookies.get('refresh_token')
      if (res?.data?.status === 200) {
        if (token && refresh_token) {
          navigate(from, { replace: true })
          swal('Success', 'Login Success', 'success')
        }
      } else {
        swal('Oh no!', 'Login Failed', 'error')
      }
    } catch (e) {
      swal('Oh no!', 'Login Failed', 'error')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CImage fluid src={logo} alt="student bazar" align="center" />
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <p className="text-medium-emphasis mt-3 text-center">
                      log in to your dashboard
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        {...register('username', { required: true })}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: true })}
                      />
                    </CInputGroup>
                    <CButton color="primary" className="px-4 text-white" type="submit">
                      Login
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
