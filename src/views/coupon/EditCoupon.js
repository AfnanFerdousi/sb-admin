/* eslint-disable */
import {
    CForm
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useParams, useLocation } from 'react-router-dom'
// import { DELETE_BANNER, GET_ALL_BANNERS, POST_NEW_BANNER } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Cookies from 'universal-cookie'
import { selectCustomStyles } from 'src/selectCustomStyles'
import moment from 'moment'

const EditCoupon = () => {
    // const { state } = useLocation()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm()

    // const freeShip = watch('FreeShipping')
    // console.log(freeShip)

    const [products, setProducts] = useState([])
    const [coupon, setCoupon] = useState({})
    const [categories, setCategories] = useState([])
    const [addCouponState, setAddCouponState] = useState(false)
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { id } = useParams()

    const [freeShip, setFreeShip] = useState(coupon?.FreeShipping)
    const loadCategories = async () => {
        const res = await trackPromise(
            axios.get(`${baseURL}/api/v1/public/category/categories`),
        )
        if (res?.data?.categories?.length > 0) {
            setCategories(res?.data?.categories)
            //console.log(res?.data?.categories)
        }
    }

    const loadProducts = async () => {
        const res = await trackPromise(
            axios.get(`${baseURL}/api/v1/public/product/product_filter`),
        )
        if (res?.data?.products?.length > 0) {
            setProducts(res?.data?.products)
            //console.log(res?.data?.products)
        }
    }
    const onSubmit = async (data) => {
        // const editedData = {
        //     ...state,
        //     ...data,
        // }
        // console.log(editedData)
        const newCouponExcludedProducts = data?.CouponExcludedProducts ? data?.CouponExcludedProducts?.map((item) => item.value) || [] : coupon?.CouponExcludedProducts
        const newCouponExcludedCategories = data?.CouponExcludedCategories ? data?.CouponExcludedCategories?.map((item) => item.value) || [] : coupon?.CouponExcludedCategories
        const newCouponCategoryIds = data?.CategoryIds ? data?.CategoryIds?.map((item) => item.value) || [] : coupon?.CategoryIds
        const newCouponProductIds = data?.ProductIds ? data?.ProductIds?.map((item) => item.value) || [] : coupon?.ProductIds
        try {
            const bodyFormData = new FormData()
            bodyFormData.append('CouponCode', data?.CouponCode ? data?.CouponCode : coupon?.CouponCode)
            bodyFormData.append('CouponDescription', data?.CouponDescription ? data?.CouponDescription : coupon?.CouponDescription)
            bodyFormData.append('CouponAmount', data?.CouponAmount ? data?.CouponAmount : coupon?.CouponAmount)
            bodyFormData.append('CouponType', data?.CouponType ? data?.CouponType : coupon?.CouponType)
            bodyFormData.append('CouponStartDate', data?.CouponStartDate ? data?.CouponStartDate : coupon?.CouponStartDate)
            bodyFormData.append('CouponEndDate', data?.CouponEndDate ? data?.CouponEndDate : coupon?.CouponEndDate)
            bodyFormData.append('CouponLimit', data?.CouponLimit ? data?.CouponLimit : coupon?.CouponLimit)
            bodyFormData.append('MinimumSpendAmount', data?.MinimumSpendAmount ? data?.MinimumSpendAmount : coupon?.MinimumSpendAmount)
            bodyFormData.append('FreeShipping', data?.FreeShipping ? data?.FreeShipping : coupon?.FreeShipping)
            bodyFormData.append('ProductIds', newCouponProductIds)
            bodyFormData.append('CategoryIds', newCouponCategoryIds)
            bodyFormData.append('CouponExcludedProducts', newCouponExcludedProducts)
            bodyFormData.append('CouponExcludedCategories', newCouponExcludedCategories)
            bodyFormData.append('CouponLimitPerUser', data?.CouponLimitPerUser ? data?.CouponLimitPerUser : coupon?.CouponLimitPerUser)

            // bodyFormData.append('CouponMaximumSpendAmount', data?.CouponMaximumSpendAmount)
            // bodyFormData.append('CouponIndividualUse', data?.CouponIndividualUse)
            // bodyFormData.append('CouponExcludeSaleItems', data?.CouponExcludeSaleItems)



            setAddCouponState(true)
            const res = await axiosJWT.post(`${baseURL}/api/v1/admin/coupon/edit`, bodyFormData, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            if (res?.data?.status === 200) {
                setAddCouponState(false)
            } else {
                setAddCouponState(false)
            }
        } catch (error) {
            console.log(error)
        }
        //console.log(data)
    }

    useEffect(() => {
        loadCategories()
        loadProducts()
    }, [token])

    useEffect(() => {
        const loadSingleCoupon = async () => {
            const res = await trackPromise(
                axiosJWT.get(`${baseURL}/api/v1/admin/coupon/single/${id}`),
            )
            if (res?.data) {
                setCoupon(res?.data?.coupon)
                //console.log(res?.data)
            }
        }
        loadSingleCoupon()
    }, [id, token])

    const categoryOptions = categories.map((category) => {
        return {
            value: category?.CategoryID,
            label: category?.CategoryName,
        }
    })

    const discountOptions = [
        { value: 'FIXED_CART', label: 'Fixed Cart' },
        { value: 'FIXED_PRODUCT', label: 'Fixed Product' },
        { value: 'PERCENTAGE_PRODUCT', label: 'Percentage Product' },
    ]

    const productOptions = products.map((product) => {
        return {
            value: product?.ProductID,
            label: product?.ProductTitle,
        }
    })

    const defaultDiscount = discountOptions.filter((option) => option?.value === coupon?.CouponType)

    const selectedCategories = categoryOptions?.filter((option) => {
        if (coupon?.Categories?.includes(option.value)) {
            return option
        }
        return null
    })

    const selectedExcludedCategories = categoryOptions?.filter((option) => {
        if (coupon?.CouponExcludedCategories?.includes(option.value)) {
            return option
        }
        return null
    })

    const selectedProducts = productOptions?.filter((option) => {
        if (coupon?.Products?.includes(option.value)) {
            return option
        }
        return null
    })
    console.log(selectedProducts)
    const selectedExcludedProducts = productOptions?.filter((option) => {
        if (coupon?.CouponExcludedProducts?.includes(option.value)) {
            return option
        }
        return null
    })

    console.log(coupon)
    const couponStart = moment(coupon?.CouponStartDate).format('MM/DD/YYYY')
    const couponEnd = moment(coupon?.CouponEndDate).format('MM/DD/YYYY')

    const arr = []
    const fun = (selectedCat, num) => {
        const childs = categories.filter((category) => category.ParentCategoryID == selectedCat);
        if (childs) {
            childs.forEach(element => {
                arr.push({
                    label: `${'-'.repeat(num)} ${element.CategoryName}`,
                    value: element?.CategoryID
                })
                fun(element.CategoryID, num + 1)
            });
        }
    }
    fun('0', 0)

    return (
        <>
            <LoadingOverlay
                active={addCouponState}
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
                    <div>
                        <div className="card border-0 shadow-sm">
                            <CForm onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <h6 className="card-title">Edit Coupon</h6>
                                        <button
                                            className="btn btn-primary text-white"
                                            style={{ padding: '.5rem 2rem .5rem 2rem' }}
                                            type="submit"
                                        >Update</button>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-10">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={coupon?.CouponCode}
                                                        disabled
                                                        placeholder="Coupon Code"
                                                        {...register('CouponCode')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="mb-2">
                                                    <textarea
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue={coupon?.CouponDescription}
                                                        placeholder="Description"
                                                        {...register('CouponDescription')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card-body">
                                        <h6 className="card-title">General</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <Controller
                                                        control={control}
                                                        name="CouponType"
                                                        render={({ field: { onChange, value, ref, name } }) => (
                                                            <Select
                                                                className=" "
                                                                value={defaultDiscount}
                                                                options={discountOptions}
                                                                placeholder="Chose Discount Type"
                                                                onChange={(option) => {
                                                                    onChange(option.value)
                                                                }}
                                                                styles={selectCustomStyles}
                                                                isClearable
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Coupon Amount"
                                                        // defaultValue={coupon?.CouponAmount}
                                                        {...register('CouponAmount')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {couponStart !== " " && (
                                                    <div className="mb-2">
                                                        <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>Start date</label>
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="CouponStartDate"
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    placeholderText="Start Offer"
                                                                    onChange={(date) => field.onChange(date)}
                                                                    isClearable
                                                                    value={field?.value ? field?.value : couponStart}
                                                                    selected={field?.value}
                                                                    className="form-control"
                                                                    wrapperClassName="date_picker"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                )}

                                            </div>
                                            <div className="col-md-6">
                                                {couponEnd !== " " && (
                                                    <div className="mb-2">
                                                        <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>End date</label>
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="CouponEndDate"
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    placeholderText="End Offer"
                                                                    onChange={(date) => field.onChange(date)}
                                                                    isClearable
                                                                    value={field?.value ? field?.value : couponEnd}
                                                                    selected={field?.value}
                                                                    className="form-control"
                                                                    wrapperClassName="date_picker"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        <div className="form-check mt-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexCheckDefault"
                                                value={freeShip}
                                                onChange={event => setFreeShip(event.target.value)}
                                                // checked={coupon?.FreeShipping ? true : false}
                                                {...register('FreeShipping')}
                                            />
                                            <label className="" style={{ fontSize: '14px' }} for="flexCheckDefault">
                                                Check this box if the coupon grants free shipping.
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card-body">
                                        <h6 className="card-title">Usage Restriction</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Minimum Spend"
                                                        defaultValue={coupon?.MinimumSpendAmount}
                                                        {...register('MinimumSpendAmount')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{ margin: '40px 0px 40px 0px' }} />

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    {selectedProducts?.length >= 0 && (
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="ProductIds"
                                                            render={({ field: { onChange, value, ref, name } }) => (
                                                                <Select
                                                                    defaultValue={selectedProducts ? selectedProducts : selectedProducts}
                                                                    options={productOptions}
                                                                    placeholder="Search Products"
                                                                    onChange={(option) => {
                                                                        onChange(option)
                                                                    }} isSearchable
                                                                    isMulti
                                                                    styles={selectCustomStyles}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    {selectedExcludedProducts?.length >= 0 && (
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="CouponExcludedProducts"
                                                            render={({ field: { onChange, value, ref, name } }) => (
                                                                <Select
                                                                    defaultValue={selectedExcludedProducts ? selectedExcludedProducts : selectedExcludedProducts}
                                                                    options={productOptions}
                                                                    placeholder="Search Exclude Products"
                                                                    onChange={(option) => {
                                                                        onChange(option)
                                                                    }}
                                                                    isMulti
                                                                    isSearchable
                                                                    styles={selectCustomStyles}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    {selectedCategories?.length >= 0 && (
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="CategoryIds"
                                                            render={({ field: { onChange, value, ref, name } }) => (
                                                                <Select
                                                                    defaultValue={selectedCategories ? selectedCategories : selectedCategories}
                                                                    options={arr}
                                                                    placeholder="Add Category"
                                                                    onChange={(option) => {
                                                                        onChange(option)
                                                                    }}
                                                                    isMulti
                                                                    isSearchable
                                                                    styles={selectCustomStyles}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    {selectedExcludedCategories?.length >= 0 && (
                                                        <Controller
                                                            control={control}
                                                            required
                                                            name="CouponExcludedCategories"
                                                            render={({ field: { onChange, value, ref, name } }) => (
                                                                <Select
                                                                    defaultValue={selectedExcludedCategories ? selectedExcludedCategories : selectedExcludedCategories}
                                                                    options={arr}
                                                                    placeholder="Add Exclude Category"
                                                                    onChange={(option) => {
                                                                        onChange(option)
                                                                    }}
                                                                    isSearchable
                                                                    styles={selectCustomStyles}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="card-body ">
                                        <h6 className="card-title">Usage Limit</h6>
                                    </div>
                                    <div className="card-body mb-5">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Usage limit per coupon"
                                                        defaultValue={coupon?.CouponLimit}
                                                        // coupon usege limit per coupon
                                                        {...register('CouponLimit')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Usage limit per user"
                                                        defaultValue={coupon?.CouponLimitPerUser}
                                                        {...register('CouponLimitPerUser')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CForm>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    );
};

export default EditCoupon;