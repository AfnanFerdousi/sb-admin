/* eslint-disable */
import { CForm, CFormInput } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import Select from 'react-select'
// import { DELETE_BANNER, GET_ALL_BANNERS, POST_NEW_BANNER } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'

const AddCoupon = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const [products, setProducts] = useState([])
  const [productType, setProductType] = useState()
  const [categories, setCategories] = useState([])
  const [addCouponState, setAddCouponState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')

  const onSubmit = async (data) => {
    try {
      // setAddCouponState(true)
      const newCouponExcludedProducts =
        data?.CouponExcludedProducts?.map((item) => item.value) || []
      const newCouponExcludedCategories =
        data?.CouponExcludedCategories?.map((item) => item.value) || []
      const newCouponCategoryIds = data?.CategoryIds?.map((item) => item.value) || []
      const newCouponProductIds = data?.ProductIds?.map((item) => item.value) || []

      const bodyFormData = new FormData()
      bodyFormData.append('CouponCode', data?.CouponCode)
      bodyFormData.append('CouponDescription', data?.CouponDescription)
      bodyFormData.append('CouponAmount', data?.CouponAmount)
      bodyFormData.append('CouponType', data?.CouponType)
      bodyFormData.append('CouponStartDate', data?.CouponStartDate)
      bodyFormData.append('CouponEndDate', data?.CouponEndDate)
      bodyFormData.append('CouponLimit', data?.CouponLimit)
      bodyFormData.append('FreeShipping', data?.FreeShipping)
      bodyFormData.append('CouponLimitPerUser', data?.CouponLimitPerUser)
      bodyFormData.append('MinimumSpendAmount', data?.MinimumSpendAmount)
      bodyFormData.append('CategoryIds', JSON.stringify(newCouponCategoryIds))
      bodyFormData.append('ProductIds', JSON.stringify(newCouponProductIds))
      bodyFormData.append('CouponExcludedProducts', JSON.stringify(newCouponExcludedProducts))
      bodyFormData.append('CouponExcludedCategories', JSON.stringify(newCouponExcludedCategories))


      // bodyFormData.append('CouponMaximumSpendAmount', data?.CouponMaximumSpendAmount)
      // bodyFormData.append('CouponIndividualUse', data?.CouponIndividualUse)
      // bodyFormData.append('CouponExcludeSaleItems', data?.CouponExcludeSaleItems)




      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/coupon/new`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res?.status === 200) {
        setAddCouponState(false)
      } else {
        setAddCouponState(false)
      }
    } catch (error) {
      //console.log(error)
      console.log('onSubmit ~ error', error)
      setAddCouponState(false)
    }
  }

  // Edit banner end

  useEffect(() => {
    const loadCategories = async () => {
      const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/category/categories`))
      if (res?.data?.categories?.length > 0) {
        setCategories(res?.data?.categories)
        //console.log(res?.data?.categories)
      }
    }

    const loadProducts = async () => {
      const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/product/product_filter`))
      if (res?.data?.products?.length > 0) {
        setProducts(res?.data?.products)
        //console.log(res?.data?.products)
      }
    }
    loadCategories()
    loadProducts()
  }, [token])

  const categoryOptions = categories.map((category) => {
    return {
      value: category?.CategoryID,
      label: category?.CategoryName,
    }
  })

  const productOptions = products.map((product) => {
    return {
      value: product?.ProductID,
      label: product?.ProductTitle,
    }
  })

  const arr = []
  const fun = (selectedCat, num) => {
    console.log(selectedCat)
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
                    <h6 className="card-title">Add New Coupon</h6>
                    <button
                      className="btn btn-primary text-white"
                      style={{ padding: '.5rem 2rem .5rem 2rem' }}
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-10">
                        <div className="mb-2">
                          <CFormInput
                            type="text"
                            className="form-control"
                            placeholder="Coupon Code"
                            floatingLabel={<div style={{ color: '#808080' }}>Coupon Code</div>}
                            {...register('CouponCode', { required: true })}
                          />
                        </div>
                      </div>
                      <div className="col-md-10">
                        <div className="mb-2">
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            {...register('CouponDescription', { required: true })}
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
                                options={[
                                  { value: 'FIXED_CART', label: 'Fixed Cart' },
                                  { value: 'FIXED_PRODUCT', label: 'Fixed Product' },
                                ]}
                                placeholder="Chose Discount Type"
                                onChange={(option) => {
                                  onChange(option.value)
                                  setProductType(option.value)
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
                          <CFormInput
                            type="text"
                            className="form-control"
                            placeholder="Coupon Amount"
                            floatingLabel={<div style={{ color: '#808080' }}>Coupon Amount</div>}
                            {...register('CouponAmount', { required: true })}
                          />
                        </div>
                      </div>
                      <>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <Controller
                              control={control}
                              required
                              name="CouponStartDate"
                              render={({ field }) => (
                                <DatePicker
                                  placeholderText="Start Offer"
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  className="form-control"
                                  wrapperClassName="date_picker"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <Controller
                              control={control}
                              required
                              name="CouponEndDate"
                              render={({ field }) => (
                                <DatePicker
                                  placeholderText="End Offer"
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  className="form-control"
                                  wrapperClassName="date_picker"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        {...register('FreeShipping')}
                      />
                      <label className="" style={{ fontSize: '14px' }} htmlFor="flexCheckDefault">
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
                          <CFormInput
                            type="text"
                            className="form-control"
                            placeholder="Minimum Spend"
                            floatingLabel={<div style={{ color: '#808080' }}>Minimum Spend</div>}
                            {...register('MinimumSpendAmount', { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <hr style={{ margin: '40px 0px 40px 0px' }} />

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <Controller
                            control={control}
                            name="ProductIds"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={productOptions}
                                placeholder="Search Products"
                                onChange={(option) => {
                                  onChange(option)
                                }}
                                styles={selectCustomStyles}
                                isMulti="true"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <Controller
                            control={control}
                            name="CouponExcludedProducts"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={productOptions}
                                placeholder="Search Exclude Products"
                                onChange={(option) => {
                                  onChange(option)
                                }}
                                styles={selectCustomStyles}
                                isMulti="true"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <Controller
                            control={control}
                            name="CategoryIds"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={arr}
                                placeholder="Add Category"
                                onChange={(option) => {
                                  console.log('AddCoupon ~ option', option)
                                  onChange(option)
                                }}
                                styles={selectCustomStyles}
                                isMulti="true"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <Controller
                            control={control}
                            name="CouponExcludedCategories"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={arr}
                                placeholder="Add Exclude Category"
                                onChange={(option) => {
                                  onChange(option)
                                }}
                                styles={selectCustomStyles}
                                isMulti="true"
                              />
                            )}
                          />
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
                          <CFormInput
                            type="text"
                            className="form-control"
                            placeholder="Usage limit per coupon"
                            floatingLabel={
                              <div style={{ color: '#808080' }}>Usage limit per coupon</div>
                            }
                            {...register('CouponLimit', { required: true })}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <CFormInput
                            type="text"
                            className="form-control"
                            placeholder="Usage limit per user"
                            floatingLabel={
                              <div style={{ color: '#808080' }}>Usage limit per user</div>
                            }
                            {...register('CouponLimitPerUser', { required: true })}
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
  )
}

export default AddCoupon
