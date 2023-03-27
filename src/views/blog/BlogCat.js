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
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { usePromiseTracker } from 'react-promise-tracker'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const BlogCat = () => {

  const cookies = new Cookies()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors2 },
  } = useForm()

  const [categories, setCategories] = useState([])
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [visible, setVisible] = useState(false)
  const [selectedCatID, setSelectedCatID] = useState(null)
  const [editedCatName, setEditedCatName] = useState(null)
  const [editedCatDescription, setEditedCatDescription] = useState(null)
  const [addCatState, setAddCatState] = useState(false)
  const [deleteCatState, setDeleteCatState] = useState(false)

  const loadCategories = async () => {
    const res = await axiosJWT.get(`${baseURL}/api/v1/admin/blog-category/`)
    if (res?.status == 200) {
      setCategories(res.data?.data)
      // console.log(res?.data?.data)
    }
  }

  useEffect(() => {
    if (categories.length > 0) {
      const category = categories.filter((category) => category.CategoryID === selectedCatID)
      setEditedCatName(category[0]?.CategoryName)
      setEditedCatDescription(category[0]?.CategoryDescription)
    } else {
      setVisible(false)
    }
  }, [selectedCatID])


  const onSubmit = async (data) => {
    try {
      //console.log(data)
      const urlSlug = data?.CategoryName.replaceAll(' ', '-').toLowerCase()
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryName', data?.CategoryName)
      bodyFormData.append('CategoryDescription', data.CategoryDescription)
      bodyFormData.append('CategoryURLSlug', urlSlug)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/blog-category/category`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      //console.log(res.data)
      if (res?.data?.status === 200) {
        setAddCatState(false)
        loadCategories()
        setCategories([...categories, res?.data])

        // console.log(res.data)
        //swal('Success!', 'Create success')
      } else {
        setAddCatState(false)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const onDelete = async (CategoryID) => {
    //console.log(BrandID)
    try {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          const res = await axiosJWT.delete(
            `${baseURL}/api/v1/admin/blog-category/category/${CategoryID}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )
          if (res?.status === 200) {
            setCategories(categories.filter((category) => category.CategoryID !== CategoryID))
            setDeleteCatState(false)
            // swal('Success', 'Delete Success')
          } else {
            setDeleteCatState(false)
          }
        }
      })
    } catch (error) {
      //console.log(error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [token])

  const onEdit = async (CategoryID) => {
    try {
      const urlSlug = editedCatName.replaceAll(' ', '-').toLowerCase()
      const bodyFormData = new FormData()
      bodyFormData.append('CategoryName', editedCatName)
      bodyFormData.append('CategoryDescription', editedCatDescription)
      bodyFormData.append('CategoryURLSlug', urlSlug)
      bodyFormData.append('CategoryID', selectedCatID)
      const res = await axiosJWT.patch(`${baseURL}/api/v1/admin/blog-category/category/${CategoryID}`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setAddCatState(false)
        loadCategories()
      } else {
        setAddCatState(false)
      }
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <>
      <LoadingOverlay
        active={addCatState || deleteCatState}
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
                <h6 className="card-title">Add Blog Category</h6>
              </div>

              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row pb-3">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Category Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Category Name</div>}
                        {...register('CategoryName', { required: true })}
                      />
                    </div>
                  </div>
                  <div className="row pb-3">
                    <div className="col-md-12">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Category Description"
                        {...register('CategoryDescription')}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Add Category
                  </button>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              <h6 className="card-title">Manage Category</h6>
              {categories && (
                <>
                  <CTable>
                    {categories.map((category) => {
                      return (
                        <>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center ps-2">
                            <div style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                              {category?.CategoryName}
                            </div>
                            <div className="text-center">
                              <CButton
                                className=" me-3"
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
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </CTable>
                  {/*brand edit modal*/}
                  <CModal
                    alignment="center"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    backdrop={true}
                  >
                    <CModalHeader>
                      <CModalTitle>Edit Category</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <CForm onSubmit={handleSubmit2(onEdit)}>
                        <div className="flex">
                          <div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Brand Name"
                              value={editedCatName}
                              onChange={(e) => setEditedCatName(e.target.value)}
                            />
                            <textarea
                              type="text"
                              className="form-control mb-2"
                              placeholder="Brand Name"
                              value={editedCatDescription}
                              onChange={(e) => setEditedCatDescription(e.target.value)}
                            />
                          </div>
                        </div>

                        <button className="btn btn-primary text-white my-3" type="submit">
                          Update Category
                        </button>
                      </CForm>
                    </CModalBody>
                  </CModal>
                </>
              )}
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
      </LoadingOverlay>
    </>
  );
};

export default BlogCat;