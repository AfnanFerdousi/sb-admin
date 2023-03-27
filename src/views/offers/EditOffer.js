/* eslint-disable */
import { CButton, CForm, CFormInput, CFormTextarea } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Controller, useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'
import moment from 'moment'

const EditOffer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm()
  const [offers, setOffers] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editOfferState, setEditOfferState] = useState(false)
  const offerType = watch('OfferType')
  const [offer, setOffer] = useState({})

  const cookies = new Cookies()
  const token = cookies.get('token')
  const { id } = useParams()

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)


  useEffect(() => {
    const loadOffers = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v1/public/offer/offers`)
        if (res.status === 200) {
          setOffers(res?.data?.offers)
        }
      } catch (e) {
        console.log('Something was wrong', e)
      }
    }
    const loadProducts = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v1/public/product/home_page_product?limit=100000000`,
        )
        if (res.status === 200) {
          setProducts(res?.data?.products)
        }
      } catch (e) {
        console.log('Something was wrong', e)
      }
    }

    loadOffers()
    loadProducts()
  }, [token])

  useEffect(() => {
    const loadSingleOffer = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/offer/offer?OfferID=${id}`),
      )
      if (res?.data?.status === 200) {
        setOffer(res?.data?.offer)
        const {
          OfferName,
          OfferDesc,
          DiscountPercent,
          OfferStartingDate,
          OfferEndingDate,
          OfferType,
        } = res?.data?.offer
        reset({
          OfferName,
          OfferDesc,
          DiscountPercent,
          OfferType,
          // OfferStartingDate: moment(OfferStartingDate, 'DD-MM-YYYY'),
          // OfferEndingDate: moment(OfferEndingDate, 'DD-MM-YYYY'),
        })

        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(`${res?.data?.offer?.OfferDesc}`),
            ),
          ),
        )
      } else {

      }
    }
    loadSingleOffer()
  }, [id])

  useEffect(() => {
    const loadCategories = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/category/categories`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.categories?.length > 0) {
        setCategories([...categories, ...res?.data?.categories])
      }
    }

    loadCategories()
  }, [token])

  const onSubmit = async (data) => {
    try {
      setEditOfferState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      const newProducts = data?.Products?.map((product) => {
        return product.id
      })
      const newCategories = data?.Categories?.map((category) => {
        return category?.CategoryID
      })
      const bodyFormData = new FormData()
      id && bodyFormData.append('OfferID', id)
      data?.OfferName && bodyFormData.append('OfferName', data?.OfferName)
      bodyFormData.append('OfferDesc', content)
      data?.DiscountPercent && bodyFormData.append('DiscountPercent', data?.DiscountPercent)
      data?.OfferStartingDate &&
        bodyFormData.append('OfferStartingDate', Date(data?.OfferStartingDate))
      data?.OfferEndingDate && bodyFormData.append('OfferEndingDate', data?.OfferEndingDate)
      data?.OfferType && bodyFormData.append('OfferType', data?.OfferType)
      if (data?.Categories) {
        console.log(newCategories.toString())
        bodyFormData.append(
          'Categories',
          data?.OfferType === 'CATEGORY' && newCategories.toString(),
        )
      } else if (data?.Products) {
        //console.log(newProducts.toString())
        bodyFormData.append('Products', data?.OfferType === 'PRODUCT' && newProducts.toString())
      }

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/offer/edit/`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setEditOfferState(false)
        setOffers([...offers, res.data?.offer])
      } else {
        setEditOfferState(false)

      }
    } catch (e) {
      console.log(e)
      setEditOfferState(false)
    }
  }

  const productOptions = products?.map((product) => {
    return {
      label: product.ProductTitle,
      value: product.ProductID,
    }
  })
  const catOptions = categories?.map((category) => {
    return {
      label: category.CategoryName,
      value: category.CategoryID,
    }
  })
  const typeOptions = [
    { label: 'Category', value: 'CATEGORY' },
    { label: 'Product', value: 'PRODUCT' },
  ]
  const selectedCategories = catOptions?.filter((option) => {
    if (offer?.Categories?.includes(option.value)) {
      return option
    }
    return null
  })
  console.log("cats", selectedCategories)

  console.log("offer cats", offer?.Categories)
  console.log(offer)

  const selectedProducts = productOptions?.filter((option) => {
    if (offer?.Categories?.includes(option?.value)) {
      return option
    }
    return null
  })
  console.log("products", selectedProducts)

  const defaultType = typeOptions.filter((option) => option?.value === offer?.OfferType)
  const offerStart = moment(offer?.OfferStartingDate).format('MM/DD/YYYY')
  const offerEnd = moment(offer?.OfferEndingDate).format('MM/DD/YYYY')
  const defaultDate = new Date();
  return (
    <LoadingOverlay
      active={editOfferState}
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
      <div>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="card-title">Edit Offers</h6>
          </div>
          <div className="card-body">
            <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
              <div className="row">
                <div className="col-md-6">
                  <CFormInput
                    type="text"
                    id="OfferName"
                    name={'OfferName'}
                    placeholder="Offer Name"
                    floatingLabel={<div style={{ color: '#808080' }}>Offer Name</div>}
                    {...register('OfferName')}
                    className="my-3"
                  />
                  <Editor
                    editorState={editorState}
                    rows={5}
                    editorClassName="editor_container"
                    placeholder="Description"
                    onEditorStateChange={onEditorStateChange}
                    handlePastedText={() => false}
                  />
                  {/* Select tag here */}
                </div>
                <div className="col-md-6">
                  <div className="row my-3">
                    <div className="col-md-6" style={{ border: '.5px solid #808080' }}>
                      {offer?.OfferStartingDate !== " " && offerStart !== " " && (
                        <>
                          <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>Start date</label>
                          <Controller
                            control={control}
                            name="OfferStartingDate"
                            render={({ field }) => (
                              <DatePicker
                                placeholderText="start date"
                                onChange={(date) => field.onChange(date)}
                                isClearable
                                value={field?.value ? field?.value : offerStart}
                                selected={field?.value}
                                className="form-control"
                                wrapperClassName="date_picker"
                              />
                            )}
                          />
                        </>
                      )}

                    </div>
                    <div className="col-md-6">
                      {offer?.OfferEndingDate !== " " && offerStart !== " " && (
                        <>
                          <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>End date</label>
                          <Controller
                            control={control}
                            name="OfferEndingDate"
                            render={({ field }) => (
                              <DatePicker
                                placeholderText="End date"
                                onChange={(date) => field.onChange(date)}
                                isClearable
                                value={field?.value ? field?.value : offerEnd}
                                selected={field?.value}
                                className="form-control"
                                wrapperClassName="date_picker"
                              />
                            )}
                          /></>
                      )}

                    </div>
                  </div>
                  <CFormInput
                    type="text"
                    id="DiscountPercent"
                    floatingLabel={<div style={{ color: '#808080' }}>Discount (Put the value only, not percent)</div>}
                    {...register('DiscountPercent')}
                    className="my-3"
                  />
                  {defaultType.length > 0 &&
                    (<Controller
                      control={control}
                      name="OfferType"
                      render={({ field: { onChange, value, ref, name } }) => (
                        <Select
                          defaultValue={defaultType}
                          options={typeOptions}
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
                    />)
                  }
                  {offerType === 'PRODUCT' && selectedProducts !== " " && (
                    <Controller
                      control={control}
                      name="Products"
                      render={({ field: { onChange, value, ref, name } }) => (
                        <Select
                          defaultValue={selectedProducts}
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
                  {offerType === 'CATEGORY' && selectedCategories !== " " && (
                    <Controller
                      control={control}
                      name="Categories"
                      render={({ field: { onChange, value, ref, name } }) => (
                        <Select
                          defaultValue={selectedCategories}
                          options={catOptions}
                          placeholder={
                            <div>Select Categories</div>
                          }
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
                </div>
              </div>
              <CButton className="text-white my-3" type="submit">
                Update
              </CButton>
            </CForm>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  )
}

export default EditOffer
