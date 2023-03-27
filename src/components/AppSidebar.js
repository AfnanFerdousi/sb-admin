/* eslint-disable */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import Logo from '../assets/images/logo.png'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import { bg_gray } from '../colors'
import navigation from '../_nav'
import www from '../assets/images/www.png'
import { FiEye } from 'react-icons/fi'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      style={{ background: `${bg_gray}` }}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <div
        to="/"
        style={{ background: `${bg_gray}`, borderBottom: '.5px solid rgba(255, 255, 255, .5)' }}
        className="d-flex align-items-center ps-3"
      >
        <img src={Logo} alt="Student Bazar Logo" className="img-fluid h-75 pt-1 ps-1 pe-1" style={{ paddingBottom: '0.5rem' }} />
      </div>
      <CSidebarNav className="pt-4 " style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <SimpleBar>
          <AppSidebarNav className="ps-2" items={navigation} />
        </SimpleBar>
        {/* <hr className="mt-5" /> */}
        <div className="bottom-0">
          <hr />
          <div className="px-3 pb-3">
            {/* <hr className="" />   */}
            <a href="https://sbclient.vercel.app/" target="_blank" rel="noreferrer noopener" className="d-flex justify-content-between align-items-center cursor-pointer text-light w-100">
              <div className='d-flex justify-content-between align-items-center'>
                <img
                  src={www}
                  alt={'www'}
                  className="me-2"
                  style={{ width: '15px', height: '15px' }}
                />
                <p style={{ fontSize: '15px' }} className="mb-0">Go to website</p>
              </div>
              <FiEye className="cursor-pointer w-full" />
            </a>
          </div>
        </div>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
