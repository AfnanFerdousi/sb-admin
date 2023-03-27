/* eslint-disable */
import {
    CButton,
    CModal,
    CModalBody,
    CModalTitle,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ThreeDots } from 'react-loader-spinner'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { GET_BRANDS, GET_PUBLICATIONS } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import TableContainer from 'src/components/reusable/TableContainer'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'

const OrderStats = () => {
    const [orders, setOrders] = useState([])
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()
    const [orderProductName, setOrderProductName] = useState('')
    const [selectedPublication, setSelectedPublication] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date(moment()))
    const [brands, setBrands] = useState([])
    const [publications, setPublications] = useState([])
    // Modal states
    const [modal, setModal] = useState(false)
    const [modalData, setModalData] = useState([])

    useEffect(() => {
        const loadBrands = async () => {
            const response = await axiosJWT.get(GET_BRANDS)
            setBrands(response?.data?.brands)
        }
        loadBrands()
        const loadPublications = async () => {
            const response = await axiosJWT.get(GET_PUBLICATIONS)
            setPublications(response?.data?.publications)
        }
        loadPublications()
    }, [token])

    useEffect(() => {
        const loadOrders = async () => {
            const res = await trackPromise(
                axiosJWT.get(
                    `${baseURL}/api/v1/admin/order/order_status?limit=1000000000${selectedStatus ? `&OrderStatus=${selectedStatus}` : ''
                    }&Products={${selectedBrand
                        ? `"BrandID":"${selectedBrand}"`
                        : selectedPublication
                            ? `"PublicationID":"${selectedPublication}"`
                            : ''
                    }}&date=${selectedDate.getDate() +
                    '-' +
                    (Number(selectedDate.getMonth()) + 1) +
                    '-' +
                    selectedDate.getFullYear()
                    }`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    },
                ),
            )
            if (res?.data?.status === 200) {
                setOrders(res?.data?.data)
                console.log(res?.data?.data)
            }
        }
        loadOrders()
    }, [token, selectedPublication, selectedBrand, selectedStatus, selectedDate])

    const brandOptions = brands?.map((brand) => {
        return { value: brand?.BrandID, label: brand?.BrandName }
    })
    const publicationOptions = publications?.map((publication) => {
        return { value: publication?.PublicationID, label: publication?.PublicationName }
    })
    const showPubOrBrand = (type, id) => {
        const stringId = id.toString()
        if (type === 'STATIONARY') {
            const brand = brandOptions.find((brand) => brand.value === stringId)
            if (brand?.label) {
                return brand?.label
            }
        } else {
            const publication = publicationOptions.find((pub) => pub.value === stringId)
            if (publication?.label) {
                return publication?.label
            }
        }
        return 'unknown'
    }
    //   Columns for the table
    const columns = [
        'Brand/ Publication',
        'Product Name',
        'Quantity',
        'Payment Status',
        'Time & Date',
        'Action',
    ]

    return (
        <>
            <CModal visible={modal} onClose={() => setModal(false)} className="p-3">
                <CModalTitle className="p-3">Product Details</CModalTitle>
                <CModalBody>
                    {modalData?.Products?.map((product, index) => {
                        return (
                            <div key={index} className="d-flex gap-2 mb-3">
                                <img
                                    src={product?.ProductImage}
                                    alt={product?.ProductTitle}
                                    style={{ width: '150px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h5> {product?.ProductTitle}</h5>
                                    <p>Price: {product?.SalePrice} tk</p>
                                </div>
                            </div>
                        )
                    })}
                </CModalBody>
            </CModal>
            <TableContainer title={`Daily Orders Summary`}>
                <div className="card-body">
                    <div className="d-flex mb-3 flex-wrap gap-3">
                        <Select
                            options={brandOptions}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Brand</div>}
                            placeholder="Select Brand"
                            className="w-10"
                            onChange={(option) => {
                                setSelectedBrand(option?.value)
                            }}
                            styles={selectCustomStyles}
                            isClearable
                        />
                        <Select
                            options={publicationOptions}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Publication</div>}
                            placeholder="Select Publication"
                            className="w-10"
                            onChange={(option) => {
                                setSelectedPublication(option?.value)
                            }}
                            styles={selectCustomStyles}
                            isClearable
                        />
                        <Select
                            options={[
                                { value: 'PENDING', label: 'PENDING' },
                                { value: 'RECEIVED', label: 'RECEIVED' },
                                { value: 'PROCESSING', label: 'PROCESSING' },
                                { value: 'SHIPPED', label: 'SHIPPED' },
                                { value: 'DELIVERED', label: 'DELIVERED' },
                                { value: 'DELIVERY_FAILED', label: 'DELIVERY FAILED' },
                                { value: 'CANCELED_BY_CUSTOMER', label: 'CANCELED BY CUSTOMER' },
                                { value: 'CANCELED_BY_SELLER', label: 'CANCELED BY ADMIN' },
                            ]}
                            placeholder="Select Payment Status"
                            className="w-10"
                            onChange={(option) => {
                                setSelectedStatus(option?.value)
                            }}
                            styles={selectCustomStyles}
                            isClearable
                        />
                        <DatePicker
                            placeholderText="Date"
                            selected={selectedDate}
                            className="form-control w-50"
                            wrapperClassName="date_picker"
                            dateFormat={'dd-MM-yyyy'}
                            onChange={(date) => setSelectedDate(date)}
                        />
                    </div>
                    {promiseInProgress === false ? (
                        <CTable>
                            <CTableHead>
                                <CTableRow style={{ background: '#F3F5F9' }}>
                                    {columns?.map((column, index) => {
                                        return (
                                            <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                                {column}
                                            </CTableHeaderCell>
                                        )
                                    })}
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {/* No Data available */}
                                {orders?.length === 0 ? (
                                    <CTableRow>
                                        <CTableHeaderCell colSpan={columns?.length} className="text-center">
                                            No Data Available
                                        </CTableHeaderCell>
                                    </CTableRow>
                                ) : (
                                    orders?.map((order, index) => {
                                        return (
                                            <>
                                                <CTableRow key={index}>
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                                                        {order?.BrandID && showPubOrBrand(order?.ProductType, order?.BrandID)}
                                                        {order?.PublicationID &&
                                                            showPubOrBrand(order?.ProductType, order?.PublicationID)}
                                                        {!order?.BrandID && !order?.PublicationID && 'unknown'}
                                                    </CTableDataCell>
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                                                        {/* show order?.product data here */}
                                                        {order?.Products?.map((product, index) => {
                                                            return (
                                                                <CTableDataCell
                                                                    style={{ fontSize: '14px', color: '#8E98AA' }}
                                                                    key={index}
                                                                    className="d-flex gap-2"
                                                                >
                                                                    {/* <img
                                  src={product?.ProductImage}
                                  alt={product?.ProductTitle}
                                  style={{ width: '50px' }}
                                /> */}
                                                                    {product?.ProductTitle}
                                                                </CTableDataCell>
                                                            )
                                                        })}
                                                    </CTableDataCell>
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                                                        {order?.Products?.map((product, index) => {
                                                            return <div key={index}>{product?.Quantity}</div>
                                                        })}
                                                    </CTableDataCell>
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                                                        {order?.Products?.map((product, index) => {
                                                            return <div key={index}>{product?.OrderData?.OrderStatus}</div>
                                                        })}
                                                    </CTableDataCell>
                                                    <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                                                        {order?.Products?.map((product, index) => {
                                                            return (
                                                                //   view order date and time
                                                                <div key={index}>
                                                                    {moment(product?.OrderData?.OrderCreatedAt).format(
                                                                        'DD-MM-YYYY / hh:mm A',
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </CTableDataCell>
                                                    {/* add view action button */}
                                                    <CTableDataCell>
                                                        <CButton
                                                            color="primary"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                //   send order data to view order modal
                                                                setModal(true)
                                                                setModalData(order)
                                                            }}
                                                        >
                                                            View
                                                        </CButton>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            </>
                                        )
                                    })
                                )}
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

export default OrderStats