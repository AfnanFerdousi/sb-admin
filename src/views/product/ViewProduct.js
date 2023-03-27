/* eslint-disable */
import {
  CCard,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { GET_BRANDS, GET_CATEGORIES, GET_PUBLICATIONS } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import Paginate from './Paginate'

const ViewProduct = () => {
  const [products, setProducts] = useState([])
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [currentProduct, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)
  const [deleteProductState, setDeleteProductState] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [publications, setPublications] = useState([])
  const [productName, setProductName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedPublication, setSelectedPublication] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStock, setSelectedStock] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])

  useEffect(() => {
    // If productName is not empty string, implement the /search api else the /product_filter api
    // 
    if (productName !== '') {
      const loadProducts = async () => {
        const res = await trackPromise(
          axios.get(`${baseURL}/api/v1/public/product/search?query=${productName}`, {
            headers: {
              Authorization: `${token}`,
            },
          }),
        )
        setProducts(res?.data?.products)
      }
      loadProducts()
    } else {
      const loadProducts = async () => {
        const res = await trackPromise(
          axios.get(
            `${baseURL}/api/v1/public/product/product_filter?limit=10000${selectedType ? `&ProductType=${selectedType}` : ''
            }${selectedStock === false ? `&ProductAvailable=false` : ''}${selectedStock === true ? `&ProductAvailable=true` : ''}${selectedCategory ? `&CategoryID=${selectedCategory}` : ''}${selectedBrand ? `&BrandID=${selectedBrand}` : ''
            }${selectedPublication ? `&PublicationID=${selectedPublication}` : ''}`,
          ),
        )
        setProducts(res?.data?.products)
      }
      loadProducts()
    }
  }, [productName])

  // console.log(products)
  useEffect(() => {
    const loadProducts = async () => {
      const res = await trackPromise(
        axios.get(
          `${baseURL}/api/v1/public/product/product_filter?limit=10000${selectedType ? `&ProductType=${selectedType}` : ''
          }${selectedStock === false ? `&ProductAvailable=false` : ''}${selectedStock === true ? `&ProductAvailable=true` : ''}${selectedCategory ? `&CategoryID=${selectedCategory}` : ''}${selectedBrand ? `&BrandID=${selectedBrand}` : ''
          }${selectedPublication ? `&PublicationID=${selectedPublication}` : ''}`,
        ),
      )
      if (res?.data) {
        // //console.log(res?.data)
        setProducts(res?.data?.products)
      }
    }
    loadProducts()
  }, [selectedBrand, selectedCategory, selectedPublication, selectedType, selectedStock])

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
    const loadCategories = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/category/categories${selectedCategory?.value > '0' ? `&ParentCategoryID=${selectedCategory?.value}` : ''}`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.categories?.length > 0) {
        setCategories(res?.data?.categories)
      }
    }
    loadCategories()
  }, [selectedCategory, token])

  useEffect(() => {
    const filteredCategory = categories.filter((category) => category?.ParentCategoryID === selectedCategory)
    const categoryOptions = filteredCategory.map((category) => {
      return {
        value: category?.CategoryID,
        label: category?.CategoryName,
      }
    })
    setCategoryOptions(categoryOptions)
  }, [categories])

  useEffect(() => {
    const filteredCategory = categories.filter((category) => category?.ParentCategoryID === selectedCategory)
    const categoryOptions = filteredCategory.map((category) => {
      return {
        value: category?.CategoryID,
        label: category?.CategoryName,
      }
    })
    setCategoryOptions(categoryOptions)
  }, [selectedCategory])

  const deleteProduct = async (id) => {
    //console.log(token)
    setDeleteProductState(true)
    const bodyFormData = new FormData()
    bodyFormData.append('ProductID', id)
    const deleted = await axiosJWT.post(`${baseURL}/api/v1/admin/product/delete`, bodyFormData, {
      headers: {
        Authorization: `${token}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
    if (deleted) {
      setDeleteProductState(false)
      setProducts(products.filter((product) => product.ProductID !== id))
    }
  }

  const indexOfLastProduct = currentProduct * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)


  const brandOptions = brands?.map((brnd) => {
    return { value: brnd?.BrandID, label: brnd?.BrandName }
  })
  const publicationOptions = publications?.map((publication) => {
    return { value: publication?.PublicationID, label: publication?.PublicationName }
  })
  const showPubOrBrand = (type, id) => {
    const stringId = id
    // const stringId = id.toString()
    if (type === 'STATIONARY' || type === 'FASHION') {
      const brand = brandOptions.find((brand) => brand.value === stringId)
      return brand?.label
    } else {
      const publication = publicationOptions.find((pub) => pub.value === stringId)
      return publication?.label
    }
    return 'not found'
  }
  const typeOptions = [
    { value: 'ACADEMIC_BOOK', label: 'Academic Book' },
    { value: 'SUBJECT_BOOK', label: 'Subject Book' },
    { value: 'FASHION', label: 'Fashion' },
    { value: 'STATIONARY', label: 'Stationary' },
  ]
  const stockOptions = [
    { value: false, label: 'Not Available' },
    { value: true, label: 'Available' },
  ]

  // console.log(categoryOptions)

  return (
    <>
      <LoadingOverlay
        active={deleteProductState}
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
        <>
          <CCard className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">All Products</h6>
            </div>
            <div className="d-flex m-3 flex-wrap gap-3">
              <CFormInput
                placeholder="Search By Name"
                // floatingLabel={<div style={{ color: '#808080' }}>Search By Name</div>}
                className="w-25"
                onChange={(e) => {
                  setProductName(e.target.value)
                }}
              />
              <Select
                // options={categoryOptions}
                options={[{ label: "All Parent", value: "0" }, ...categoryOptions]}
                // placeholder={<div style={{ marginTop: '-8px' }}>Category</div>}
                placeholder="Select Category"
                className="w-10"
                onChange={(option) => {
                  setSelectedCategory(option?.value)
                }}
                styles={selectCustomStyles}
                isClearable
              />
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
                options={typeOptions}
                placeholder="Select Type"
                className="w-10"
                onChange={(option) => {
                  setSelectedType(option?.value)
                }}
                styles={selectCustomStyles}
                isClearable
              />
              <Select
                options={stockOptions}
                placeholder="Select Stock"
                className="w-10"
                onChange={(option) => {
                  setSelectedStock(option?.value)
                }}
                styles={selectCustomStyles}
                isClearable
              />
            </div>
            <div className="card-body">
              {promiseInProgress === false ? (
                <CTable>
                  <CTableHead>
                    <CTableRow style={{ background: '#F3F5F9' }}>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3" scope="col">
                        Image
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3" scope="col">
                        Title
                      </CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Details</CTableHeaderCell> */}
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3 " scope="col">
                        Type
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3 " scope="col">
                        Publication/Brand
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3 " scope="col">
                        Price
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3 " scope="col">
                        Stock
                      </CTableHeaderCell>
                      <CTableHeaderCell style={{ fontSize: '14px' }} className="py-3 " scope="col">
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentProducts.map((product, index) => {
                      // const publication_details = publicationDetails(1)
                      return (
                        <CTableRow key={index}>
                          <CTableHeaderCell scope="row" style={{ width: '10px' }} className="py-3">
                            <img src={product?.Picture} alt="X" style={{ width: '2rem' }} />
                          </CTableHeaderCell>
                          <CTableDataCell
                            style={{ color: '#8E98AA', fontSize: '14px' }}
                            className="py-3"
                          >
                            {product?.ProductTitle}
                          </CTableDataCell>
                          {/* <CTableDataCell>{product?.ProductDesc.substring(0, 50)}...</CTableDataCell> */}
                          <CTableDataCell
                            style={{ color: '#8E98AA', fontSize: '14px' }}
                            className="py-3"
                          >
                            {product?.ProductType || 'BOOK'}
                          </CTableDataCell>
                          <CTableDataCell
                            style={{ color: '#8E98AA', fontSize: '14px' }}
                            className="py-3"
                          // eslint-disable-next-line react/jsx-no-comment-textnodes
                          >
                            {product?.ProductType === 'ACADEMIC_BOOK' ?  showPubOrBrand('ACADEMIC_BOOK', product?.PublicationID?.toString())
                            : product?.ProductType === 'SUBJECT_BOOK' ? showPubOrBrand('SUBJECT_BOOK', product?.PublicationID?.toString())
                            : product?.ProductType === 'STATIONARY' ? showPubOrBrand('STATIONARY', product?.BrandID?.toString())
                            : showPubOrBrand('FASHION', product?.BrandID?.toString())                           
                            }
                          </CTableDataCell>
                          <CTableDataCell
                            style={{ color: '#8E98AA', fontSize: '14px' }}
                            className="py-3"
                          >
                            ৳{Math.round(product?.SalePrice)}
                          </CTableDataCell>
                          <CTableDataCell
                            style={{ color: '#8E98AA', fontSize: '14px' }}
                            className="py-3"
                          >
                            {product?.ProductAvailable ? (
                              <span className="text-success">In stock</span>
                            ) : (
                              <span className="text-danger">Out of stock</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell className="py-3">
                            <Link to={`/edit-product/${product?.ProductID}`}>
                              <FiEdit3
                                className="mx-2 edit_btn_hover cursor-pointer"
                                style={{ color: '#8E98AA' }}
                              />
                            </Link>
                            <RiDeleteBin5Line
                              className="mx-2 delete_btn_hover cursor-pointer"
                              onClick={() => deleteProduct(product?.ProductID)}
                              style={{ color: '#8E98AA' }}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
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

            <Paginate
              productsPerPage={productsPerPage}
              totalProducts={products.length}
              paginate={paginate}
            />
          </CCard>
        </>
      </LoadingOverlay>
    </>
  )
}

export default ViewProduct

// https://www.google.com/search?q=udemy&oq=udemy&aqs=chrome.0.0i131i355i433i512j46i131i199i433i465i512j0i433i512j0i131i433i512l2j0i512j69i60j69i65.2490j0j7&sourceid=chrome&ie=UTF-8
