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
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useParams } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Badge from 'src/components/Badge'
import TableContainer from 'src/components/reusable/TableContainer'
import Cookies from 'universal-cookie'

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState({})
    const [order, setOrder] = useState([])
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()

    useEffect(() => {
        const loadUser = async () => {
            const res = await trackPromise(axios.get(`${baseURL}/api/v1/admin/customer/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            }))
            if (res?.data?.status === 200) {
                setUser(res?.data?.customer)
                // console.log(res?.data?.customer)
            } else {
            }
        }
        loadUser()
    }, [id, token])

    useEffect(() => {
        const loadOrder = async () => {
            const res = await axios.get(`${baseURL}/api/v1/admin/order/get_orders?CustomerID=${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            if (res?.data?.status === 200) {
                setOrder(res?.data?.orders)
                console.log(res?.data?.orders)
            } else {
                // swal('Oh no!', 'Something went wrong')
            }
        }
        loadOrder()
    }, [id, token])
    // console.log(user)
    // console.log(order)
    return (
      <div>
        <TableContainer title="User Details" line="true">
          <div className="mb-3">
            {/* <img className="rounded-circle" src={user?.ProfilePic} alt="" /> */}
            <h3 className="fw-bold">{user?.FullName}</h3>
          </div>
          <div>
            <h2
              className="fw-bold d-flex align-items-center"
              style={{ fontSize: '16px' }}
            >
              Email: <span className="fw-normal px-2">{user?.Email}</span>
              <Badge status={user?.EmailVerified} />
            </h2>
            <h2
              className="fw-bold d-flex align-items-center"
              style={{ fontSize: '16px' }}
            >
              Mobile: <span className="fw-normal px-2">{user?.PhoneNumber}</span>
              <Badge status={user?.PhoneVerified} />
            </h2>
          </div>
        </TableContainer>

        <TableContainer title="Order History" line="true">
          <div>
            {promiseInProgress === false ? (
              <CTable>
                <CTableHead>
                  <CTableRow style={{ background: '#F3F5F9' }}>
                    <CTableHeaderCell className="py-3" scope="col">
                      Order ID
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3" scope="col">
                      Payment By
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3" scope="col">
                      Date
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3" scope="col">
                      Payment Number
                    </CTableHeaderCell>
                    <CTableHeaderCell className="py-3" scope="col">
                      Status
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Payment Status
                                    </CTableHeaderCell> */}
                    <CTableHeaderCell className="py-3" scope="col">
                      Total Paid
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {order?.map((ord) => {
                    return (
                      <CTableRow>
                        {/* {ord?.Products.map((product) => {
                                                return (
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>#{product?.ProductTitle}</CTableDataCell>
                                                )
                                            })} */}
                        <CTableDataCell
                          className="cursor-pointer"
                          style={{ color: '#8E98AA' }}
                        >
                          <Link to={`/view-order/${ord?.OrderID}`}>#{ord?.OrderID}</Link>{' '}
                        </CTableDataCell>
                        <CTableDataCell style={{ color: '#8E98AA' }}>
                          {ord?.PaymentMethod}
                        </CTableDataCell>
                        <CTableDataCell style={{ color: '#8E98AA' }}>
                          {moment(ord?.OrderCreatedAt).format('l')}
                        </CTableDataCell>
                        <CTableDataCell style={{ color: '#8E98AA' }}>
                          {ord?.BillingAddress?.PhoneNumber}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Badge status={ord?.OrderStatus} />
                        </CTableDataCell>
                        {/* <CTableDataCell>
                                        <Badge status={ord?.OrderStatus} />
                                    </CTableDataCell> */}
                        <CTableDataCell style={{ color: '#8E98AA' }}>
                          ৳{ord?.TotalPrice}
                        </CTableDataCell>
                      </CTableRow>
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
      </div>
    )
};

export default UserDetails;