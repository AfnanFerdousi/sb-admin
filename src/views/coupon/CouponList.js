/* eslint-disable */
import {
    CBadge,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import Badge from 'src/components/Badge'
import moment from 'moment'
import CouponBadge from 'src/components/CouponBadge'


// eslint-disable-next-line react/prop-types
const CouponList = () => {
    const cookies = new Cookies()
    const [coupons, setCoupons] = useState([])
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()
    const [deleteCouponsState, setDeleteCouponsState] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const loadCoupons = async () => {
            const res = await trackPromise(
                axiosJWT.get(`${baseURL}/api/v1/admin/coupon/all`),
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            )
            if (res?.data) {
                setCoupons(res?.data?.coupons)
                //console.log(res?.data)
            }
        }
        loadCoupons()
    }, [token])

    const onDelete = async (id) => {
        //console.log(id)
        try {
            swal({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover this!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    const res = await axiosJWT.delete(
                        `${baseURL}/api/v1/admin/coupon/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${token}`,
                            },
                        },
                    )
                    if (res?.status === 200) {
                        setCoupons(coupons.filter((coupon) => coupon.CouponCode !== id))
                        setDeleteCouponsState(false)
                        swal('Success', 'Coupon deleted', 'success')
                    } else {
                        setDeleteCouponsState(false)
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }



    const couponEditHandler = (coupon) => {
        navigate(`/edit-coupon/${coupon?.CouponCode}`, { state: coupon })
    }
    return (
        <>
            <LoadingOverlay
                active={
                    deleteCouponsState
                }
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: '#ebedef9f',
                        height: '100%',
                    }),
                }}
                spinner={
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
                }
            >
                <div className="flex flex-column">
                    <div className="row">
                        <div style={{ height: '35rem', overflowY: 'scroll' }}>
                            {promiseInProgress === false ? (
                                <>
                                    <div className="row">
                                        <div className=" col-md-12">
                                            <div className="card border-0 shadow-sm">
                                                <div className="card-body">
                                                    <h6 className="card-title" style={{ fontSize: '20px' }}>
                                                        Coupon List
                                                    </h6>
                                                </div>
                                                <CTable>
                                                    <CTableHead>
                                                        <CTableRow style={{ background: '#F3F5F9' }}>
                                                            <CTableHeaderCell
                                                                className="py-3 ps-3"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Copoun Code
                                                            </CTableHeaderCell>
                                                            <CTableHeaderCell
                                                                className="py-3"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Coupon Type
                                                            </CTableHeaderCell>
                                                            <CTableHeaderCell
                                                                className="py-3"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Coupon Amount
                                                            </CTableHeaderCell>
                                                            <CTableHeaderCell
                                                                className="py-3"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Usage Limit
                                                            </CTableHeaderCell>
                                                            <CTableHeaderCell
                                                                className="py-3"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Status
                                                            </CTableHeaderCell>
                                                            <CTableHeaderCell
                                                                className="py-3 text-center"
                                                                scope="col"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                Actions
                                                            </CTableHeaderCell>
                                                        </CTableRow>
                                                    </CTableHead>
                                                    <CTableBody>
                                                        {coupons.map((coupon) => {
                                                            return (
                                                                <>
                                                                    <CTableRow>
                                                                        <CTableDataCell
                                                                            style={{ color: '#8E98AA', fontSize: '14px' }}
                                                                            className="pt-3 ps-3"
                                                                        >
                                                                            {coupon?.CouponCode}
                                                                        </CTableDataCell>
                                                                        <CTableDataCell
                                                                            style={{ color: '#8E98AA', fontSize: '14px' }}
                                                                            className="pt-3 ps-3"
                                                                        >
                                                                            {coupon?.CouponType}
                                                                        </CTableDataCell>
                                                                        <CTableDataCell
                                                                            style={{ color: '#8E98AA', fontSize: '14px' }}
                                                                            className="pt-3 ps-3"
                                                                        >
                                                                            {coupon?.CouponAmount}
                                                                        </CTableDataCell>
                                                                        <CTableDataCell
                                                                            style={{ color: '#8E98AA', fontSize: '14px' }}
                                                                            className="pt-3 ps-3"
                                                                        >
                                                                            {coupon?.CouponLimit}
                                                                        </CTableDataCell>
                                                                        <CTableDataCell
                                                                            style={{ color: '#8E98AA', fontSize: '14px' }}
                                                                            className="pt-3 ps-3"
                                                                        >
                                                                            <CouponBadge start={coupon?.CouponStartDate} end={coupon?.CouponEndDate}></CouponBadge>
                                                                        </CTableDataCell>
                                                                        <CTableDataCell className="text-center d-flex align-items-center justify-content-center">
                                                                            <CButton
                                                                                onClick={() => onDelete(coupon?.CouponCode)}
                                                                                className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                                                                style={{ color: '#8E98AA' }}
                                                                            >
                                                                                <RiDeleteBin5Fill />
                                                                            </CButton>
                                                                            <div
                                                                                onClick={() => couponEditHandler(coupon)}
                                                                                className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                                                                style={{ color: '#8E98AA' }}
                                                                            >
                                                                                <FiEdit className="cursor-pointer mx-3" />
                                                                            </div>

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
                                </>
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
                    </div>
                </div>
            </LoadingOverlay>
        </>
    )
}

export default CouponList
