/* eslint-disable */
import { CAlert, CButton, CForm, CFormInput } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import Select from 'react-select'
import { gray, primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'

const CustomOrders = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm()
  const [books, setBooks] = useState([])
  const [stationaries, setStationaries] = useState([])
  const [fashions, setFashions] = useState([])
  const [bookSearch, setBookSearch] = useState('')
  const [stationarySearch, setStationarySearch] = useState('')
  const [fashionSearch, setFashionSearch] = useState('')

  const [academicBook, setAcademicBook] = useState([])
  const [subjectBook, setSubjectBook] = useState([])
  const [academicBookSearch, setAcademicBookSearch] = useState('')
  const [subjectBookSearch, setSubjectBookSearch] = useState('')

  const [addCustomOrderState, setAddCustomOrderState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [cartItems, setCartItems] = useState([])
  const ShippingFee = watch('ShippingFee')
  const GiftWrap = watch('GiftWrap')
  const DistrictID = watch('DistrictID')
  const DivisionID = watch('DivisionID')
  const [divisions, setDivisions] = useState([])
  const [districts, setDistricts] = useState([])
  const [upazilas, setUpazilas] = useState([])

  useEffect(() => {
    if (subjectBookSearch) {
      const loadSubjectBooks = async () => {
        const response = await axiosJWT.get(
          `${baseURL}/api/v1/public/product/search?query=${subjectBookSearch}&ProductType=SUBJECT_BOOK`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        setSubjectBook(response?.data?.products)
      }
      loadSubjectBooks()
    } else {
      const loadSubjectBooks = async () => {
        const response = await axios.get(
          `${baseURL}/api/v1/public/product/product_filter?ProductType=SUBJECT_BOOK`,
        )
        setSubjectBook(response?.data?.products)
      }
      loadSubjectBooks()
    }
  }, [token, subjectBookSearch])

  useEffect(() => {
    if (academicBookSearch) {
      const loadAcademicBooks = async () => {
        const response = await axiosJWT.get(
          `${baseURL}/api/v1/public/product/search?query=${academicBookSearch}&ProductType=ACADEMIC_BOOK`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        setAcademicBook(response?.data?.products)
      }
      loadAcademicBooks()
    } else {
      const loadAcademicBooks = async () => {
        const response = await axiosJWT.get(
          `${baseURL}/api/v1/public/product/product_filter?ProductType=ACADEMIC_BOOK`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        setAcademicBook(response?.data?.products)
      }
      loadAcademicBooks()
    }
  }, [token, academicBookSearch])

  // useEffect(() => {
  //   if (bookSearch) {
  //     const loadBooks = async () => {
  //       const res = await trackPromise(
  //         axios.get(`${baseURL}/api/v1/public/product/search?query=${bookSearch}`),
  //       )
  //       if (res?.data?.status === 200) {
  //         //console.log(res?.data?.products)
  //         setBooks(res?.data?.products)
  //       }
  //     }
  //     loadBooks()
  //   } else {
  //     const loadBooks = async () => {
  //       const res = await trackPromise(
  //         axios.get(`${baseURL}/api/v1/public/product/product_filter?ProductType=BOOK`),
  //       )
  //       if (res?.data?.status === 200) {
  //         setBooks(res?.data?.products)
  //       }
  //     }
  //     loadBooks()
  //   }
  // }, [bookSearch])

  useEffect(() => {
    if (stationarySearch) {
      const loadStationaries = async () => {
        const res = await trackPromise(
          axios.get(
            `${baseURL}/api/v1/public/product/search?query=${stationarySearch}&ProductType=STATIONARY`,
          ),
        )
        if (res?.data?.status === 200) {
          setStationaries(res?.data?.products)
        }
      }
      loadStationaries()
    } else {
      const loadStationaries = async () => {
        const res = await trackPromise(
          axios.get(`${baseURL}/api/v1/public/product/product_filter?ProductType=STATIONARY`),
        )
        if (res?.data?.status === 200) {
          setStationaries(res?.data?.products)
        }
      }
      loadStationaries()
    }
  }, [stationarySearch])

  useEffect(() => {
    if (fashionSearch) {
      const loadFashions = async () => {
        const res = await trackPromise(
          axios.get(
            `${baseURL}/api/v1/public/product/search?query=${fashionSearch}?ProductType=FASHION`,
          ),
        )
        if (res?.data?.status === 200) {
          setFashions(res?.data?.products)
        }
      }

      loadFashions()
    } else {
      const loadFashions = async () => {
        const res = await trackPromise(
          axios.get(`${baseURL}/api/v1/public/product/product_filter?ProductType=FASHION`),
        )
        if (res?.data?.status === 200) {
          setFashions(res?.data?.products)
        }
      }

      loadFashions()
    }
  }, [fashionSearch])

  useEffect(() => {
    const loadDivision = async () => {
      const response = await axios.get(`${baseURL}/api/v1/public/address-info/division_list`)
      setDivisions(response?.data?.divisions)
    }
    const loadDistricts = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/address-info/district_list_with_division?division_id=${DivisionID}`,
      )
      if (res?.data?.status === 200) {
        setDistricts(res?.data?.districts)
      }
    }
    const loadUpazilas = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/address-info/upazila_list_with_district?district_id=${DistrictID}`,
      )
      if (res?.data?.status === 200) {
        setUpazilas(res?.data?.upazilas)
      }
    }
    loadDivision()
    loadDistricts()
    loadUpazilas()
  }, [DistrictID, DivisionID])

  const addToCart = (book) => {
    setCartItems([...cartItems, { ...book, Quantity: 1 }])
  }

  const increaseQuantity = (book) => {
    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.ProductTitle === book.ProductTitle) {
        return { ...cartItem, Quantity: cartItem.Quantity + 1 }
      }
      return cartItem
    })
    setCartItems(newCartItems)
  }

  const decreaseQuantity = (book) => {
    if (book.Quantity !== 1) {
      const newCartItems = cartItems.map((cartItem) => {
        if (cartItem.ProductTitle === book.ProductTitle) {
          // Check if quantity is zero or not
          return { ...cartItem, Quantity: cartItem.Quantity - 1 }
        }
        return cartItem
      })
      setCartItems(newCartItems)
    } else {
      setCartItems(cartItems.filter((cartItem) => cartItem.ProductTitle !== book.ProductTitle))
    }
  }

  const totalCartItemPrice = cartItems.reduce(
    (acc, item) => acc + item.Quantity * item.SalePrice,
    0,
  )

  const finalPrice =
    totalCartItemPrice + (parseInt(ShippingFee) || 0) + (parseInt(GiftWrap) || 0) || 0

  const onSubmit = async (data) => {
    try {
      setAddCustomOrderState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('FullName', data?.FullName)
      bodyFormData.append('PhoneNumber', data?.PhoneNumber)
      bodyFormData.append('Address', data?.Address)
      bodyFormData.append('DivisionID', data?.DivisionID)
      bodyFormData.append('DistrictID', data?.DistrictID)
      bodyFormData.append('UpazilaID', data?.UpazilaID)
      bodyFormData.append('AdvanceAmount', data?.AdvanceAmount)
      bodyFormData.append('ShippingFee', data?.ShippingFee)
      bodyFormData.append('Products', JSON.stringify(cartItems))
      bodyFormData.append('TotalPrice', finalPrice)
      bodyFormData.append('GiftWrap', GiftWrap ? true : false)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/order/custom_order`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setAddCustomOrderState(false)
      } else {
        setAddCustomOrderState(false)
      }
    } catch (e) {
      setAddCustomOrderState(false)
    }
  }

  const divisionOptions = divisions?.map((division) => {
    return { value: division?.division_id, label: division?.name }
  })

  const districtOptions = districts?.map((district) => {
    return {
      value: district?.district_id,
      label: district?.name,
      // division_id: district?.division_id,
    }
  })

  const upazilaOptions = upazilas?.map((upazila) => {
    return {
      value: upazila?.upazila_id,
      label: upazila?.name,
      // district_id: upazila?.district_id,
    }
  })

  const errorMessages = Object.keys(errors)
  return (
    <>
      <LoadingOverlay
        active={addCustomOrderState}
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
              <div className="card-body">
                <h6 className="card-title">Customer Account Details</h6>
              </div>
              <div className="card-body">
                {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                  <div className="row">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="FullName"
                        placeholder="Enter customer name"
                        floatingLabel={<div style={{ color: '#808080' }}>Enter customer name</div>}
                        {...register('FullName', { required: true })}
                        className="my-2"
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="CustomerMobile"
                        placeholder="Enter customer phone number"
                        floatingLabel={
                          <div style={{ color: '#808080' }}>Enter customer phone number</div>
                        }
                        {...register('PhoneNumber', { required: true })}
                        className="my-2"
                      />
                    </div>
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        required
                        name="DivisionID"
                        className="my-2"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            options={divisionOptions}
                            placeholder="Select Division"
                            onChange={(option) => {
                              onChange(option.value)
                            }}
                            styles={selectCustomStyles}
                          />
                        )}
                      />
                    </div>

                    {DivisionID && (
                      <div className="col-md-6">
                        <Controller
                          control={control}
                          required
                          name="DistrictID"
                          className="my-2"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              options={districtOptions}
                              placeholder="Select District"
                              onChange={(option) => {
                                onChange(option.value)
                              }}
                              styles={selectCustomStyles}
                            />
                          )}
                        />
                      </div>
                    )}
                    {DistrictID && (
                      <div className="col-md-6 my-2">
                        <Controller
                          control={control}
                          required
                          name="UpazilaID"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              options={upazilaOptions}
                              placeholder="Select Upazila"
                              onChange={(option) => {
                                onChange(option.value)
                              }}
                              styles={selectCustomStyles}
                            />
                          )}
                        />
                      </div>
                    )}
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="CustomerMobile"
                        placeholder="Enter Advance paid amount"
                        floatingLabel={
                          <div style={{ color: '#808080' }}>Enter Advance paid amount</div>
                        }
                        {...register('AdvanceAmount', { required: true })}
                        className="my-2"
                      />
                    </div>
                    <div className="col-md-12">
                      <CFormInput
                        type="text"
                        id="CustomerMobile"
                        placeholder="Enter your full address"
                        floatingLabel={
                          <div style={{ color: '#808080' }}>Enter your full address</div>
                        }
                        {...register('Address', { required: true })}
                        className="my-2"
                      />
                    </div>
                  </div>
                  <CButton className="text-white mt-3" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-7">
              {[academicBook, subjectBook, stationaries, fashions]?.map((item, index) => {
                return (
                  <div className="card border-0 shadow-sm my-5" key={index}>
                    <div className="card-body" style={{ overflowY: 'scroll', height: '681px' }}>
                      <div>
                        {' '}
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>
                              {index === 0
                                ? 'Academic Books'
                                : index === 1
                                  ? 'Subject Books'
                                  : index === 2
                                    ? 'Stationaries'
                                    : 'Fashions'}
                            </h6>
                            <CFormInput
                              placeholder={`Search ${index === 0
                                  ? 'Academic Books'
                                  : index === 1
                                    ? 'Subject Books'
                                    : index === 2
                                      ? 'Stationaries'
                                      : 'Fashions'
                                }`}
                              onChange={(e) => {
                                if (index === 0) {
                                  setAcademicBookSearch(e.target.value)
                                } else if (index === 1) {
                                  setSubjectBookSearch(e.target.value)
                                } else if (index === 2) {
                                  setStationarySearch(e?.target?.value)
                                } else {
                                  setFashionSearch(e.target.value)
                                }
                              }}
                              className="w-50"
                            />
                          </div>
                          {item?.map((product) => (
                            <>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex">
                                  <img
                                    // className="w-25 h-75"
                                    style={{ width: '50px', height: '75px' }}
                                    src={product?.Picture}
                                    // large={book?.Picture}
                                    alt={`${product?.ProductTitle}`}
                                  />
                                  <div className="ms-3">
                                    <p
                                      className="fw-semibold"
                                      style={{ fontSize: '15px', marginBottom: '33px' }}
                                    >
                                      {product?.ProductTitle}
                                    </p>
                                    <div className="d-flex align-items-between">
                                      <p style={{ color: '#AEA9A9', fontSize: '14px' }}>
                                        <s>${product?.RegularPrice}</s>
                                      </p>
                                      <p
                                        className="ms-2 fw-semibold"
                                        style={{ fontSize: '15px', marginTop: '2px' }}
                                      >
                                        ${product?.SalePrice}
                                      </p>
                                    </div>
                                  </div>
                                </div>{' '}
                                <CButton
                                  color="primary"
                                  variant="outline"
                                  className="btn"
                                  onClick={() => addToCart(product)}
                                >
                                  Add to cart
                                </CButton>
                              </div>

                              <hr />
                            </>
                          ))}
                        </>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="col-md-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6>Bills</h6>
                  {cartItems?.map((product, index) => (
                    <div key={index} className="my-3">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <img
                            src={product?.Picture}
                            alt={product?.ProductTitle}
                            style={{ width: '50px', height: '75px' }}
                          />
                          <div className="mx-3">
                            <h5>{product?.ProductTitle}</h5>
                            <p style={{ color: gray }}>x {product?.Quantity}</p>
                            <CButton
                              color="primary"
                              variant="outline"
                              className="btn"
                              onClick={() => increaseQuantity(product)}
                            >
                              +
                            </CButton>
                            <CButton
                              color="primary"
                              variant="outline"
                              className="btn"
                              onClick={() => decreaseQuantity(product)}
                            >
                              -
                            </CButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between my-3">
                    <span>Subtotal:</span> <span>{totalCartItemPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between my-3">
                    <span>Shipping Fee:</span>{' '}
                    <CFormInput className="w-25" {...register('ShippingFee')} type="number" />
                  </div>
                  <div className="d-flex justify-content-between my-3">
                    <span>Gift Wrap:</span>{' '}
                    <CFormInput className="w-25" {...register('GiftWrap')} type="number" />
                  </div>

                  <hr className="mt-5" />
                  <div className="d-flex justify-content-between my-3">
                    <span>Total:</span> <span>৳{finalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default CustomOrders
