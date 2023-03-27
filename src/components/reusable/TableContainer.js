// Table Container Component
// This component is used to create a table container
import React from 'react'

const TableContainer = ({ children, className, title, line = false }) => {
  return (
    <div className="w-100">
      <div
        className={className}
        style={{
          background: '#FFFFFF',
          boxShadow: '0px 2px 4px 0px rgb(0 0 0 / 8%)',
          borderRadius: '8px',
          margin: '20px 0',
        }}
      >
        {title && (
          <div style={{ padding: '15px 20px', fontSize: '17px' }}>
            <h5 className="text-gray-5 mb-0">{title}</h5>
          </div>
        )}
        {line && <hr className="m-0" />}
        <div style={{ padding: '25px' }}>{children}</div>
      </div>
    </div>
  )
}

export default TableContainer
