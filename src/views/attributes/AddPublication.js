/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const AddPublication = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    control: control2,
  } = useForm()
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [publications, setPublications] = useState([])
  const { promiseInProgress } = usePromiseTracker()
  const [visible, setVisible] = useState(false)
  const [addPublicationState, setAddPublicationState] = useState(false)
  const [deletePublicationState, setDeletePublicationState] = useState(false)

  const [selectedPublicationID, setSelectedPublicationID] = useState(null)
  const [editedPublicationName, setEditedPublicationName] = useState(null)
  const [editedPublicationNameBN, setEditedPublicationNameBN] = useState(null)
  const [editedPublicationDesc, setEditedPublicationDesc] = useState(null)
  const [editedPublicationPhoto, setEditedPublicationPhoto] = useState(null)
  // const [editedPublicationSlug, setEditedPublicationSlug] = useState(null)
  const [blogImage, setBlogImage] = useState()

  const loadPublications = async () => {
    try {
      // ADDED TRACKPROMISE
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/publication/all?limit=1000000`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res.status === 200) {
        setPublications(res.data.publications)
      }
    } catch (err) {
      //console.log(err)
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
          setDeletePublicationState(true)
          const res = await axiosJWT.post(`${baseURL}/api/v1/admin/publication/delete/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          if (res.data?.status === 200) {
            setDeletePublicationState(false)
            setPublications(publications.filter((publication) => publication?.PublicationID !== id))
            // swal('Success', 'Delete Success')
          } else {
            setDeletePublicationState(false)
          }
        }
      })
    } catch (error) {
      //console.log(error)
    }
  }

  const onSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.PublicationPhoto[0])

      const imageRes = await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      console.log(imageRes)

      if (imageRes?.data?.status !== 200) {
        return
      }

      const bodyFormData = new FormData()
      const publicationSlug = data?.PublicationName.replaceAll(' ', '-').toLowerCase()
      bodyFormData.append('PublicationName', data?.PublicationName)
      bodyFormData.append('PublicationNameBN', data?.PublicationNameBN)
      bodyFormData.append('PublicationDesc', data?.PublicationDesc)
      bodyFormData.append('PublicationPhoto', imageRes.data?.data?.mediaLink)
      bodyFormData.append('PublicationSlug', publicationSlug)
      setAddPublicationState(true)
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/publication/add_new`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setAddPublicationState(false)
        setPublications([...publications, res?.data?.publication])
      } else {
        setAddPublicationState(false)
      }
    } catch (err) {
      console.log(err)
    }


  }

  const onEdit = async (data) => {
    console.log(data)
    try {
      if (editedPublicationPhoto?.length !== 0) {
        const formData = new FormData()
        formData.append('file', editedPublicationPhoto[0])
        const config = {
          headers: {
            Authorization: `${token}`,
            'Access-Control-Allow-Origin': '*',
            'content-type': 'multipart/form-data',
          },
        }
        const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)
        console.log(res)
        if (!res?.data?.status === 200 && editedPublicationPhoto[0]) {
          return
        }
      } else {
        setBlogImage(res?.data?.data?.mediaLink)
      }


      try {
        const bodyFormData = new FormData()
        bodyFormData.append('PublicationName', editedPublicationName)
        bodyFormData.append('PublicationNameBN', editedPublicationNameBN)
        bodyFormData.append('PublicationDesc', editedPublicationDesc)
        bodyFormData.append('PublicationPhoto', blogImage)
        bodyFormData.append('PublicationID', selectedPublicationID)

        const res = await axiosJWT.post(`${baseURL}/api/v1/admin/publication/edit`, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })
        if (res?.data?.status === 200) {
          swal('Success', 'Updated Publication')

          loadPublications()
          // setVisible(false)
        } else {
          // setVisible(false)
        }
      } catch (error) {
        console.log(error)
        // setVisible(false)
      }
    }
    catch (error) {
      console.log(error)
      // setVisible(false)
    }

  }

  useEffect(() => {
    const publication = publications?.find(
      (publication) => publication?.PublicationID === selectedPublicationID,
    )
    setEditedPublicationName(publication?.PublicationName)
    setEditedPublicationNameBN(publication?.PublicationNameBN)
    setEditedPublicationDesc(publication?.PublicationDesc)
  }, [selectedPublicationID, publications])

  useEffect(() => {
    loadPublications()
  }, [token])
  return (
    <>
      <LoadingOverlay
        active={addPublicationState || deletePublicationState}
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
                <h6 className="card-title">Add Publication</h6>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row my-3">
                    <div className="col-md-6">
                      <CFormInput
                        placeholder="Publication Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Publication Name</div>}
                        {...register('PublicationName', { required: true })}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        placeholder="Publication Name Bangla"
                        floatingLabel={
                          <div style={{ color: '#808080' }}>Publication Name Bangla</div>
                        }
                        {...register('PublicationNameBN', { required: true })}
                      />
                    </div>
                  </div>
                  <CFormTextarea
                    placeholder="Publication Description"
                    rows={'5'}
                    {...register('PublicationDesc')}
                  />
                  <CFormInput
                    type="file"
                    accept="image/*"
                    className="my-3 form-control-lg rounded-0"
                    {...register('PublicationPhoto', { required: true })}
                  />
                  <CButton className="my-3 text-white" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              <div>
                {publications?.length > 0 &&
                  publications?.map((pub) => (
                    <>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                          {pub.PublicationName}
                        </div>
                        <div className="text-center">
                          <CButton
                            className=" me-3"
                            style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                            onClick={() => onDelete(pub?.PublicationID)}
                          >
                            <RiDeleteBinFill />
                          </CButton>
                          <CButton
                            onClick={() => {
                              setVisible(!visible)
                              setSelectedPublicationID(pub?.PublicationID)
                            }}
                            style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                          >
                            <FiEdit />
                          </CButton>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
              {/* edit publocation */}
              <CModal
                alignment="center"
                visible={visible}
                onClose={() => setVisible(false)}
                backdrop={true}
              >
                <CModalHeader>
                  <CModalTitle>Edit Publication</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm onSubmit={handleSubmit2(onEdit)}>
                    <div className="flex">
                      <div>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Publication Name"
                          floatingLabel={<div style={{ color: '#808080' }}>Publication Name</div>}
                          value={editedPublicationName}
                          onChange={(e) => setEditedPublicationName(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Publication Name BN"
                          floatingLabel={<div style={{ color: '#808080' }}>Publication Name BN</div>}
                          value={editedPublicationNameBN}
                          onChange={(e) => setEditedPublicationNameBN(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Publication Description"
                          floatingLabel={<div style={{ color: '#808080' }}>Publication Description</div>}
                          value={editedPublicationDesc}
                          onChange={(e) => setEditedPublicationDesc(e.target.value)}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control mb-2"
                          floatingLabel={<div style={{ color: '#808080' }}>Publication Image</div>}
                          placeholder="Publication Image"
                          onChange={(e) => setEditedPublicationPhoto(e.target.value)}
                        />
                      </div>
                    </div>

                    <button className="btn btn-primary text-white my-3" type="submit">
                      Update Publication
                    </button>
                  </CForm>
                </CModalBody>
              </CModal>
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

export default AddPublication