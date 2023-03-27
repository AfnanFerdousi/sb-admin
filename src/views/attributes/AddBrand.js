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

const AddBrand = () => {
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

  const [brands, setBrands] = useState([])
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [visible, setVisible] = useState(false)
  const [selectedBrandID, setSelectedBrandID] = useState(null)
  const [editedBrandName, setEditedBrandName] = useState(null)
  const [editedBrandDescription, setEditedBrandDescription] = useState(null)
  const [addBrandState, setAddBrandState] = useState(false)
  const [deleteBrandState, setDeleteBrandState] = useState(false)
  const [blogImage, setBlogImage] = useState()

  const loadBrands = async () => {
    const res = await axiosJWT.get(`${baseURL}/api/v1/public/brand/`)
    setBrands(res.data.brands)
    if (res.data.brands.length > 0) {
      setBrands(res.data.brands)
    }
  }

  useEffect(() => {
    if (brands.length > 0) {
      const brand = brands.filter((brand) => brand.BrandID === selectedBrandID)
      setEditedBrandName(brand[0]?.BrandName)
      setEditedBrandDescription(brand[0]?.BrandDescription)
    } else {
      setVisible(false)
    }
  }, [selectedBrandID])

  const onSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.BrandLogo[0])

      const imageRes = await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      console.log(imageRes?.data)

      if (imageRes?.data?.status !== 200) {
        return
      }

      const bodyFormData = new FormData()
      bodyFormData.append('BrandName', data?.BrandName)
      bodyFormData.append('BrandDescription', data.BrandDesc)
      bodyFormData.append('BrandLogo', imageRes.data?.data?.mediaLink)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/brand/new`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      //console.log(res.data)
      if (res?.data?.status === 200) {
        setAddBrandState(false)
        setBrands([...brands, res.data?.brand])
      } else {
        setAddBrandState(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onDelete = async (BrandID) => {
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
            `${baseURL}/api/v1/admin/brand/delete?BrandID=${BrandID}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )
          if (res.data?.status === 200) {
            setBrands(brands.filter((brand) => brand.BrandID !== BrandID))
            setDeleteBrandState(false)
            // swal('Success', 'Delete Success')
          } else {
            setDeleteBrandState(false)
          }
        }
      })
    } catch (error) {
      //console.log(error)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [token])

  const onEdit = async (data) => {
    try {
      if (data?.BrandLogo?.length !== 0) {
        const formData = new FormData()
        formData.append('file', data?.BrandLogo[0])
        const config = {
          headers: {
            Authorization: `${token}`,
            'Access-Control-Allow-Origin': '*',
            'content-type': 'multipart/form-data',
          },
        }
        const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)
        console.log(res)
        if (!res?.data?.status === 200 && data?.BrandLogo[0]) {
          return
        }
      } else {
        setBlogImage(data?.BrandLogo?.mediaLink)
      }
      try {
        const bodyFormData = new FormData()
        bodyFormData.append('BrandName', editedBrandName)
        bodyFormData.append('BrandDescription', editedBrandDescription)
        bodyFormData.append('BrandID', selectedBrandID)
        bodyFormData.append('BrandLogo', data?.BrandLogo?.mediaLink)
        const res = await axiosJWT.post(`${baseURL}/api/v1/admin/brand/edit`, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })
        if (res?.data?.status == 200) {
          loadBrands()
          setVisible(false)
        }

      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log('Image upload error: ', error)
      console.log(error)
    }

  }
  return (
    <>
      <LoadingOverlay
        active={addBrandState || deleteBrandState}
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
                <h6 className="card-title">Add Brand</h6>
              </div>

              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row pb-3">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Brand Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Brand Name</div>}
                        {...register('BrandName')}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        className="form-control-lg rounded-0"
                        {...register('BrandLogo')}
                      />
                    </div>
                  </div>
                  <div className="row pb-3">
                    <div className="col-md-12">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Brand Description"
                        {...register('BrandDesc')}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Add Brand
                  </button>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              {brands.length > 0 && (
                <>
                  <CTable>
                    {brands.map((brand) => {
                      return (
                        <>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center">
                            <div style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                              {brand?.BrandName}
                            </div>
                            <div className="text-center">
                              <CButton
                                className=" me-3"
                                style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                onClick={() => onDelete(brand?.BrandID)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                              <CButton
                                onClick={() => {
                                  setVisible(!visible)
                                  setSelectedBrandID(brand?.BrandID)
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
                      <CModalTitle>Edit Brand</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <CForm onSubmit={handleSubmit2(onEdit)}>
                        <div className="flex">
                          <div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Brand Name"
                              floatingLabel={<div style={{ color: '#808080' }}>Brand Name</div>}
                              value={editedBrandName}
                              onChange={(e) => setEditedBrandName(e.target.value)}
                            />
                            <CFormInput
                              type="file"
                              accept="image/*"
                              floatingLabel={<div style={{ color: '#808080' }}>Brand Logo</div>}
                              className="form-control-lg rounded-0 mb-2"
                              {...register2('BrandLogo')}
                            />
                            <textarea
                              type="text"
                              floatingLabel={<div style={{ color: '#808080' }}>Brand Description</div>}
                              className="form-control mb-2"
                              placeholder="Brand Description"
                              value={editedBrandDescription}
                              onChange={(e) => setEditedBrandDescription(e.target.value)}
                            />
                          </div>
                        </div>

                        <button className="btn btn-primary text-white my-3" type="submit">
                          Update Brand
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
  )
}

export default AddBrand
