/* eslint-disable */
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CFormInput,
  CFormTextarea,
  CModal,
} from '@coreui/react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { gray } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import Book from '../../assets/images/book.png'
import Invoice from './Invoice'
import print from 'print-js'
import TableContainer from 'src/components/reusable/TableContainer'
import { useRef } from 'react'
import ReactToPrint from 'react-to-print'

// Invoice Print component
const InvoicePrinter = () => {
  let componentRef = useRef()
  return (
    <>
      <Invoice ref={componentRef} />
      <ReactToPrint
        trigger={() => (
          <button className="btn btn-primary text-white my-3 w-25 mx-auto">Print</button>
        )}
        content={() => componentRef?.current}
        pageStyle={`@page {
                    size: 210mm 297mm;
                  }`}
      />
    </>
  )
}

const ViewOrder = () => {
  const { id } = useParams()
  const [orderDetails, setOrderDetails] = useState({})
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [division, setDivision] = useState({})
  const [district, setDistrict] = useState({})
  const [upazila, setUpazila] = useState({})
  const [orderStatus, setOrderStatus] = useState('')
  const [visible, setVisible] = useState(false)

  const {
    OrderID,
    OrderCreatedAt,
    PaymentMethod,
    Products,
    TotalPrice,
    Price,
    DeliveryCharge,
    TrxID,
    OrderStatus,
    ShippingAddress,
    BillingAddress,
    AdvancePaid,
  } = orderDetails

  console.log(orderDetails)

  useEffect(() => {
    const loadOrderDetails = async () => {
      const res = await axios.get(`${baseURL}/api/v1/admin/order/get_orders?OrderID=${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setOrderDetails(res?.data?.orders[0])
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
        `${baseURL}/api/v1/public/address-info/division_list?division_id=${ShippingAddress?.DivisionID}`,
      )
      if (res?.data?.status === 200) {
        setDivision(res?.data?.divisions[0])
      }
    }
    const loadDistricts = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/address-info/district_list_with_division?district_id=${ShippingAddress?.DistrictID}`,
      )
      if (res?.data?.status === 200) {
        setDistrict(res?.data?.districts[0])
      }
    }
    const loadUpazilas = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/address-info/upazila_list_with_district?upazila_id=${ShippingAddress?.UpazilaID}`,
      )
      if (res?.data?.status === 200) {
        setUpazila(res?.data?.upazilas[0])
      }
    }
    loadDivisions()
    loadDistricts()
    loadUpazilas()
  }, [ShippingAddress])

  const statusOptions = [
    {
      value: 'PENDING',
      label: 'Pending',
    },
    {
      value: 'RECEIVED',
      label: 'Received',
    },
    {
      value: 'PROCESSING',
      label: 'Processing',
    },
    {
      value: 'SHIPPED',
      label: 'Shipped',
    },
    {
      value: 'DELIVERED',
      label: 'Delivered',
    },
    {
      value: 'DELIVERED_FAILED',
      label: 'Delivery Failed',
    },
    {
      value: 'CANCELED_BY_CUSTOMER',
      label: 'Canceled by Customer',
    },
    {
      value: 'CANCELED_BY_SELLER',
      label: 'Canceled by Seller',
    },
  ]

  const paymentStatusOptions = [
    {
      value: 'SUCCESS',
      label: 'Success',
    },
    {
      value: 'CANCELLED',
      label: 'Cancelled',
    },
    {
      value: 'REFUNDED',
      label: 'Refunded',
    },
  ]

  const onStatusChange = async (id, status) => {
    //console.log(status)
    const bodyFormData = new FormData()
    bodyFormData.append('OrderID', id)
    bodyFormData.append('OrderStatus', status)
    const res = await axiosJWT.post(
      `${baseURL}/api/v1/admin/order/update_order_status`,
      bodyFormData,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    )
    //console.log(res)
  }

  // const defaultStatus = statusOptions.filter((status) => status?.value == OrderStatus)
  const defaultStatus = statusOptions.filter((status) => OrderStatus?.includes(status?.value))
  return (
    <TableContainer title="Order Details">
      <CCard>
        <CCardBody>
          <div className="d-flex flex-md-row flex-column my-3 align-items-md-start justify-content-between gap-2">
            <div className="d-flex flex-column">
              <span style={{ color: gray }}>Order ID: #{OrderID} </span>
              <span style={{ color: gray }}>Placed On: {moment(OrderCreatedAt).format('l')} </span>
              <span style={{ color: gray }}>
                Payment by: <span className="text-primary">{PaymentMethod}</span>
              </span>
            </div>
            <div>
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                <p className="m-0">Update Status: </p>
                {defaultStatus?.length > 0 && (
                  <Select
                    // styles={selectCustomStyles}
                    style={{ width: 'fit-content' }}
                    defaultValue={defaultStatus}
                    options={statusOptions}
                    onChange={(option) => {
                      setOrderStatus(option.value)
                      onStatusChange(id, option?.value)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {Products?.map((product, index) => (
            <div key={index} className="my-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <img
                    src={product?.ProductImage}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null
                      currentTarget.src =
                        'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image.png'
                    }}
                    style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                    alt={Book}
                  />
                  <div className="mx-3">
                    <h5>{product?.ProductTitle}</h5>
                    <p style={{ color: gray }}>
                      ৳{product?.SalePrice} X {product?.Quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CCardBody>
      </CCard>
      <div className="row">
        <div className="col-md-7 my-3">
          <TableContainer>
            <CCardBody>
              {division?.name && ShippingAddress && district?.name && upazila?.name && (
                <CFormTextarea
                  style={{ borderStyle: 'dashed', minHeight: '100px' }}
                  className="rounded"
                  defaultValue={`${division?.name},${ShippingAddress?.Address}, ${district?.name}, ${upazila?.name}`}
                  readOnly
                  label="Shipping Address"
                />
              )}
              <div className="row mt-3 gap-2">
                <div className=" col-md-5">
                  <CFormInput
                    readOnly
                    defaultValue={TrxID}
                    label="Transaction ID"
                    className=" text-capitalize rounded"
                  />
                </div>
                <div className="col-md-5">
                  <CFormInput
                    readOnly
                    defaultValue={ShippingAddress?.PhoneNumber}
                    label="Mobile Number"
                    className="rounded"
                  />
                </div>
                <div className="col-md-5 my-2">
                  <CFormInput defaultValue={AdvancePaid} label="Advance Paid" className="rounded" />
                </div>
              </div>
            </CCardBody>
          </TableContainer>
        </div>
        <div className="col-md-5 my-3">
          <TableContainer title="Total Summary">
            <CCardBody>
              <div className="d-flex justify-content-between my-3">
                <span>Subtotal:</span> <span>৳{Price}</span>
              </div>
              <div className="d-flex justify-content-between my-3">
                <span>Shipping Fee:</span> <span>৳{DeliveryCharge}</span>
              </div>

              <hr className="mt-5" />
              <div className="d-flex justify-content-between my-3">
                <span>Total:</span> <span>৳{TotalPrice}</span>
              </div>
            </CCardBody>
            <button
              className="btn btn-primary text-white mt-3"
              onClick={() => {
                setVisible(!visible)
              }}
            >
              Generate Invoice
            </button>
          </TableContainer>
        </div>
        {/* <AllOrders */}
        {/* <Link to={`/invoice/${id}`}> */}

        <CModal
          alignment="center"
          visible={visible}
          onClose={() => setVisible(false)}
          backdrop={true}
        >
          <InvoicePrinter />
        </CModal>
        {/* </Link> */}
      </div>
    </TableContainer>
  )
}

export default ViewOrder
