/* eslint-disable */
import {
    CBadge,
    CFormInput,
    CTable,
    CModal,
    CModalBody,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import axios from 'axios'
import moment from 'moment'
import { forwardRef } from 'react'
import { useEffect, useState } from 'react'
import { RiFileShield2Fill, RiHomeSmile2Line } from 'react-icons/ri'
import { Link, useParams } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { gray } from 'src/colors'
import Cookies from 'universal-cookie'
import logo from '../../assets/images/logowithtext.png'
import '../../scss/_custom.scss'

const Invoice = (props, ref) => {
    const { id } = useParams()
    const cookies = new Cookies()
    const token = cookies.get('token')
    const [order, setOrder] = useState({})
    const [division, setDivision] = useState({})
    const [division2, setDivision2] = useState({})
    const [district, setDistrict] = useState({})
    const [district2, setDistrict2] = useState({})
    const [upazila, setUpazila] = useState({})
    const [upazila2, setUpazila2] = useState({})

    useEffect(() => {
        const loadOrderDetails = async () => {
            const res = await axios.get(`${baseURL}/api/v1/admin/order/get_orders?OrderID=${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            if (res?.data?.status === 200) {
                setOrder(res?.data?.orders[0])
                //console.log(res?.data?.orders[0])
            } else {
                // swal('Oh no!', 'Something went wrong')
            }
        }
        loadOrderDetails()
    }, [id, token])

    useEffect(() => {
        const loadDivisions = async () => {
            const res = await axios.get(
                `${baseURL}/api/v1/public/address-info/division_list?division_id=${order?.BillingAddress?.DivisionID}`,
            )
            const res2 = await axios.get(
                `${baseURL}/api/v1/public/address-info/division_list?division_id=${order?.ShippingAddress?.DivisionID}`,
            )
            if (res?.data?.status === 200 && res2?.data?.status === 200) {
                setDivision(res?.data?.divisions[0])
                setDivision2(res2?.data?.divisions[0])
            }
        }
        const loadDistricts = async () => {
            const res = await axios.get(
                `${baseURL}/api/v1/public/address-info/district_list_with_division?district_id=${order?.BillingAddress?.DistrictID}`,
            )
            const res2 = await axios.get(
                `${baseURL}/api/v1/public/address-info/district_list_with_division?district_id=${order?.ShippingAddress?.DistrictID}`,
            )
            
            if (res?.data?.status === 200 && res2?.data?.status === 200) {
                setDistrict(res?.data?.districts[0])
                setDistrict2(res2?.data?.districts[0])                
            }
        }
        const loadUpazilas = async () => {
            const res = await axios.get(
                `${baseURL}/api/v1/public/address-info/upazila_list_with_district?upazila_id=${order?.BillingAddress?.UpazilaID}`,
            )
            const res2 = await axios.get(
                `${baseURL}/api/v1/public/address-info/upazila_list_with_district?upazila_id=${order?.ShippingAddress?.UpazilaID}`,
            )
            if (res?.data?.status === 200 && res2?.data?.status === 200) {
                setUpazila(res?.data?.upazilas[0])
                setUpazila2(res2?.data?.upazilas[0])
            }
        }
        loadDivisions()
        loadDistricts()
        loadUpazilas()
    }, [order?.BillingAddress, order?.ShippingAddress])
   
    const Products = order?.Products;
    return (
      <div ref={ref}>
        <div  className="p-3">
          <img src={logo} alt="" style={{ width: '170px', marginBottom: '80px' }} />
          <div className="invoice" style={{ width: '100%' }}>
            <div className="info" style={{ width: '50%', columnGap: '8px' }}>
              <h2 className="fw-bold">{order?.BillingAddress?.FullName}</h2>
              <h2 style={{ fontSize: '13px' }} className="fw-medium">
                Invoice Date:{' '}
                <span className="fw-bold">
                  {moment(order?.OrderCreatedAt).format('MM/DD/YYYY')}
                </span>
              </h2>
              <h2 style={{ fontSize: '13px' }} className="fw-medium">
                Order ID: <span className="fw-bold">#{order?.OrderID}</span>
              </h2>
            </div>
            <div
              className="col-md-6 gy-2"
              style={{ width: '50%', columnGap: '8px', textAlign: 'end' }}
            >
              <h2 className="fw-bold">Billing Address</h2>
              <h3 style={{ fontSize: '12px', fontWeight: 500 }} className="fw-medium">
                {upazila?.name},{district?.name},{division?.name}
              </h3>
              <h2 className="fw-bold">Shipping Address</h2>
              <h3 style={{ fontSize: '12px', fontWeight: 500 }} className="fw-medium">
                {upazila2?.name},{district2?.name},{division2?.name}
              </h3>
            </div>
          </div>

          <div className="spacing">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    SL
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    DESCRIPTION
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    QTY
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    PRICE
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Products?.map((product) => {
                  return (
                    <CTableRow>
                      <CTableDataCell
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        className="fw-medium"
                      >
                        {product?.ProductID}
                      </CTableDataCell>
                      <CTableDataCell
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        className="fw-medium"
                      >
                        {product?.ProductTitle}
                      </CTableDataCell>
                      <CTableDataCell
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        className="fw-medium"
                      >
                        {product?.Quantity}
                      </CTableDataCell>
                      <CTableDataCell
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        className="fw-medium"
                      >
                        ৳{product?.TotalPrice}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>

            <CTable className="mt-5">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    PAYMENT INFO
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    DUE BY
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  ></CTableHeaderCell>
                  <CTableHeaderCell
                    className="px-2"
                    scope="col"
                    style={{ fontSize: '12px', color: '#8E98AA', padding: '13px 0px' }}
                  >
                    TOTAL
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell style={{ fontSize: '12px' }} className="fw-medium">
                    Payment method: <span className="fw-bold">{order?.PaymentMethod}</span> <br />
                    Payment number:{' '}
                    <span className="fw-bold">{order?.BillingAddress?.PhoneNumber}</span>
                  </CTableDataCell>
                  <CTableDataCell style={{ fontSize: '12px' }} className="fw-bold">
                    {moment(order?.OrderCreatedAt).format('LL')}
                  </CTableDataCell>
                  <CTableDataCell style={{ fontSize: '12px' }} className="fw-bold"></CTableDataCell>
                  <CTableDataCell style={{ fontSize: '12px' }} className="fw-bold">
                    ৳{order?.TotalPrice}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>

          <div
            className=""
            style={{
              marginTop: '80px',
              fontSize: '10px',
              padding: '13px 0px',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            support@studentbazar.com | +8801711223344 | www.studentbazar.com
          </div>
        </div>
      </div>
    )
};

export default forwardRef(Invoice)