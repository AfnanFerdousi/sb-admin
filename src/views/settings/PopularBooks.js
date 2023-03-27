/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'

const PopularBooks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm()

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    watch: watch2,
    control: control2,
  } = useForm()

  // Form values
  const categoryID = watch('AuthorID')

  const [categories, setCategories] = useState([])
  const [popularBooks, setPopularBooks] = useState([])
  const { promiseInProgress } = usePromiseTracker()
  const [addPopularCategoryState, setAddPopularCategoryState] = useState(false)
  const [refetchPopularBooks, setRefetchPopularBooks] = useState(false)
  const [deletePopularCategoryState, setDeletePopularCategoryState] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedCatID, setSelectedCatID] = useState(null)
  const [edittedCatDesc, setEdittedCatDesc] = useState("")

  const [selectedCategory, setSelectedCategory] = useState('0')
  const [categoryOptions, setCategoryOptions] = useState([])


  const cookies = new Cookies()
  const token = cookies.get('token')

  useEffect(() => {
    const category = popularBooks.filter((category) => category?.CategoryID === selectedCatID)
    console.log(category)
    setEdittedCatDesc(category[0]?.Title)
  }, [selectedCatID, popularBooks])

  const onSubmit = async (data) => {
    console.log(data)
    const token = cookies.get('token')

    try {
      const formData = JSON.stringify({
        CategoryID: data?.CategoryID,
        Title: data?.Title,
      })
      setAddPopularCategoryState(true)
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/jonopriyo-category/`, formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      })
      //console.log(res)
      if (res?.status === 200) {
        setPopularBooks([...popularBooks, res.data?.jonopriyo_category])
        //console.log(res?.data?.jonopriyo_category);
        setAddPopularCategoryState(false)
        setRefetchPopularBooks(!refetchPopularBooks)
        //swal('Success!', `${res?.data?.message}`);
      } else {
        setAddPopularCategoryState(false)
      }
    } catch (error) {
      setAddPopularCategoryState(false)
      //console.log(error)
    }
  }
  const onEdit = async (data) => {
    try {
      setAddPopularCategoryState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryID', selectedCatID)
      bodyFormData.append('Title', setEdittedCatDesc)

      const res = await axiosJWT.patch(
        `${baseURL}/api/v1/admin/jonopriyo-category/edit`,
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        setVisible(false)
        setAddPopularCategoryState(false)
      } else {
        setVisible(false)
        setAddPopularCategoryState(false)
      }
    } catch (e) {
      console.log(e)
      setAddPopularCategoryState(false)
    }
  }

  const onDelete = async (CategoryID) => {
    const token = cookies.get('token')
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryID', parseInt(CategoryID))

      setAddPopularCategoryState(true)
      const res = await axiosJWT.delete(
        `${baseURL}/api/v1/admin/jonopriyo-category/${CategoryID}`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      //console.log(res)
      if (res?.status === 200) {
        //console.log(res?.data?.jonopriyo_category?.CategoryID);
        setPopularBooks(
          popularBooks.filter(
            (popularBook) => popularBook.CategoryID !== res?.data?.jonopriyo_category?.CategoryID,
          ),
        )
        setAddPopularCategoryState(false)
        setRefetchPopularBooks(!refetchPopularBooks)
        //swal('Success!', 'Popular Book Category Deleted')
      } else {
        setAddPopularCategoryState(false)
      }
    } catch (error) {
      setAddPopularCategoryState(false)
      //console.log(error)
    }
  }

  useEffect(() => {
    const loadCategories = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/category/categories?ProductType=ACADEMIC_BOOK`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.categories?.length > 0) {
        setCategories(res?.data?.categories)
      }
    }

    const loadPopularCategory = async () => {
      const res = await trackPromise(
        // /api/v1 / public / jonopriyo - category
        axiosJWT.get(`${baseURL}/api/v1/public/jonopriyo-category/`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.status == 200) {
        setPopularBooks(res?.data?.categories_with_image)
        console.log(res?.data)
      }
    }
    loadCategories()
    loadPopularCategory()
  }, [token])

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

  const defaultCat = categoryOptions.filter((option) => option?.value === selectedCatID)

  console.log('categoryOptions', categoryOptions)
  console.log(popularBooks)
  return (
    <>
      <LoadingOverlay
        active={addPopularCategoryState || deletePopularCategoryState}
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
        <div className="flex flex-column mt-5">
          <div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title mb-4">Home Page Settings</h6>
                <h5 className="card-title fw-medium">Select জনপ্রিয় বই এর ক্যাটেগরি</h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="CategoryID"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            className="my-3"
                            options={[{ label: "No Parent", value: "0" }, ...categoryOptions]}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Select Category</div>}
                            placeholder="Select Category"
                            onChange={(option) => {
                              onChange(option.value)
                              setSelectedCategory(option.value)
                            }}
                            styles={selectCustomStyles}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        name={'Title'}
                        placeholder="Title"
                        floatingLabel={<div style={{ color: '#808080' }}>Title</div>}
                        className="my-3"
                        {...register('Title', {required: true})}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3 px-4" type="submit">
                    Add
                  </button>
                </CForm>

                {promiseInProgress === false ? (
                  <div className="mt-3">
                    <CTable>
                      <CTableHead>
                        <CTableRow style={{ background: '#F3F5F9' }}>
                          <CTableHeaderCell className="py-3" scope="col">
                            Category Name
                          </CTableHeaderCell>
                          <CTableHeaderCell className="py-3" scope="col">
                            Title
                          </CTableHeaderCell>
                          <CTableHeaderCell className="py-3 text-end" scope="col">
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {popularBooks.map((category) => (
                          <>
                            <CTableRow>
                              <CTableDataCell style={{ paddingTop: '15px' }}>
                                {category?.CategoryName}
                              </CTableDataCell>
                              <CTableDataCell style={{ paddingTop: '15px' }}>
                                {category?.Title}
                              </CTableDataCell>
                              <CTableDataCell className="text-end">
                                <CButton
                                  style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                  onClick={() => onDelete(category?.CategoryID)}
                                >
                                  <RiDeleteBinFill />
                                </CButton>
                                <CButton
                                  onClick={() => {
                                    setVisible(!visible)
                                    setSelectedCatID(category?.CategoryID)
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                >
                                  <FiEdit />
                                </CButton>
                                <CModal
                                  alignment="center"
                                  visible={visible}
                                  onClose={() => setVisible(false)}
                                >
                                  <CModalHeader>
                                    <CModalTitle>Edit Category</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <CForm onSubmit={handleSubmit2(onEdit)}>
                                      <div className="flex">
                                        <div>
                                          <Controller
                                            control={control}
                                            name="CategoryID"
                                            render={({ field: { onChange, value, ref, name } }) => (
                                              <Select
                                                className="my-3"
                                                options={categoryOptions}
                                                defaultValue={defaultCat}
                                                placeholder="Select Category"
                                                onChange={(option) => {
                                                  onChange(option.value)
                                                }}
                                                styles={selectCustomStyles}
                                              />
                                            )}
                                          />
                                          <CFormInput
                                            type="text"
                                            id="Title"
                                            name={'Title'}
                                            placeholder="Title"
                                            defaultValue={edittedCatDesc ? edittedCatDesc : '' }
                                            floatingLabel={
                                              <div style={{ color: '#808080' }}>Title</div>
                                            }
                                            className="my-3"
                                            onChange={(e) => setEdittedCatDesc(e.target.value)}
                                          />
                                          <input
                                            type="text"
                                            className="form-control mb-2 d-none"
                                            defaultValue={`${selectedCatID}`}
                                            readOnly
                                          />
                                        </div>
                                      </div>

                                      <button
                                        className="btn btn-primary text-white my-3"
                                        type="submit"
                                      >
                                        Update Category
                                      </button>
                                    </CForm>
                                  </CModalBody>
                                </CModal>
                              </CTableDataCell>
                            </CTableRow>
                          </>
                        ))}
                      </CTableBody>
                    </CTable>
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
          </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default PopularBooks
