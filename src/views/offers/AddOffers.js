/* eslint-disable */
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'
import Paginate from '../product/Paginate';

const AddOffer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm()
  const [offers, setOffers] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [addOfferState, setAddOfferState] = useState(false)
  const [deleteOfferState, setDeleteOfferState] = useState(false)
  const offerType = watch('OfferType')
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const [productsPerPage] = useState(10)
  const [currentProduct, setCurrentPage] = useState(1)
  const indexOfLastProduct = currentProduct * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  // uncomment it after getting api
  const currentOffers = offers.slice(indexOfFirstProduct, indexOfLastProduct)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const navigate = useNavigate()

  const loadOffers = async () => {
    try {
      const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/offer/offers?limit=1000000`))
      if (res.status === 200) {
        setOffers(res?.data?.offers)
      }
    } catch (e) {
      //console.log('Something was wrong')
    }
  }


  const onSubmit = async (data) => {
    console.log(data)
    try {
      setAddOfferState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const newProducts = data?.Products?.map((product) => {
        return product.value
      })
      const newCategories = data?.Categories?.map((category) => {
        return category?.value
      })
      const bodyFormData = new FormData()
      bodyFormData.append('OfferName', data?.OfferName)
      bodyFormData.append('OfferDesc', content)
      bodyFormData.append('DiscountPercent', data?.DiscountPercent)
      bodyFormData.append('OfferStartingDate', data?.OfferStartingDate)
      bodyFormData.append('OfferEndingDate', data?.OfferEndingDate)
      bodyFormData.append('OfferType', data?.OfferType)
      if (data?.Categories) {
        //console.log(newCategories.toString())
        bodyFormData.append(
          'Categories',
          data?.OfferType === 'CATEGORY' && newCategories.toString(),
        )
      } else if (data?.Products) {
        //console.log(newProducts.toString())
        bodyFormData.append('Products', data?.OfferType === 'PRODUCT' && newProducts.toString())
      }

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/offer/new`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setAddOfferState(false)
        //swal('Success!', 'Offer Created')
        setOffers([...offers, res.data?.offer])
        loadOffers()
      } else {
        setAddOfferState(false)

      }
    } catch (e) {
      setAddOfferState(false)

    }
  }

  const offerDeleted = async (id) => {
    try {
      setDeleteOfferState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('OfferID', id)

      const deleted = await axiosJWT.delete(`${baseURL}/api/v1/admin/offer/delete`, {
        data: bodyFormData,
        headers: {
          Authorization: `${token}`,
        },
      })
      if (deleted?.data?.status === 200) {
        setDeleteOfferState(false)
        //swal('Success!', 'Offer Deleted')
        setOffers(offers.filter((offer) => offer?.OfferID !== id))
      } else {
        setDeleteOfferState(false)

      }
    } catch (e) {
      setDeleteOfferState(false)

    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v1/public/product/home_page_product?limit=100000000`,
        )
        if (res.status === 200) {
          setProducts(res?.data?.products)
        }
      } catch (e) {
        //console.log('Something was wrong')
      }
    }
    loadOffers()
    loadProducts()
  }, [token])

  useEffect(() => {
    const loadCategories = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/category/categories`),
      )
      if (res?.data?.categories?.length > 0) {
        setCategories(res?.data?.categories)
        console.log(res?.data?.categories)
      }
    }
    loadCategories()
  }, [])

  const productOptions = products?.map((product) => {
    return {
      label: product.ProductTitle,
      value: product.ProductID,
    }
  })
  const catOptions = categories?.map((category) => {
    return {
      label: category?.CategoryName,
      value: category?.CategoryID,
    }
  })

  const arr = []
  const fun = (selectedCat, num) => {
    // console.log(selectedCat)
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

  const errorMessages = Object.keys(errors)

  // const offerEditHandler = (offer) => {
  //   navigate(`/edit-offer/${offer?.offerID}`, { state: offer })
  // }
  return (
    <>
      <LoadingOverlay
        active={addOfferState || deleteOfferState}
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
                <h6 className="card-title">Add Offers</h6>
              </div>
              <div className="card-body">
                {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                  <div className="row">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="OfferName"
                        placeholder="Offer Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Offer Name</div>}
                        {...register('OfferName', { required: true })}
                        className="my-3"
                      />
                      <Editor
                        editorState={editorState}
                        rows={5}
                        placeholder="Description"
                        editorClassName="editor_container"

                        onEditorStateChange={onEditorStateChange}
                        handlePastedText={() => false}
                      />
                      {/* Select tag here */}
                    </div>
                    <div className="col-md-6">
                      <div className="row my-3">
                        <div className="col-md-6">
                          <Controller
                            control={control}
                            name="OfferStartingDate"
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
                        <div className="col-md-6">
                          <Controller
                            control={control}
                            name="OfferEndingDate"
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
                      <CFormInput
                        type="text"
                        id="DiscountPercent"
                        placeholder="Discount (Put the value only, not percent)"
                        floatingLabel={<div style={{ color: '#808080' }}>Discount (Put the value only, not percent)</div>}
                        {...register('DiscountPercent', { required: true })}
                        className="my-3"
                      />
                      <Controller
                        control={control}
                        name="OfferType"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            options={[
                              { label: 'Category', value: 'CATEGORY' },
                              { label: 'Product', value: 'PRODUCT' },
                            ]}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Offer Type</div>}
                            placeholder="Offer Type"
                            isSearchable={false}
                            className="my-3"
                            onChange={(option) => {
                              onChange(option.value)
                            }}
                            styles={selectCustomStyles}
                          />
                        )}
                      />
                      {offerType === 'PRODUCT' && (
                        <Controller
                          control={control}
                          name="Products"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              options={productOptions}
                              // placeholder={<div style={{ marginTop: '-8px' }}>Select Products</div>}
                              placeholder="Select Products"
                              isSearchable={true}
                              isMulti
                              className="my-3"
                              onChange={(option) => {
                                onChange(option)

                              }}
                              styles={selectCustomStyles}
                            />
                          )}
                        />
                      )}
                      {offerType === 'CATEGORY' && (
                        <Controller
                          control={control}
                          name="Categories"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              options={arr}
                              // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                              placeholder="Select Categories"
                              isSearchable={true}
                              isMulti
                              onChange={(option) => {
                                onChange(option)
                                // setSelectedCategory(option)
                              }}
                              styles={selectCustomStyles}
                            />
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <CButton className="text-white my-3" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {promiseInProgress === false ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Manage Offers</h6>
                </div>
                <div className="card-body">
                  <CTable>
                    <CTableHead>
                      <CTableRow style={{ background: '#F3F5F9' }}>
                        <CTableHeaderCell className="py-3" scope="col">
                          Offer Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Total Products
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Discount
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Ends In
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentOffers.reverse().map((offer, index) => (
                        <>
                          <CTableRow key={index}>
                            <CTableHeaderCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                              scope="row"
                            >
                              {offer?.OfferName}
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {offer?.Products?.length}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {offer?.DiscountPercent}%
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {moment(offer?.OfferEndingDate).calendar()}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                style={{ color: '#8E98AA' }}
                                onClick={() => offerDeleted(offer?.OfferID)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                              <Link 
                              to={`/edit-offer/${offer?.OfferID}`}
                              >
                                <FiEdit3 className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                  style={{ color: '#8E98AA' }} />
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      ))}
                    </CTableBody>
                  </CTable>
                  <Paginate
                    productsPerPage={productsPerPage}
                    totalProducts={offers?.length}
                    paginate={paginate}
                  />
                </div>
              </div>
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
      </LoadingOverlay>
    </>
  )
}

export default AddOffer
