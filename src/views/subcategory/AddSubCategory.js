/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

// eslint-disable-next-line react/prop-types
const AddSubCategory = ({ productType }) => {
  // Create sub category
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm()

  // Edit sub category
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors3 },
    control: control3,
  } = useForm()

  const [subCategories, setSubCategories] = useState([])
  const [subjects, setSubjects] = useState([])
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [visible, setVisible] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [addSubCatState, setAddSubCatState] = useState(false)
  const [deleteSubCatState, setDeleteSubCatState] = useState(false)
  const [editSubCatState, setEditSubCatState] = useState(false)
  const [choosedSubCatID, setChoosedSubCatID] = useState()
  const { promiseInProgress } = usePromiseTracker()

  // const productType = watch('ProductType')
  const categoryID = watch('CategoryID')

  useEffect(() => {
    const loadSubjects = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/subject/all_subjects?limit=100000&ProductType=${productType}`,
      )
      setSubjects(res?.data?.subjects)
    }
    loadSubjects()
  }, [productType])

  useEffect(() => {
    const loadSubCategories = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/subcategory?ProductType=${productType}`),
      )
      setSubCategories(res?.data?.subcategory)
    }
    loadSubCategories()

    const loadAllCategories = async () => {
      const res = await axios.get(
        `${baseURL}/api/v1/public/category/categories?ProductType=${productType}`,
      )
      setAllCategories(res?.data?.categories)
    }
    loadAllCategories()
  }, [])

  const categories = allCategories.filter(
    (category) => category.CategoryID === categoryID?.toString(),
  )

  const onSubCatDelete = async (id) => {
    try {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          setDeleteSubCatState(true)
          const bodyFormData = new FormData()
          bodyFormData.append('SubCategoryID', id)

          const deleted = await axiosJWT.post(
            `${baseURL}/api/v1/admin/subcategory/delete`,
            bodyFormData,
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )

          if (deleted?.data?.status === 200) {

            setSubCategories(
              subCategories.filter((subcategory) => subcategory?.SubCategoryID !== id),
            )
            setDeleteSubCatState(false)
          } else {

          }
        }
      })
    } catch (error) {
      setDeleteSubCatState(false)

    }
  }

  const onSubCatEdit = async (data) => {
    try {
      setVisible(false)
      setEditSubCatState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('SubCategoryID', data?.SubCategoryID && parseInt(data?.SubCategoryID))
      bodyFormData.append('SubCategoryName', data?.NewSubCategory && data?.NewSubCategory)
      bodyFormData.append('CategoryID', data?.NewCategoryID && data?.NewCategoryID)

      const edited = await axiosJWT.post(`${baseURL}/api/v1/admin/subcategory/edit`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (edited?.data?.status === 200) {
        setEditSubCatState(false)
        const index = subCategories.findIndex(
          (subcategory) => subcategory.SubCategoryID === parseInt(data?.SubCategoryID),
        )
        const updatedSubCategories = subCategories.splice(index, 1, edited?.data?.data)
        setSubCategories([...subCategories, ...updatedSubCategories])
        swal('Success', 'Edit success!')
      } else {
        setEditSubCatState(false)

      }
    } catch (e) {
      setEditSubCatState(false)

    }
  }

  const onSubCatSubmit = async (data) => {
    const bodyFormData = new FormData()
    bodyFormData.append('SubCategoryName', data?.SubCategoryName)
    bodyFormData.append('CategoryID', data?.CategoryID)
    setAddSubCatState(true)

    const res = await axiosJWT.post(
      `${baseURL}/api/v1/admin/subcategory/create_new`,
      bodyFormData,

      {
        headers: {
          Authorization: `${token}`,
        },
      },
    )

    if (res.status === 200) {
      setAddSubCatState(false)
      //swal('Success!', 'Inserted Sub Category')
      setSubCategories([...subCategories, res?.data?.subcategory])
    } else {
      setAddSubCatState(false)

    }
  }

  const subjectOptions = subjects?.map((subject) => {
    return { value: subject?.SubjectID, label: subject?.SubjectName }
  })

  const categoryBySubjectOptions = categories?.map((category) => {
    return { value: category?.CategoryID, label: category?.CategoryName }
  })

  const categoryOptions = allCategories.map((category) => {
    return {
      value: category?.CategoryID,
      label: category?.CategoryName,
    }
  })

  return (
    <>
      <LoadingOverlay
        active={addSubCatState || deleteSubCatState || editSubCatState}
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
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="card-title">Add Sub Category</h6>
          </div>
          <div className="card-body">
            <CForm onSubmit={handleSubmit(onSubCatSubmit)}>
              <CFormInput
                type="text"
                id="SubCategoryName"
                placeholder="Sub Category Name"
                {...register('SubCategoryName', { required: true })}
                className="my-3"
              />
              {/* <Controller
                control={control}
                name="ProductType"
                render={({ field: { onChange, value, ref, name } }) => (
                  <Select
                    options={productTypes}
                    placeholder="Product Type"
                    isSearchable={false}
                    className="my-3"
                    onChange={(option) => {
                      onChange(option.value)
                    }}
                    styles={selectCustomStyles}
                  />
                )}
              /> */}
              {/* {productType && (
                <Controller
                  control={control}
                  name="SubjectID"
                  render={({ field: { onChange, value, ref, name } }) => (
                    <Select
                      options={subjectOptions}
                      placeholder="Select Subject"
                      isSearchable={false}
                      className="my-3"
                      onChange={(option) => {
                        onChange(option.value)
                      }}
                      styles={selectCustomStyles}
                    />
                  )}
                />
              )} */}
              {/* {categoryID && ( */}
              <Controller
                control={control}
                name="CategoryID"
                render={({ field: { onChange, value, ref, name } }) => (
                  <Select
                    options={categoryOptions}
                    placeholder="Select Category"
                    isSearchable={false}
                    className="my-3"
                    onChange={(option) => {
                      onChange(option.value)
                    }}
                    styles={selectCustomStyles}
                  />
                )}
              />
              {/* )} */}
              <CButton color="primary" className="text-white" type="submit">
                Create
              </CButton>
            </CForm>
          </div>
        </div>

        {promiseInProgress === false ? (
          <div className="mt-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">Manage Sub Categories</h6>
              </div>
              <div className="card-body">
                <CTable>
                  <CTableHead>
                    <CTableRow style={{ background: '#F3F5F9' }}>
                      <CTableHeaderCell className="py-3" scope="col">
                        Name
                      </CTableHeaderCell>
                      <CTableHeaderCell className="py-3" scope="col">
                        Parent Category
                      </CTableHeaderCell>
                      <CTableHeaderCell className="py-3" scope="col">
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {subCategories?.length !== 0 &&
                      subCategories?.map((subcategory) => {
                        const selectedCategory = allCategories?.find(
                          (category) => category?.CategoryID === subcategory?.CategoryID,
                        )
                        return (
                          <>
                            <CTableRow>
                              <CTableHeaderCell className="py-4" scope="row">
                                {subcategory?.SubCategoryName}
                              </CTableHeaderCell>
                              <CTableDataCell>{selectedCategory?.CategoryName}</CTableDataCell>
                              <CTableDataCell>
                                <CButton
                                  className="text-white"
                                  onClick={() => onSubCatDelete(subcategory?.SubCategoryID)}
                                >
                                  <RiDeleteBinFill />
                                </CButton>
                                <CButton
                                  onClick={() => setVisible(!visible)}
                                  className="mx-2 cursor-pointer text-white "
                                  color="success"
                                >
                                  <FiEdit3 />
                                </CButton>
                                <CModal
                                  alignment="center"
                                  visible={visible}
                                  onClose={() => setVisible(false)}
                                  backdrop={true}
                                >
                                  <CModalHeader>
                                    <CModalTitle>Edit Sub Category</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <CForm onSubmit={handleSubmit3(onSubCatEdit)}>
                                      <div className="flex">
                                        <div>
                                          <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="New Sub Category Name"
                                            {...register3('NewSubCategory')}
                                          />
                                          <input
                                            type="text"
                                            className="form-control mb-2 d-none"
                                            defaultValue={subcategory.SubCategoryID}
                                            {...register3('SubCategoryID')}
                                          />
                                          <Controller
                                            control={control3}
                                            name="NewCategoryID"
                                            render={({ field: { onChange, value, ref, name } }) => (
                                              <Select
                                                options={categoryOptions}
                                                placeholder="Select Category"
                                                isSearchable={false}
                                                className="my-3"
                                                onChange={(option) => {
                                                  onChange(option.value)
                                                }}
                                                styles={selectCustomStyles}
                                              />
                                            )}
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
                        )
                      })}
                  </CTableBody>
                </CTable>
              </div>
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
      </LoadingOverlay>
    </>
  )
}

export default AddSubCategory
