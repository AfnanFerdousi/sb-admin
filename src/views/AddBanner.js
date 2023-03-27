/* eslint-disable */
import {
  CButton,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CFormInput,
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
import { useForm } from 'react-hook-form'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import ModalImage from 'react-modal-image'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { DELETE_BANNER, GET_ALL_BANNERS, POST_NEW_BANNER, FILE_UPLOAD } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Cookies from 'universal-cookie'

const AddBanner = () => {
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
  const [banners, setBanners] = useState([])
  const { promiseInProgress } = usePromiseTracker()
  const [addBannerState, setAddBannerState] = useState(false)
  const [deleteBannerState, setDeleteBannerState] = useState(false)
  const [visible, setVisible] = useState(false)
  // const [banner, setBanner] = useState([])
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { id } = useParams()
  const [selectedBannerID, setSelectedBannerID] = useState(null)
  const [editedBannerTitle, setEditedBannerTitle] = useState(null)
  const [editedBannerLink, setEditedBannerLink] = useState(null)
  const [editedBannerImage, setEditedBannerImage] = useState(null)

  const loadBanners = async () => {
    const res = await trackPromise(axios.get(GET_ALL_BANNERS))
    setBanners(res.data.banners)
  }

  useEffect(() => {
    const banner = banners.filter((banner) => banner?.BannerID === selectedBannerID)
    setEditedBannerTitle(banner[0]?.BannerTitle)
    setEditedBannerLink(banner[0]?.BannerLink)
    setEditedBannerImage(banner[0]?.BannerImage[0])

  }, [selectedBannerID, banners])

  const onSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.BannerImage[0])

      const imageRes = await axiosJWT
        .post(FILE_UPLOAD,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      if (imageRes?.data?.status !== 200) {
        return
      }

      const bodyFormData = new FormData()
      bodyFormData.append('BannerTitle', data?.BannerTitle)
      bodyFormData.append('BannerLink', data?.BannerLink)
      bodyFormData.append('BannerImage', imageRes?.data?.data?.mediaLink)

      setAddBannerState(true)
      const res = await axiosJWT.post(POST_NEW_BANNER, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setAddBannerState(false)
        //swal('Success!', 'Inserted Banner')
        setBanners([...banners, res?.data?.banner])
      } else {
        setAddBannerState(false)
      }
    } catch (error) {
      //console.log(error)
    }
  }

  const onDelete = async (id) => {
    try {
      setDeleteBannerState(true)
      const res = await axiosJWT.delete(DELETE_BANNER.replace('[[id]]', `${id}`), {
        headers: {
          Authorization: `${token}`,
        },
      })
      if (res.data?.status === 200) {
        //
        setBanners(banners.filter((banner) => banner.BannerID !== id))
        setDeleteBannerState(false)
      }
    } catch (error) {
      setDeleteBannerState(false)
    }
  }

  // Edit banner start
  const onEdit = async (data) => {
    //console.log(data)
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.BannerImage[0])

      const imageRes = data?.BannerImage[0] && await axiosJWT
        .post(FILE_UPLOAD,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      if (imageRes?.data?.status !== 200 && data?.BannerImage[0]) {
        return
      }

      const bodyFormData = new FormData()
      bodyFormData.append('BannerTitle', editedBannerTitle)
      imageRes?.data?.data?.mediaLink && bodyFormData.append('BannerImage', imageRes?.data?.data?.mediaLink)
      bodyFormData.append('BannerLink', editedBannerLink)
      bodyFormData.append('BannerID', selectedBannerID)
      //console.log(data)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/banner/edit`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        swal('Success', 'Updated Banner')
        setVisible(false)
        loadBanners()
      } else {
        setVisible(false)

      }
    } catch (error) {
      setVisible(false)

    }
  }

  useEffect(() => {
    // const loadBanners = async () => {
    //   const res = await trackPromise(axios.get(GET_ALL_BANNERS))
    //   setBanners(res.data.banners)
    // }
    loadBanners()
  }, [])

  return (
    <>
      <LoadingOverlay
        active={addBannerState || deleteBannerState}
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
                <h6 className="card-title">Add Banner</h6>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <CFormInput
                          type="text"
                          className="form-control"
                          placeholder="Banner Name"
                          floatingLabel={<div style={{ color: '#808080' }}>Banner Name</div>}
                          {...register('BannerTitle', { required: true })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          className="form-control form-control-lg rounded-0"
                          {...register('BannerImage', { required: true })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <CFormInput
                          type="text"
                          className="form-control"
                          placeholder="Banner URL"
                          floatingLabel={<div style={{ color: '#808080' }}>Banner URL</div>}
                          {...register('BannerLink', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Upload Banner
                  </button>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Manage Banners</h6>
                </div>
                <div className="card-body">
                  <CTable>
                    <CTableHead>
                      <CTableRow style={{ background: '#F3F5F9' }}>
                        <CTableHeaderCell className="py-3" scope="col">
                          ID
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Image
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Active Banner
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Actions
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {banners.map((banner) => (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              scope="row"
                              style={{ color: '#8E98AA' }}
                              className="pt-3"
                            >
                              {banner?.BannerID}
                            </CTableHeaderCell>
                            <CTableDataCell style={{ color: '#8E98AA' }} className="pt-3">
                              {banner?.BannerTitle}
                            </CTableDataCell>
                            <CTableDataCell className="w-50">
                              <ModalImage
                                className="w-50"
                                small={banner?.BannerImage}
                                large={banner?.BannerImage}
                                alt={`${banner?.BannerTitle}`}
                              />
                            </CTableDataCell>
                            <CTableDataCell style={{ color: '#8E98AA' }} className="pt-3">
                              {banner?.ActiveBanner ? 'True' : 'False'}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                className="text-white"
                                onClick={() => onDelete(banner?.BannerID)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                              <CButton
                                onClick={() => {
                                  setVisible(!visible)
                                  setSelectedBannerID(banner?.BannerID)
                                }}
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
                                  <CModalTitle>Edit Banner</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                  <CForm onSubmit={handleSubmit2(onEdit)}>
                                    <div className="row">
                                      <div className="mb-2">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Banner Name"
                                          defaultValue={editedBannerTitle}
                                          onChange={(e) => setEditedBannerTitle(e.target.value)}
                                        />
                                      </div>
                                      <div className="mb-2">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Banner URL"
                                          defaultValue={editedBannerLink}
                                          onChange={(e) => setEditedBannerLink(e.target.value)}
                                        />
                                      </div>
                                      <div className="mb-2">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="form-control"
                                          {...register2('BannerImage')}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      className="btn btn-primary text-white my-3"
                                      type="submit"
                                    >
                                      Update Banner
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
        </div>
      </LoadingOverlay>
    </>
  )
}

export default AddBanner