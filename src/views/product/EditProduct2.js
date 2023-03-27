/* eslint-disable */
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CModal,
  CModalBody,
  CRow,
  CTable,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import { Link, useParams } from 'react-router-dom'
import Select from 'react-select'
import { EDIT_PRODUCT, GET_AUTHORS, GET_BRANDS, GET_PUBLICATIONS } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { primary_orange } from '../../colors'

// eslint-disable-next-line react/prop-types
const EditProduct = ({ productType }) => {
  const { id } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm()

  const categoryID = watch('ParentCategoryID')
  // const parentCategoryID = watch('ParentCategoryID')

  const SubjectCode = { AttributeName: 'SubjectCode', AttributeValue: watch('SubjectCode') || '' }
  const ShortDesc = { AttributeName: 'ShortDesc', AttributeValue: watch('ShortDesc') || ' ' }
  const Edition = { AttributeName: 'Edition', AttributeValue: watch('Edition') || '' }
  const Class = { AttributeName: 'Class', AttributeValue: watch('Class') || '' }
  const Group = { AttributeName: 'Group', AttributeValue: watch('Group') || '' }
  const Department = { AttributeName: 'Department', AttributeValue: watch('Department') || '' }
  const PublishedDate = {
    AttributeName: 'PublishedDate',
    AttributeValue: moment(watch('PublishedDate')).format('DD/MM/YYYY') || '',
  }
  const Exam = { AttributeName: 'Exam', AttributeValue: watch('Exam') || '' }
  const Type_MAIN_ACADEMIC = {
    AttributeName: 'Type_GUIDE_BOOK/MAIN_BOOK',
    AttributeValue: watch('Type_GUIDE_BOOK/MAIN_BOOK') || '',
  }

  const cookies = new Cookies()
  const token = cookies.get('token')
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [publications, setPublications] = useState([])
  const [brands, setBrands] = useState([])
  const [attributeName, setAttributeName] = useState(null)
  const [customAttributeValues, setCustomAttributeValues] = useState([])
  const [editProductState, setEditProductState] = useState(false)
  const [addAttributeState, setAddAttributeState] = useState(false)
  const [attributes, setAttributes] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [visible, setVisible] = useState(false)
  const [product, setProduct] = useState({})
  const [selectedCategory, setSelectedCategory] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [productImage, setProductImage] = useState()
  // modal
  const [attValue, setAttValue] = useState([])
  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const onSubmit = async (data) => {
    try {
      setEditProductState(true)
      let productImg = product?.Picture
      if (typeof data?.Picture === 'object' && data?.Picture?.length !== 0) {
        const formData = new FormData()
        formData.append('file', data?.Picture[0])
        const config = {
          headers: {
            Authorization: `${token}`,
            'Access-Control-Allow-Origin': '*',
            'content-type': 'multipart/form-data',
          },
        }
        const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)

        productImg = res.data.data.mediaLink
        setProductImage(res?.data?.data?.mediaLink ? res?.data?.data?.mediaLink : product?.Picture)
      } else {
        setProductImage(product?.Picture)
      }

      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      console.log(productImage)
      // Get an array of string from categoryID where that's an array of object
      const categoryIDs = categoryID ? categoryID.map((item) => item.value) : []
      const tags = data?.Tags ? data?.Tags : []
      const bodyFormData = new FormData()
      bodyFormData.append('ProductType', data?.ProductType)
      bodyFormData.append('QuantityPerUnit', 1)
      bodyFormData.append('ProductID', id)
      bodyFormData.append('ISBNNumber', data?.ISBNNumber || ' ')
      bodyFormData.append('Edition', data?.Edition || ' ')
      // bodyFormData.append('URLSlug', `${data?.ProductTitle.replace(/\s+/g, '-').toLowerCase()}`)
      bodyFormData.append('TotalPage', 1)
      bodyFormData.append('UnitWeight', 1)
      bodyFormData.append('DiscountAvailable', false)
      bodyFormData.append('Picture', productImg)
      bodyFormData.append('ProductTitle', data?.ProductTitle)
      bodyFormData.append('ProductBanglishTitle', data?.ProductBanglishTitle)
      bodyFormData.append('ShortDesc', data?.ShortDesc ? data?.ShortDesc : '')
      bodyFormData.append('ProductDesc', content)
      bodyFormData.append('Categories', categoryIDs)
      // bodyFormData.append('ParentCategoryID', data?.ParentCategoryID ? data?.ParentCategoryID : selectedCategory)
      // bodyFormData.append('CategoryID', categoryIDs ? JSON.stringify(categoryIDs) : [])
      bodyFormData.append('RegularPrice', parseInt(`${data?.RegularPrice}`))
      bodyFormData.append('SalePrice', parseInt(`${data.SalePrice}`))
      bodyFormData.append('UnitInStock', parseInt(`${data?.UnitInStock}`))
      bodyFormData.append('ProductAvailable', data?.ProductAvailable)
      bodyFormData.append('SubjectCode', `${data?.SubjectCode}`)
      // bodyFormData.append('BrandID', data?.BrandID ? data?.BrandID : '')
      bodyFormData.append('BrandID', data?.BrandID ? parseInt(`${data?.BrandID}`) : '')
      bodyFormData.append('Note', 'note')
      bodyFormData.append('Tags', tags ? JSON.stringify(tags) : [])
      bodyFormData.append('SKU', data?.SKU ? data?.SKU : '')
      bodyFormData.append(
        'PublicationID',
        data?.PublicationID ? parseInt(`${data?.PublicationID}`) : '',
      )
      bodyFormData.append('AuthorID', data?.AuthorID ? parseInt(`${data?.AuthorID}`) : '')

      bodyFormData.append(
        'CustomAttributes',
        JSON.stringify([
          // SubjectCode,
          // Edition,
          // Class,
          // Group,
          // Department,
          // PublishedDate,
          // Exam,
          // Type_MAIN_ACADEMIC,
          ...customAttributeValues,
        ]),
      )
      console.log([
        SubjectCode,
        Edition,
        Class,
        Group,
        Department,
        PublishedDate,
        Exam,
        Type_MAIN_ACADEMIC,
        ...customAttributeValues,
      ])
      console.log("FOrmadata", bodyFormData)
      console.log(EDIT_PRODUCT)
      const res = await axiosJWT.post(EDIT_PRODUCT, bodyFormData, {
        headers: {
          Authorization: `${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res?.data?.status === 200) {
        if (typeof data?.BookPDF == 'object' && data?.BookPDF?.length !== 0) {
          const pdfBodyFormData = new FormData()
          pdfBodyFormData.append('BookPDF', data?.BookPDF[0])
          pdfBodyFormData.append('ProductID', id)

          const pdfRes = await axiosJWT.post(
            `${baseURL}/api/v1/admin/product/upload-product-pdf`,
            pdfBodyFormData,
            {
              headers: {
                Authorization: `${token}`,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        }
        setEditProductState(false)
      } else if (res?.data?.status === 403) {
        console.log(res)
        setEditProductState(false)
      } else {
        console.log(res)
        setEditProductState(false)
      }
    } catch (e) {
      setEditProductState(false)
      console.log(e)
    }
  }

  const addAttribute = async () => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', attributeName)
      bodyFormData.append('ProductType', productType)
      setAddAttributeState(true)
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/attribute/new`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setAttributes([...attributes, res?.data?.attribute])
        setAddAttributeState(false)
      } else if (res?.data?.status === 403) {
        setAddAttributeState(false)
      } else {
        setAddAttributeState(false)
      }
    } catch (e) {
      //console.log(e.message)
      setAddAttributeState(false)
    }
  }

  const loadCategories = async () => {
    const res = await trackPromise(
      axios.get(`${baseURL}/api/v1/public/category/categories?ProductType=${product?.ProductType}${selectedCategory?.value > '0' ? `&ParentCategoryID=${selectedCategory?.value}` : ''}`),
    )
    if (res?.data?.categories?.length > 0) {
      setCategories(res?.data?.categories)
    }
  }


  useEffect(() => {
    const loadAuthors = async () => {
      const response = await axiosJWT.get(GET_AUTHORS)
      setAuthors(response?.data?.authors)
    }
    loadAuthors()
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
  }, [])
  useEffect(() => {
    const loadAttributes = async () => {
      const res = await axiosJWT.get(`${baseURL}/api/v1/admin/attribute`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      if (res?.data?.attributes?.length > 0) {
        setAttributes(res?.data?.attributes)
      }
    }
    loadAttributes()
  }, [token])

  useEffect(() => {
    const loadSingleProduct = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/product/product_detail?ProductID=${id}`),
      )
      if (res?.data?.status === 200) {
        setProduct(res?.data?.product)
        console.log(res?.data?.product.CustomAttributes)
        setCustomAttributeValues(res?.data?.product.CustomAttributes)
        // setA
        reset(res?.data?.product)
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(`${res?.data?.product?.ProductDesc}`),
            ),
          ),
        )
      }
    }
    loadSingleProduct()
  }, [id, product?.ProductDesc, reset])


  console.log(product)
  useEffect(() => {
    loadCategories()
  }, [product?.ProductType, selectedCategory])
  const arr = []
  const fun = (selectedCat, num) => {
    // console.log(selectedCat)
    const childs = categories.filter((category) => category.ParentCategoryID == selectedCat)
    if (childs) {
      childs.forEach((element) => {
        arr.push({
          label: `${'-'.repeat(num)} ${element.CategoryName}`,
          value: element?.CategoryID,
        })
        fun(element.CategoryID, num + 1)
      })
    }
  }
  fun('0', 0)

  // console.log(product)

  const categoryOptions2 = categories?.map((category) => {
    return {
      value: category?.CategoryID,
      label: category?.CategoryName,
    }
  })

  const brandOptions = brands?.map((brnd) => {
    return { value: brnd?.BrandID, label: brnd?.BrandName }
  })

  const authorOptions = authors?.map((author) => {
    return { value: author?.AuthorID, label: author?.AuthorName }
  })

  const publicationOptions = publications?.map((publication) => {
    return { value: publication?.PublicationID, label: publication?.PublicationName }
  })

  // console.log(product?.CategoryID)
  const academicSelectedCategories = arr?.filter((option) => {
    if (product?.CategoryID?.includes(option.value)) {
      return option
    }
    return null
  })
  useEffect(() => {
    const filteredCategory = categories.filter((category) => category?.ParentCategoryID === selectedCategory)
    const categoryOptions = filteredCategory.map((category) => {
      return {
        value: category?.CategoryID,
        label: category?.CategoryName,
      }
    })
    setCategoryOptions(categoryOptions)
  }, [categories, selectedCategory])

  const defaultAuthor = authorOptions.filter((option) => option?.value === product?.AuthorID)
  const defaultCat = categoryOptions2.filter((option) => option?.value === product?.CategoryID?.toString())
  // console.log(defaultCat)
  const defaultPub = publicationOptions.filter(
    (option) => option?.value === product?.PublicationID?.toString(),
  )
  const defaultBrand = brandOptions.filter((option) => option?.value === product?.BrandID?.toString())
  console.log("defaultBrand", defaultBrand)
  console.log("brandOptions", brandOptions)
  return (
    <>
      <LoadingOverlay
        active={editProductState || addAttributeState}
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
        <CCard className="card border-0 shadow-sm">
          <div className="card-body">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <div className={'row'}>
                <div className={'col-md-8'}>
                  <div className={'flex flex-column'}>
                    <div>
                      <h6 className="card-title mb-4">Title and description</h6>
                      <CFormInput
                        type="text"
                        id="ProductTitle"
                        placeholder="Product Title"
                        floatingLabel="Product Title"
                        className="my-2"
                        {...register('ProductTitle')}
                      />
                      <CFormInput
                        type="text"
                        id="ProductBanglishTitle"
                        placeholder="Product Banglish Title"
                        floatingLabel="Product Banglish Title"
                        className="my-2"
                        {...register('ProductBanglishTitle')}
                      />
                      <Editor
                        editorState={editorState}
                        row={5}
                        editorClassName="editor_container"
                        placeholder="Description"
                        onEditorStateChange={onEditorStateChange}
                        handlePastedText={() => false}
                      />
                    </div>
                    <div className={'my-5'}>
                      <CRow className={'justify-content-between'}>
                        <CCol>
                          <h6 className="card-title mb-4">Product Details</h6>
                        </CCol>
                        <CCol className="text-end">
                          <CButton
                            onClick={() => setVisible(!visible)}
                            className="cursor-pointer bg-transparent border-0 fs-4 text-end"
                            style={{ color: '#000' }}
                          >
                            <FiPlus />
                          </CButton>

                          <CModal
                            alignment="center"
                            visible={visible}
                            onClose={() => setVisible(false)}
                          >
                            <CModalBody>
                              <CCardBody>
                                <h6>Create New Attribute</h6>
                                <div className="col-md-8">
                                  <CFormInput
                                    placeholder="Attribute Name"
                                    floatingLabel="Attribute Name"
                                    className="my-2"
                                    value={attributeName}
                                    onChange={(e) => {
                                      setAttributeName(e.target.value)
                                    }}
                                  />
                                </div>
                                <CButton
                                  onClick={() => addAttribute()}
                                  className="text-white"
                                  type="submit"
                                >
                                  Create
                                </CButton>
                              </CCardBody>

                              <CCardBody className="mt-4">
                                <h6 className="pb-4">Select Attributes</h6>
                                {attributes?.map((attribute, index) => (
                                  <CTable key={index}>
                                    <CTableRow>
                                      <CTableDataCell
                                        style={{
                                          borderBottom: '1px solid #ddd',
                                          paddingBottom: '18px',
                                        }}
                                        className="my-auto cursor-pointer"
                                        onClick={() => {
                                          if (customAttributeValues.filter((value) => value.AttributeName == attribute.AttributeName).length === 0) {
                                            setAttValue([...attValue, attribute?.AttributeName])
                                            setCustomAttributeValues([...customAttributeValues, { AttributeName: attribute?.AttributeName, AttributeValue: '' }])
                                          }

                                        }}
                                      >
                                        {attribute?.AttributeName}
                                      </CTableDataCell>
                                    </CTableRow>
                                  </CTable>
                                ))}
                              </CCardBody>
                            </CModalBody>
                          </CModal>
                        </CCol>
                      </CRow>
                      {product?.ProductType === 'ACADEMIC_BOOK' ? (
                        <div>
                          <div className="row">
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="AuthorID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
                                    defaultValue={defaultAuthor}
                                    options={authorOptions}
                                    placeholder="Select Author"
                                    floatingLabel="Select Author"
                                    onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                    styles={selectCustomStyles}
                                    isClearable
                                  />
                                )}
                              />
                            </div>
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="PublicationID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
                                    defaultValue={defaultPub}
                                    options={publicationOptions}
                                    placeholder="Select Publication"
                                    floatingLabel="Select Publication"
                                    onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                    styles={selectCustomStyles}
                                    isClearable
                                  />
                                )}
                              />
                            </div>
                            {
                              // sort custom attribute by attribute name
                              customAttributeValues.sort((a, b) => {
                                if (a.AttributeName < b.AttributeName) {
                                  return -1
                                }
                                if (a.AttributeName > b.AttributeName) {
                                  return 1
                                }
                                return 0
                              })?.map((attribute, index) => (
                                <div className={'col-md-6'} key={index}>
                                  <CFormInput
                                    key={index}
                                    placeholder={attribute.AttributeName}
                                    floatingLabel={attribute.AttributeName}
                                    className="my-2"
                                    value={attribute.AttributeValue}
                                    onChange={(e) => {
                                      setCustomAttributeValues([
                                        ...customAttributeValues.filter((item) => item.AttributeName !== attribute.AttributeName),
                                        {
                                          AttributeValue: e.target.value,
                                          AttributeName: attribute.AttributeName,
                                        }
                                      ])
                                    }}
                                  />
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ) : product?.ProductType === 'SUBJECT_BOOK' ? (
                        <div>
                          <div className="row">
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="AuthorID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
                                    defaultValue={defaultAuthor}
                                    options={authorOptions}
                                    placeholder="Select Author"
                                    floatingLabel="Select Author"
                                    onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                    styles={selectCustomStyles}
                                    isClearable
                                  />
                                )}
                              />
                            </div>
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="PublicationID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
                                    defaultValue={defaultPub}
                                    options={publicationOptions}
                                    placeholder="Select Publication"
                                    floatingLabel="Select Publication"
                                    onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                    styles={selectCustomStyles}
                                    isClearable
                                  />
                                )}
                              />
                            </div>
                            <div className="col-md-12">
                              <CFormInput
                                type="text"
                                id="ShortDesc"
                                placeholder="Short Description"
                                floatingLabel="Short Description"
                                className="my-2"
                                {...register('ShortDesc')}
                              />
                            </div>
                            <div className="col-md-12">
                              <CFormTextarea
                                type="text"
                                id="Tags"
                                rows="3"
                                placeholder="Tags: Use enter to seperate each "
                                floatingLabel="Tags: Use enter to seperate each"
                                style={selectCustomStyles}
                                className="my-2"
                                {...register('Tags')}
                              />
                            </div>
                          </div>
                        </div>
                      ) : product?.ProductType === 'STATIONARY' ||
                        product?.ProductType === 'FASHION' ? (
                        <div>
                          <div className="col-md-6">
                            <Controller
                              control={control}
                              name="BrandID"
                              render={({ field: { onChange, value, ref, name } }) => (
                                <Select
                                  className="my-2"
                                  defaultValue={defaultBrand}
                                  options={brandOptions}
                                  placeholder="Select Brand"
                                  onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                  styles={selectCustomStyles}
                                  isClearable
                                />
                              )}
                            />
                          </div>

                          <div className="col-md-12">
                            <CFormInput
                              type="text"
                              id="ShortDesc"
                              placeholder="Short Description"
                              floatingLabel="Short Description"
                              className="my-2"
                              {...register('ShortDesc')}
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                <div className={'col-md-4'}>
                  <div className={'flex flex-column'}>
                    <div>
                      {' '}
                      <h6 className="card-title mb-4">Category </h6>
                      {product?.ProductType == "ACADEMIC_BOOK" ? (
                        <>
                          {defaultCat?.length > 0 && (
                            <>
                              <Controller
                                control={control}
                                name="CategoryID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    defaultValue={defaultCat}
                                    isClearable
                                    options={[{ label: 'No Parent', value: '0' }, ...categoryOptions]}
                                    // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                                    placeholder="Parent Category"
                                    onChange={(option) => {
                                      onChange([option])
                                      // console.log(option)
                                      setSelectedCategory(option.value)
                                    }}
                                    styles={selectCustomStyles}
                                  />
                                )}
                              />
                            </>
                          )}

                        </>
                      ) : (
                        <>
                          {academicSelectedCategories.length > 0 && (
                            <>
                              <Controller
                                control={control}
                                name="CategoryID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    defaultValue={academicSelectedCategories}
                                    isClearable
                                    options={arr}
                                    // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                                    placeholder="Parent Category"
                                    onChange={(option) => {
                                      onChange(option)
                                    }}
                                    styles={selectCustomStyles}
                                    isMulti
                                  />
                                )}
                              />
                            </>
                          )}
                        </>
                      )}
                      {/* {academicSelectedCategories.length > 0 ? (
                        <>
                          <Controller
                            control={control}
                            name="ParentCategoryID"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                defaultValue={academicSelectedCategories}
                                isClearable
                                options={arr}
                                // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                                placeholder="Parent Category"
                                onChange={(option) => {
                                  onChange(option)
                                }}
                                styles={selectCustomStyles}
                                isMulti
                              />
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )} */}
                    </div>
                    <div className={'my-5'}>
                      <h6 className="card-title mb-4">Images and Pricing</h6>
                      <CFormInput
                        type="file"
                        accept="image/*"
                        id="Picture"
                        className={'my-3 form-control-lg rounded-0'}
                        name="Picture"
                        {...register('Picture')}
                      />
                      <CFormInput
                        type="text"
                        id="RegularPrice"
                        placeholder="Regular Price"
                        floatingLabel="Regular Price"
                        className={'my-2'}
                        {...register('RegularPrice')}
                      />
                      <CFormInput
                        type="text"
                        id="SalePrice"
                        placeholder="Sale Price"
                        floatingLabel="Sale Price"
                        className={'my-2'}
                        {...register('SalePrice')}
                      />
                      <CFormInput
                        type="text"
                        id="UnitInStock"
                        placeholder="Unit in stock"
                        floatingLabel="Unit in stock"
                        className={'my-2'}
                        {...register('UnitInStock')}
                      />
                      <CFormSwitch
                        label="Available in stock"
                        id="ProductAvailable"
                        {...register('ProductAvailable')}
                      />
                      {
                        ['ACADEMIC_BOOK', 'SUBJECT_BOOK'].includes(product?.ProductType) ? (
                          <>
                            <label className="form-label mt-2">Upload PDF</label>
                            <CFormInput
                              type="file"
                              id="BookPDF"
                              className={'form-control-lg rounded-0'}
                              name="BookPDF"
                              {...register('BookPDF', { required: false })}
                            />
                            <span>PDF URL: </span><a href={product?.BookPDF}>{product?.BookPDF ? product?.BookPDF : 'PDF not available'}</a>
                          </>
                        ) : null
                      }
                    </div>
                  </div>
                </div>
              </div>
              <CButton className="text-white" type="submit">
                Update Product
              </CButton>
              <Link to="/product/view-product">
                <CButton
                  className="text-primary border-1 border-primary ms-2"
                  style={{ background: 'none' }}
                >
                  Cancel
                </CButton>
              </Link>
            </CForm>
          </div>
        </CCard>
      </LoadingOverlay >
    </>
  )
}

export default EditProduct
