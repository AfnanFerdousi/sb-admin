/* eslint-disable */
import {
  CAlert,
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
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Editor } from 'react-draft-wysiwyg'
import axios from 'axios'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import Select from 'react-select'
import {
  ADD_NEW_PRODUCT,
  GET_AUTHORS,
  GET_BRANDS,
  GET_CATEGORIES_BY_SUBJECT,
  GET_PUBLICATIONS,
} from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { primary_orange } from '../../colors'

// eslint-disable-next-line react/prop-types
const CommonAddProduct = ({ productType }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm()

  // Form values

  const categoryID = watch('CategoryID')
  // console.log(categoryID)

  const SubjectCode = { AttributeName: 'SubjectCode', AttributeValue: watch('SubjectCode') }
  const ShortDesc = { AttributeName: 'ShortDesc', AttributeValue: watch('ShortDesc') }
  const Edition = { AttributeName: 'Edition', AttributeValue: watch('Edition') }
  const Class = { AttributeName: 'Class', AttributeValue: watch('Class') }
  const Group = { AttributeName: 'Group', AttributeValue: watch('Group') }
  const Department = { AttributeName: 'Department', AttributeValue: watch('Department') }
  const PublishedDate = {
    AttributeName: 'PublishedDate',
    AttributeValue: moment(watch('PublishedDate')).format('DD/MM/YYYY'),
  }
  const Exam = { AttributeName: 'Exam', AttributeValue: watch('Exam') }
  const Type_MAIN_ACADEMIC = {
    AttributeName: 'Type_GUIDE_BOOK/MAIN_BOOK',
    AttributeValue: watch('Type_GUIDE_BOOK/MAIN_BOOK'),
  }

  // Cookie
  const cookies = new Cookies()
  const token = cookies.get('token')

  // State declaration
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [publications, setPublications] = useState([])
  const [brands, setBrands] = useState([])
  const [attributeName, setAttributeName] = useState(null)
  // Input value + attribute name also
  const [customAttributeValues, setCustomAttributeValues] = useState([])
  const [addProductState, setAddProductState] = useState(false)
  const [addAttributeState, setAddAttributeState] = useState(false)
  const [attributes, setAttributes] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [visible, setVisible] = useState(false)
  // modal
  const [attValue, setAttValue] = useState([])
  const errorMessages = Object.keys(errors)

  const [selectedCategory, setSelectedCategory] = useState([])
  const [filteredCategoryOptions, setFilteredCategoryOptions] = useState([])

  const loadCategories = async () => {
    const res = await trackPromise(
      axios.get(`${baseURL}/api/v1/public/category/categories?ProductType=${productType}${selectedCategory?.value > '0' ? `&ParentCategoryID=${selectedCategory?.value}` : ''}`),
    )
    if (res?.data?.categories?.length > 0) {
      setCategories(res?.data?.categories)
    }
  }

  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const onSubmit = async (data) => {
    // console.log(data)
    try {
      setAddProductState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.Picture[0])


      const imageRes = data?.Picture[0] && await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      if (imageRes?.data?.status !== 200) {
        setAddProductState(false)
        return
      }

      // Get an array of string from categoryID where that's an array of object
      // const categoryIDs = typeof categoryID === "object" ? categoryID.map((item) => item.value) : [categoryID]
      const categoryIDs = categoryID ? categoryID.map((item) => item.value) : []
      console.log(categoryID)
      const tags = data?.Tags ? data?.Tags : " "

      const bodyFormData = new FormData()

      bodyFormData.append('ProductType', productType)
      bodyFormData.append('Picture', imageRes?.data?.data?.mediaLink)
      bodyFormData.append('ProductTitle', data?.ProductTitle)
      bodyFormData.append('ProductBanglishTitle', data?.ProductBanglishTitle)
      bodyFormData.append('ShortDesc', data?.ShortDesc)
      bodyFormData.append('ProductDesc', content)
      bodyFormData.append('Categories', JSON.stringify(categoryIDs))
      // bodyFormData.append('ParentCategoryID', selectedCategory ? selectedCategory : '')
      bodyFormData.append('RegularPrice', parseInt(`${data?.RegularPrice}`))
      bodyFormData.append('SalePrice', parseInt(`${data.SalePrice}`))
      bodyFormData.append('UnitInStock', parseInt(`${data?.UnitInStock}`))
      bodyFormData.append('ProductAvailable', data?.ProductAvailable)
      bodyFormData.append('SubjectCode', data?.SubjectCode)
      bodyFormData.append('BrandID', data?.BrandID ? data?.BrandID : '')
      bodyFormData.append('Note', 'note')
      bodyFormData.append('Tags', tags)
      bodyFormData.append('SKU', data?.SKU)
      bodyFormData.append(
        'PublicationID',
        data?.PublicationID ? parseInt(`${data?.PublicationID}`) : '',
      )
      bodyFormData.append('AuthorID', data?.AuthorID ? parseInt(`${data?.AuthorID}`) : '')
      bodyFormData.append('ProductStatus', data?.ProductStatus ? data?.ProductStatus : '')
      bodyFormData.append(
        'CustomAttributes',
        JSON.stringify([
          SubjectCode,
          Edition,
          Class,
          Group,
          Department,
          PublishedDate,
          Exam,
          ShortDesc,
          Type_MAIN_ACADEMIC,
          ...customAttributeValues,
        ]),
      )

      const res = await axiosJWT.post(ADD_NEW_PRODUCT, bodyFormData, {
        headers: {
          Authorization: `${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res?.data?.status === 200) {
        if (data?.BookPDF[0]) {
          const pdfBodyFormData = new FormData()
          pdfBodyFormData.append('BookPDF', data?.BookPDF[0])
          pdfBodyFormData.append('ProductID', res?.data?.data?.ProductID)

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
          if (pdfRes?.data?.status === 200) {
            setAddProductState(false)
            history.push('/admin/products')
          }
        }
        setAddProductState(false)

      } else if (res?.data?.status === 403) {
        setAddProductState(false)
      } else {
        setAddProductState(false)
      }
    } catch (e) {
      console.log(e)
      setAddProductState(false)
    }
  }

  const onSubmit2 = async () => {
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
      // setAttributes(res?.data?.attributes)
      if (res?.data?.attributes?.length > 0) {
        setAttributes(res?.data?.attributes)
      }
    }
    loadAttributes()
  }, [token])

  useEffect(() => {
    loadCategories()
  }, [productType, selectedCategory])
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

  const brandOptions = brands?.map((brnd) => {
    return { value: brnd?.BrandID, label: brnd?.BrandName }
  })

  const authorOptions = authors?.map((author) => {
    return { value: author?.AuthorID, label: author?.AuthorName }
  })

  const publicationOptions = publications?.map((publication) => {
    return { value: publication?.PublicationID, label: publication?.PublicationName }
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
  // const tempSelectedCat = selectedCategory.push(option)
  // console.log(tempSelectedCat)
  return (
    <>
      <LoadingOverlay
        active={addProductState || addAttributeState}
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
          {errorMessages.length > 0 && <CAlert>Please fill the required fields</CAlert>}
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
                        name={'ProductTitle'}
                        placeholder="Product Title"
                        floatingLabel="Product Title"
                        className="my-2"
                        {...register('ProductTitle', { required: 'Product Title required' })}
                      />
                      <CFormInput
                        type="text"
                        id="ProductBanglishTitle"
                        placeholder="Product Banglish Title"
                        floatingLabel="Product Banglish Title"
                        className="my-2"
                        {...register('ProductBanglishTitle', { required: true })}
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
                                  onClick={() => onSubmit2()}
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
                                        onClick={() =>
                                          setAttValue([...attValue, attribute?.AttributeName])
                                        }
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
                      <div className="row ">
                        {attValue.map((attribute, index) => (
                          <div className={'col-md-6'} key={index}>
                            <CFormInput
                              key={index}
                              placeholder={attribute}
                              floatingLabel={attribute}
                              className="my-2"
                              onChange={(e) => {
                                const attributes = customAttributeValues.filter(
                                  (item) => item.index !== index,
                                )
                                setCustomAttributeValues([
                                  ...attributes,
                                  {
                                    AttributeValue: e.target.value,
                                    AttributeName: attribute,
                                    index: index,
                                  },
                                ])
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {productType === 'ACADEMIC_BOOK' ? (
                        <div>
                          <div className="row">
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="AuthorID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
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
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="SKU"
                                placeholder="SKU"
                                floatingLabel="SKU"
                                style={selectCustomStyles}
                                className="my-2"
                                {...register('SKU')}
                              />
                            </div>

                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="SubjectCode"
                                placeholder="Subject Code"
                                floatingLabel="Subject Code"
                                style={selectCustomStyles}
                                className="my-2"
                                {...register('SubjectCode')}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Edition"
                                placeholder="Edition"
                                floatingLabel="Edition"
                                className="my-2"
                                {...register('Edition')}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Class"
                                placeholder="Class"
                                floatingLabel="Class"
                                className="my-2"
                                {...register('Class')}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Group"
                                placeholder="Group"
                                floatingLabel="Group"
                                className="my-2"
                                {...register('Group')}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Department"
                                placeholder="Department"
                                floatingLabel="Department"
                                className="my-2"
                                {...register('Department')}
                              />
                            </div>
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="PublishedDate"
                                render={({ field }) => (
                                  <DatePicker
                                    placeholderText="Published Date"
                                    // onChange={(date) =>  }
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    className="form-control"
                                    wrapperClassName="date_picker"
                                  />
                                )}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Exam"
                                placeholder="Exam"
                                floatingLabel="Exam"
                                className="my-2"
                                {...register('Exam')}
                              />
                            </div>
                            <div className="col-md-6">
                              <CFormInput
                                type="text"
                                id="Type_GUIDE_BOOK/MAIN_BOOK"
                                placeholder="Guide Book/Main Book"
                                floatingLabel="Guide Book/Main Book"
                                className="my-2"
                                {...register('Type_GUIDE_BOOK/MAIN_BOOK')}
                              />
                            </div>
                            <div className="col-md-12">
                              <CFormTextarea
                                type="text"
                                id="Tags"
                                rows="3"
                                placeholder="Tags: Use coma to seperate each "
                                floatingLabel="Tags: Use coma to seperate each"
                                style={selectCustomStyles}
                                className="my-2"
                                {...register('Tags')}
                              />
                            </div>
                            <div className="col-md-12">
                              <CFormInput
                                type="text"
                                id="ShortDesc"
                                placeholder="Short Description"
                                floatingLabel="Short Description"
                                className="my-2"
                                {...register('ShortDesc', { required: true })}
                              />
                            </div>
                          </div>
                        </div>
                      ) : productType === 'SUBJECT_BOOK' ? (
                        <div>
                          <div className="row">
                            <div className="col-md-6">
                              <Controller
                                control={control}
                                name="AuthorID"
                                render={({ field: { onChange, value, ref, name } }) => (
                                  <Select
                                    className="my-2"
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
                                {...register('ShortDesc', { required: true })}
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
                      ) : productType === 'STATIONARY' || productType === 'FASHION' ? (
                        <div>
                          <div className="col-md-6">
                            <Controller
                              control={control}
                              name="BrandID"
                              render={({ field: { onChange, value, ref, name } }) => (
                                <Select
                                  className="my-2"
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
                              {...register('ShortDesc', { required: true })}
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
                      <h6 className="card-title mb-4">Category</h6>
                      {productType == "ACADEMIC_BOOK" ? (
                        <>
                          <Controller
                            control={control}
                            name="CategoryID"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={[{ label: 'No Parent', value: '0' }, ...categoryOptions]}
                                // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                                placeholder="Parent Category"
                                onChange={(option) => {
                                  onChange([option])
                                  console.log(option)
                                  setSelectedCategory(option.value)
                                }}
                                styles={selectCustomStyles}
                              />
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <Controller
                            control={control}
                            name="CategoryID"
                            render={({ field: { onChange, value, ref, name } }) => (
                              <Select
                                options={arr}
                                placeholder="Parent Category"
                                onChange={(option) => {
                                  onChange(option)
                                }}
                                required={true}
                                styles={selectCustomStyles}
                                isMulti
                              />
                            )}
                          />
                        </>
                      )}


                    </div>
                    <div className={'my-5'}>
                      <h6 className="card-title mb-4">Images and Pricing</h6>
                      <CFormInput
                        type="file"
                        accept="image/*"
                        id="Picture"
                        className={'my-3 form-control-lg rounded-0'}
                        name="Picture"
                        {...register('Picture', { required: true })}
                      />
                      <CFormInput
                        type="text"
                        id="RegularPrice"
                        placeholder="Regular Price"
                        floatingLabel="Regular Price"
                        className={'my-2'}
                        {...register('RegularPrice', { required: true })}
                      />
                      <CFormInput
                        type="text"
                        id="SalePrice"
                        placeholder="Sale Price"
                        floatingLabel="Sale Price"
                        className={'my-2'}
                        {...register('SalePrice', { required: true })}
                      />
                      <CFormInput
                        type="text"
                        id="UnitInStock"
                        placeholder="Unit in stock"
                        floatingLabel="Unit in stock"
                        className={'my-2'}
                        {...register('UnitInStock', { required: true })}
                      />
                      <CFormSwitch
                        label="Available in stock"
                        id="ProductAvailable"
                        {...register('ProductAvailable')}
                      />
                      {
                        ['ACADEMIC_BOOK', 'SUBJECT_BOOK'].includes(productType) ? (
                          <>
                            <label className="form-label mt-2">Upload PDF</label>
                            <CFormInput
                              type="file"
                              id="BookPDF"
                              className={'form-control-lg rounded-0'}
                              name="BookPDF"
                              {...register('BookPDF', { required: false })}
                            />
                          </>
                        ) : null
                      }
                    </div>
                  </div>
                </div>
              </div>
              <CButton className="text-white" type="submit">
                Upload Product
              </CButton>
            </CForm>
          </div>
        </CCard>
      </LoadingOverlay>
    </>
  )
}

export default CommonAddProduct
