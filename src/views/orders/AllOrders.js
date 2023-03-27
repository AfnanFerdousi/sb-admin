/* eslint-disable */
import {
  CBadge,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FiEye } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useNavigate } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Badge from 'src/components/Badge'
import TableContainer from 'src/components/reusable/TableContainer'
import Cookies from 'universal-cookie'

const AllOrders = () => {
  const [orders, setOrders] = useState([])
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [orderID, setOrderID] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      const res = await trackPromise(
        axiosJWT.get(
          `${baseURL}/api/v1/admin/order/get_orders?limit=1000000000&${
            orderID !== '' && `OrderID=${orderID}`
          }`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        ),
      )
      if (res?.data?.status === 200) {
        setOrders(res?.data?.orders)
      }
    }
    loadOrders()
  }, [token, orderID])
  // //console.log(orders[0])

  //console.log(orders)

  return (
    <>
      <TableContainer title={`All Orders`}>
        <div className="card-body">
          <CFormInput
            placeholder="Search Order By Order ID"
            className="w-25 rounded mb-3"
            onChange={(e) => setOrderID(e.target.value)}
          />
          {promiseInProgress === false ? (
            <CTable>
              <CTableHead>
                <CTableRow style={{ background: '#F3F5F9' }}>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Order ID
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Product
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Quantity
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Payment
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Amount
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders?.reverse().map((order) => {
                  return (
                    <>
                      <CTableRow>
                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                          #{order?.OrderID}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                          {order?.Products[0]?.ProductTitle},...
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                          {order?.Products?.length}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                          {moment(order?.OrderCreatedAt).format('l')}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Badge status={order?.OrderStatus} />
                        </CTableDataCell>
                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                          ৳{order?.TotalPrice}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link to={`/view-order/${order?.OrderID}`}>
                            <FiEye className="cursor-pointer mx-3" />
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    </>
                  )
                })}
              </CTableBody>
            </CTable>
          ) : (
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color={primary_orange}
              ariaLabel="three-dots-loading"
              wrapperStyle={{ justifyContent: 'center', margin: '5rem 0' }}
              wrapperClassName=""
              visible={true}
            />
          )}
        </div>
      </TableContainer>
    </>
  )
}

export default AllOrders
