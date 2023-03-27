/* eslint-disable */
import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://studentbazar.com" target="_blank" rel="noopener noreferrer">
          Student Bazar
        </a>
        <span className="ms-1">&copy; 2022.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Developed By</span>
        <a href="https://genres-agency.com" target="_blank" rel="noopener noreferrer">
          GenRes Agency
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
