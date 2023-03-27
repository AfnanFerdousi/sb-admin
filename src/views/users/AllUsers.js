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
import { Link } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Badge from 'src/components/Badge'
import Cookies from 'universal-cookie'
import Paginate from '../product/Paginate'

const AllUsers = () => {
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    const [customerId, setCustomerId] =useState()
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [productsPerPage] = useState(10)
    const [currentProduct, setCurrentPage] = useState(1)

    const indexOfLastProduct = currentProduct * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentCustomers = customers.slice(indexOfFirstProduct, indexOfLastProduct)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const phone = customerPhone.replace('+', '%2B');
    useEffect(() => {
        const loadCustomers = async () => {
            const res = await trackPromise(
                axiosJWT.get(
                    `${baseURL}/api/v1/admin/customer?limit=1000000000&${customerEmail !== '' ? `Email=${customerEmail}` : customerPhone !== '' && `PhoneNumber=${phone}`}`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    },
                ),
            )
            if (res?.data?.status === 200) {
                setCustomers(res?.data?.customers)
            }
        }
        loadCustomers()
    }, [token, customerEmail, customerPhone])

    useEffect(() => {
        const loadOrders = async () => {
            const res = await trackPromise(
                axiosJWT.get(
                    `${baseURL}/api/v1/admin/order/get_orders?limit=1000000000&`,
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
    }, [token])

   
    console.log(customers)
    return (
        <div>
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <h6 className="card-title">All Users</h6>
                    <div className="my-3 d-flex">
                        <CFormInput
                            placeholder="Search by email"
                            // placeholder={<div style={{ color: '#808080' }}>Search Order By Order ID</div>}
                            className="w-25"
                            onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                        <CFormInput
                            placeholder="Search by phone"
                            // placeholder={<div style={{ color: '#808080' }}>Search Order By Order ID</div>}
                            className="w-25 ms-2"
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                    </div>
                    {promiseInProgress === false ? (
                        <CTable >
                            <CTableHead>
                                <CTableRow style={{ background: '#F3F5F9' }}>
                                    <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Name
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Email
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Mobile Number
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Total Order(s)
                                    </CTableHeaderCell>
                                    <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                        Action
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {currentCustomers?.reverse().map((customer, index) => {
                                    const totalOrder = orders.filter((order) => order?.CustomerID == customer?.CustomerID)
                                    return (
                                        <>
                                            <CTableRow key={index}>
                                                <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>{customer?.FullName}</CTableDataCell>
                                                <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>{customer?.Email}</CTableDataCell>
                                                <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>{customer?.PhoneNumber}</CTableDataCell>
                                                <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }} >{totalOrder?.length ? totalOrder?.length : 0}</CTableDataCell>
                                                <CTableDataCell>
                                                    <Link   
                                                        to={`/all-users/${customer?.CustomerID}`}>
                                                        
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
                    <Paginate
                        productsPerPage={productsPerPage}
                        totalProducts={customers.length}
                        paginate={paginate}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllUsers;