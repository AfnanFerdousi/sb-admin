/* eslint-disable */
import {
  CButton,
  CTable,
  CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import Badge from 'src/components/Badge'
import Cookies from 'universal-cookie'
  const RecentOrders = ({ orders }) => {
  
    // console.log(orders)
  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="card-title" style={{ fontSize: '20px' }}>
            Recent Orders
          </h5>
          <Link to={`/all-orders`}>
            <CButton color="primary" variant="outline" className="btn">
              All orders
            </CButton>
          </Link>
        </div>
        <div className="">
          <CTable>
            <CTableHead>
              <CTableRow style={{ background: '#F3F5F9' }}>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Order ID
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Payment
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Amount
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders?.slice(0, 15)?.map((order) => {
                return (
                  <>
                    <CTableRow>
                      <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                        <Link
                          to={`/view-order/${order?.OrderID}`}
                          style={{ fontSize: '14px', color: '#8E98AA' }}
                        >
                          #{order?.OrderID}
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                        {order?.Products[0]?.ProductTitle}
                      </CTableDataCell>
                      <CTableDataCell>
                        <Badge status={order?.OrderStatus} />
                      </CTableDataCell>
                      <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                        ৳{order?.TotalPrice}
                      </CTableDataCell>
                    </CTableRow>
                  </>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  )
}
export default RecentOrders