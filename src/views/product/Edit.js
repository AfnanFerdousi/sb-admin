/* eslint-disable */
import {
  CButton,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSwitch,
  CModal,
  CModalBody,
  CRow,
  CTable,
  CTableDataCell,
  CTableRow
} from '@coreui/react'
import axios from 'axios'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import {
  EDIT_PRODUCT,
  GET_AUTHORS,
  GET_BRANDS,
  GET_CATEGORIES_BY_SUBJECT,
  GET_PUBLICATIONS
} from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { primary_orange } from '../../colors'

// eslint-disable-next-line react/prop-types
const CommonAddProduct = ({ productType }) => {
  const { id } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm()

  // Form values
  const subjectID = watch('SubjectID')

  // Cookie
  const cookies = new Cookies()
  const token = cookies.get('token')

  // State declaration
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [publications, setPublications] = useState([])
  const [brands, setBrands] = useState([])
  const [attributeName, setAttributeName] = useState(null)
  const [product, setProduct] = useState({})
  const [customAttributeValues, setCustomAttributeValues] = useState([])
  const [addProductState, setAddProductState] = useState(false)
  const [addAttributeState, setAddAttributeState] = useState(false)
  const [attributes, setAttributes] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [visible, setVisible] = useState(false)
  const [attValue, setAttValue] = useState([])

  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const onSubmit = async (data) => {
    try {
      setAddProductState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const bodyFormData = new FormData()
      bodyFormData.append('ProductID', data?.ProductID)
      bodyFormData.append('SKU', 'SKU')
      bodyFormData.append('ProductType', data?.ProductType)
      bodyFormData.append('Picture', data?.Picture[0])
      bodyFormData.append('ProductTitle', data?.ProductTitle)
      bodyFormData.append('ProductBanglishTitle', data?.ProductBanglishTitle)
      bodyFormData.append('ProductDesc', content)
      bodyFormData.append('CategoryID', data?.CategoryID)
      bodyFormData.append('RegularPrice', parseInt(`${data?.RegularPrice}`))
      bodyFormData.append('SalePrice', parseInt(`${data.SalePrice}`))
      bodyFormData.append('UnitInStock', parseInt(`${data?.UnitInStock}`))
      bodyFormData.append('UnitWeight', parseInt(`${data?.UnitWeight}`))
      bodyFormData.append('QuantityPerUnit', parseInt(`${data?.QuantityPerUnit}`))
      bodyFormData.append('ProductAvailable', data?.ProductAvailable)
      bodyFormData.append('BrandID', data?.BrandID ? data?.BrandID : '')
      bodyFormData.append('Note', 'note')
      bodyFormData.append('Tags', data?.Tags)
      bodyFormData.append(
        'PublicationID',
        data?.PublicationID ? parseInt(`${data?.PublicationID}`) : '',
      )
      bodyFormData.append('AuthorID', data?.AuthorID ? parseInt(`${data?.AuthorID}`) : '')
      bodyFormData.append('ProductStatus', data?.ProductStatus ? data?.ProductStatus : '')
      bodyFormData.append('CustomAttributes', JSON.stringify(customAttributeValues))

      const res = await axiosJWT.post(EDIT_PRODUCT, bodyFormData, {
        headers: {
          Authorization: `${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res?.data?.status === 200) {
        setAddProductState(false)
      } else if (res?.data?.status === 403) {
        setAddProductState(false)
      } else {
        setAddProductState(false)
      }
    } catch (e) {
      //console.log(e.message)
      setAddProductState(false)
    }
  }

  const onSubmit2 = async (data) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', attributeName)
      bodyFormData.append('ProducType', productType)
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
    const loadCategory = async () => {
      const response = await axiosJWT.get(
        GET_CATEGORIES_BY_SUBJECT.replace('[[subjectID]]', subjectID),
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      setCategories(response?.data?.categories)
    }
    loadCategory()
  }, [subjectID, token])

  useEffect(() => {
    const loadSingleProduct = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/product/product_detail?ProductID=${id}`),
      )
      if (res?.data?.status === 200) {
        setProduct(res?.data?.product)
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
        const results = res?.data?.attributes?.filter(({ AttributeName: id1 }) => {
          return !product.CustomAttributes?.some(({ AttributeName: id2 }) => id2 === id1)
        })
        setAttributes(results)
      }
    }
    loadAttributes()
  }, [product.CustomAttributes, token])

  const categoryOptions = categories?.map((category) => {
    return { value: category?.CategoryID, label: category?.CategoryName }
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

  const selectedCategories = categoryOptions?.filter((option) => {
    if (product?.CategoryID?.includes(option.value)) {
      return option
    }
    return null
  })

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
        <CContainer>
          {/* {errorMessages.length > 0 && <CAlert>Please fill the required fields</CAlert>} */}
          <CForm className={'my-3'} onSubmit={handleSubmit(onSubmit)}>
            <div className={'row'}>
              <div className={'col-md-8'}>
                <div className={'flex flex-column'}>
                  <div className={'my-2'}>
                    <h6>Title and description</h6>
                    <CFormInput
                      type="text"
                      id="ProductTitle"
                      name={'ProductTitle'}
                      floatingLabel="Product Title"
                      className="my-3"
                      {...register('ProductTitle')}
                    />
                    <CFormInput
                      type="text"
                      id="ProductBanglishTitle"
                      floatingLabel="Product Banglish Title"
                      className="my-3"
                      {...register('ProductBanglishTitle')}
                    />
                    <Editor
                      editorState={editorState}
                      editorClassName="editor_container"
                      placeholder="Description"
                      onEditorStateChange={onEditorStateChange}
                      handlePastedText={() => false}
                    />
                  </div>
                  <div className={'my-5'}>
                    <CRow className={'justify-content-between'}>
                      <CCol>
                        <h6>Product Details</h6>
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
                              <h5>Create New Attribute</h5>
                              <div className="col-md-8">
                                <CFormInput
                                  floatingLabel="Attribute Name"
                                  className="my-3"
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
                              <h5 className="pb-4">Select Attributes</h5>
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
                    <div className="row">
                      {' '}
                      {attValue?.length > 0 &&
                        attValue.map((attribute, index) => (
                          <div className="col-md-6" key={index}>
                            <CFormInput
                              placeholder={attribute}
                              floatingLabel={attribute}
                              className="mt-3"
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
                    <div className="row">
                      {product.CustomAttributes?.length > 0 &&
                        product.CustomAttributes.map(({ AttributeValue, AttributeName, index }) => (
                          <div className="col-md-6" key={index}>
                            <CFormInput
                              placeholder={product}
                              floatingLabel={AttributeName}
                              defaultValue={AttributeValue}
                              className="mt-3"
                              onChange={(e) => {
                                setCustomAttributeValues([
                                  ...product.CustomAttributes,
                                  {
                                    AttributeValue: e.target.value,
                                    AttributeName: AttributeName,
                                    index: index,
                                  },
                                ])
                              }}
                            />
                          </div>
                        ))}
                    </div>
                    {product.ProductType === 'BOOK' && (
                      <>
                        {' '}
                        <Controller
                          control={control}
                          name="AuthorID"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              className="my-3"
                              options={authorOptions}
                              placeholder="Select Author"
                              onChange={(option) => {
                                onChange(option.value)
                              }}
                              defaultValue={authorOptions?.filter((option) => {
                                if (option.value === product?.AuthorID) {
                                  return { label: option.label, value: option.value }
                                }
                                return null
                              })}
                              styles={selectCustomStyles}
                              isClearable
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="PublicationID"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              className="my-3"
                              options={publicationOptions}
                              placeholder="Select Publication"
                              onChange={(option) => {
                                onChange(option.value)
                              }}
                              defaultValue={publicationOptions?.filter((option) => {
                                if (option.value === product?.publication.PublicationID) {
                                  return { label: option.label, value: option.value }
                                }
                                return null
                              })}
                              styles={selectCustomStyles}
                              isClearable
                            />
                          )}
                        />
                      </>
                    )}

                    {(product.ProductType === 'FASHION' ||
                      product.ProductType === 'STATIONARY') && (
                        <Controller
                          control={control}
                          name="BrandID"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              className="my-3"
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
                      )}
                  </div>
                </div>
              </div>
              <div className={'col-md-4'}>
                <div className={'flex flex-column'}>
                  <div className={'my-2'}>
                    <h6 className="card-title mb-4">Category</h6>
                    <Controller
                      control={control}
                      name="CategoryID"
                      render={({ field: { onChange, value, ref, name } }) => (
                        <Select
                          className="my-2 "
                          options={categoryOptions}
                          placeholder="Select Category"
                          onChange={(option) => {
                            onChange(option)
                          }}
                          styles={selectCustomStyles}
                          defaultValue={selectedCategories}
                          isClearable
                          isMulti
                        />
                      )}
                    />
                  </div>
                  <div className={'my-5'}>
                    <h6>Images and Pricing</h6>
                    {/* <img src={product.Picture} className="img-fluid" alt="Product thumbnail" /> */}
                    <CFormInput
                      type="file"
                      accept="image/*"
                      id="Picture"
                      className={'my-3'}
                      name="Picture"
                      {...register('Picture')}
                    />
                    <CFormInput
                      type="text"
                      id="RegularPrice"
                      floatingLabel="Regular Price"
                      className={'my-3'}
                      {...register('RegularPrice')}
                    />
                    <CFormInput
                      type="text"
                      id="SalePrice"
                      floatingLabel="Sale Price"
                      className={'my-3'}
                      {...register('SalePrice')}
                    />
                    <CFormInput
                      type="text"
                      id="UnitInStock"
                      floatingLabel="Unit in stock"
                      className={'my-3'}
                      {...register('UnitInStock')}
                    />
                    <CFormSwitch
                      label="Available in stock"
                      id="ProductAvailable"
                      {...register('ProductAvailable')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <CButton className="text-white" type="submit">
              Upload Product
            </CButton>
          </CForm>
        </CContainer>
      </LoadingOverlay>
    </>
  )
}

export default CommonAddProduct
