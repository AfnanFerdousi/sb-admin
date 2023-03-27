/* eslint-disable */

import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import Cookies from 'universal-cookie'

import user from './../../assets/images/user.png'

const AppHeaderDropdown = () => {
  let navigate = useNavigate()
  const cookies = new Cookies()
  const refresh_token = cookies.get('refresh_token')
  const token = cookies.get('token')

  const logoutHandler = async () => {
    const deleted = await axiosJWT.post(
      `${baseURL}/api/v1/admin/auth/logout`,
      {
        token: refresh_token,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization: token,
        },
      },
    )
    if (deleted.data.status === 200) {
      cookies.remove('refresh_token', { path: '/' })
      cookies.remove('token', { path: '/' })
      navigate('/login', { replace: true })
    }
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={user} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        {/*  <CDropdownItem href="#">*/}
        {/*    <CIcon icon={cilTask} className="me-2" />*/}
        {/*    Tasks*/}
        {/*    <CBadge color="danger" className="ms-2">*/}
        {/*      42*/}
        {/*    </CBadge>*/}
        {/*  </CDropdownItem>*/}
        <CDropdownItem onClick={logoutHandler} className="cursor-pointer">
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
