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
import axios from 'axios'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import TableContainer from 'src/components/reusable/TableContainer'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

// eslint-disable-next-line react/prop-types
const AddCategory = ({ productType }) => {
  const cookies = new Cookies()
  // create category
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  // update category
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors2 },
    control: control2,
  } = useForm()

  const [categories, setCategories] = useState([])
  const token = cookies.get('token')
  const [visible, setVisible] = useState(false)
  const [editModelCategoryID, setEditModelCategoryID] = useState(0)
  const { promiseInProgress } = usePromiseTracker()
  const [addCategoryState, setAddCategoryState] = useState(false)
  const [deleteCategoryState, setDeleteCategoryState] = useState(false)
  const [updateCategoryState, setUpdateCategoryState] = useState(false)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)
  const [selectedCategory, setSelectedCategory] = useState('0')
  const [categoryOptions, setCategoryOptions] = useState([])

  const onSubmit = async (data) => {
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      setAddCategoryState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryName', data.CategoryName)
      bodyFormData.append('ParentCategoryID', data.ParentCategoryID ? data.ParentCategoryID : 0)
      bodyFormData.append('ProductType', productType)
      bodyFormData.append('CategoryBanner', data.CategoryBanner[0])
      bodyFormData.append('UpdatedText', content)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/category/`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.category) {
        setAddCategoryState(false)
        setCategories([...categories, res.data.category])
      }
    } catch (error) {
      console.log(error)
      setAddCategoryState(false)
    }
  }

  const onDelete = async (id) => {
    try {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          setDeleteCategoryState(true)
          const res = await axiosJWT.delete(
            `${baseURL}/api/v1/admin/category/${id}`,
            {
              CategoryID: id,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )
          if (res?.status === 200) {
            setDeleteCategoryState(false)
            setCategories(categories.filter((category) => category.CategoryID !== id))
          }
        }
      })
    } catch (error) {
      setDeleteCategoryState(false)
    }
  }

  useEffect(() => {
    const loadCategories = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/category/categories?ProductType=${productType}${selectedCategory > '0' ? `&ParentCategoryID=${selectedCategory}` : ''}`),
      )
      if (res?.data?.categories?.length > 0) {
        setCategories(res?.data?.categories)
        console.log(res?.data?.categories)
      }
    }
    loadCategories()
  }, [productType, selectedCategory])

  const onEdit = async (data) => {
    try {
      console.log("data", data);
      setVisible(false)
      setUpdateCategoryState(true)
      console.log("data", data);
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryID', editModelCategoryID)
      bodyFormData.append('CategoryName', data?.NewCategoryName)
      if (data?.CategoryID) {
        console.log('append');
        bodyFormData.append('ParentCategoryID', data.CategoryID)
      }

      console.log('bodyFormData');
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/category/edit`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setUpdateCategoryState(false)
        const newCategories = categories.map((category) => {
          if (category.CategoryID === data?.CategoryID) {
            return {
              ...category,
              CategoryName: data?.NewCategoryName,
              CategoryBanner: data?.NewCategoryBanner[0],
            }
          }
          return category
        })
        setCategories(newCategories)
        console.log(newCategories)
      } else {
        setUpdateCategoryState(false)
      }
    } catch (error) {
      setVisible(false)
    }
  }

  const filtered = (id) => {
    const filteredCategory = categories.filter((category) => category?.CategoryID === id.toString())
    return filteredCategory
  }

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
  return (
    <>
      <LoadingOverlay
        active={addCategoryState || deleteCategoryState || updateCategoryState}
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
            <TableContainer title="Add Category">
              <div className="card-body">
                {/* <div className={'row'}> */}
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className={'row'}>
                    <div className="col-md-6">
                      <div className="col-md-10">
                        <CFormInput
                          type="text"
                          className="form-control"
                          placeholder="Category Name"
                          floatingLabel={<div style={{ color: '#808080' }}>Category Name</div>}
                          {...register('CategoryName', { required: true })}
                        />
                      </div>
                      <div className="col-md-10 mt-3">
                        <Controller
                          control={control}
                          name="ParentCategoryID"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              options={[{ label: 'No Parent', value: '0' }, ...categoryOptions]}
                              // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                              placeholder="Parent Category"
                              onChange={(option) => {
                                onChange(option.value)
                                setSelectedCategory(option.value)
                              }}
                              styles={selectCustomStyles}
                            />
                          )}
                        />
                      </div>
                      <div className="col-md-10 mt-3">
                        <input
                          type="file"
                          className="form-control form-control-lg rounded-0"
                          {...register('CategoryBanner')}
                          required={false}
                        />
                      </div>
                      <button className="btn btn-primary text-white my-3" type="submit">
                        Add Category
                      </button>
                    </div>
                  </div>
                </CForm>
                {/* </div> */}
              </div>
            </TableContainer>
          </div>

          {/* Categories Edit Modal */}
          <CModal
            alignment="center"
            visible={visible}
            onClose={() => setVisible(false)}
            backdrop={true}
          >
            <TableContainer title="Edit Category">
              <form onSubmit={handleSubmit2(onEdit)}>
                <div className="flex">
                  <div>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="New Category Name"
                      defaultValue={
                        categories.filter(
                          (category) => category?.CategoryID === editModelCategoryID,
                        )[0]?.CategoryName
                      }
                      {...register2('NewCategoryName')}
                    />
                    <Controller
                      control={control2}
                      name="CategoryID"
                      render={({ field: { onChange, value, ref, name } }) => (
                        <Select
                          defaultValue={
                            categories.filter(
                              (category) => category?.CategoryID === editModelCategoryID,
                            )[0]?.ParentCategoryID
                          }
                          options={[{ label: 'No Parent', value: '0' }, ...categoryOptions]}
                          // placeholder={<div style={{ marginTop: '-8px' }}>Select Subject</div>}
                          placeholder="Select Parent Category"
                          onChange={(option) => {
                            onChange(option.value)
                          }}
                          styles={selectCustomStyles}
                        />
                      )}
                    />
                    <input
                      type="file"
                      className="form-control form-control-lg rounded-0 mt-2"
                      {...register2('NewCategoryBanner', {
                        required: false,
                      })}
                    />
                    <input
                      type="text"
                      className="form-control mb-2 d-none"
                      defaultValue={`${editModelCategoryID}`}
                      readOnly
                    />
                  </div>
                </div>

                <button className="btn btn-primary text-white mt-3" type="submit">
                  Update Category
                </button>
              </form>
            </TableContainer>
          </CModal>

          <div className="row">
            <div className=" mt-5" style={{ height: '35rem', overflowY: 'scroll' }}>
              <>
                <div className="row">
                  <div className=" col-md-12">
                    <TableContainer title="Manage Categories">
                      <div className="mb-3">
                        <Select
                          options={[{ label: 'No Category', value: '0' }, ...categoryOptions]}
                          // placeholder={<div style={{ marginTop: '-8px' }}>Category</div>}
                          placeholder="Select Category"
                          style={{ height: '40px' }}
                          className="w-25 accordion-header"
                          onChange={(option) => {
                            setSelectedCategory(option?.value)
                          }}
                          styles={selectCustomStyles}
                          isClearable
                        />
                      </div>
                      <CTable style={{ overflow: 'scroll' }}>
                        <CTableHead>
                          <CTableRow style={{ background: '#F3F5F9' }}>
                            <CTableHeaderCell
                              className="py-3 ps-3"
                              scope="col"
                              style={{ fontSize: '14px' }}
                            >
                              Category Name
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              className="py-3"
                              scope="col"
                              style={{ fontSize: '14px' }}
                            >
                              Parent Category
                            </CTableHeaderCell>
                            <CTableHeaderCell
                              className="py-3 text-center"
                              scope="col"
                              style={{ fontSize: '14px' }}
                            >
                              Actions
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {categories.map((category) => {
                            const parentCatFiltered = filtered(parseInt(category?.ParentCategoryID))
                            return (
                              <>
                                <CTableRow>
                                  <CTableDataCell
                                    style={{ color: '#8E98AA', fontSize: '14px' }}
                                    className="pt-3 ps-3"
                                  >
                                    {category?.CategoryName}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    style={{ color: '#8E98AA', fontSize: '14px' }}
                                    className="pt-3"
                                  >
                                    {parentCatFiltered[0]?.CategoryName
                                      ? parentCatFiltered[0]?.CategoryName
                                      : 'No Parent Category'}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {/* delete button */}
                                    <CButton
                                      onClick={() => onDelete(category?.CategoryID)}
                                      className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                      style={{ color: '#8E98AA' }}
                                    >
                                      <RiDeleteBin5Fill />
                                    </CButton>
                                    {/* edit button */}
                                    <CButton
                                      onClick={() => {
                                        setEditModelCategoryID(category?.CategoryID)
                                        setVisible(!visible)
                                      }}
                                      className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                      style={{ color: '#8E98AA' }}
                                    >
                                      <FiEdit />
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            )
                          })}
                        </CTableBody>
                      </CTable>
                    </TableContainer>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default AddCategory
