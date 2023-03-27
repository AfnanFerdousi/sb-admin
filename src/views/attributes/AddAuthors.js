/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import axios from 'axios'
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
import Cookies from 'universal-cookie'

const AddAuthors = () => {
  const cookies = new Cookies()

  // create subject
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors3 },
  } = useForm()
  // update subject
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: { errors4 },
  } = useForm()

  const [authors, setAuthors] = useState([])
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [visible, setVisible] = useState(false)
  const [selectedAuthorID, setSelectedAuthorID] = useState(null)
  const [editedAuthorName, setEditedAuthorName] = useState(null)
  const [editedAuthorNameBN, setEditedAuthorNameBN] = useState(null)
  const [editedAuthorDescription, setEditedAuthorDescription] = useState(null)
  const [addAuthorState, setAddAuthorState] = useState(false)
  const [editAuthorState, setEditAuthorState] = useState(false)
  const [deleteAuthorState, setDeleteAuthorState] = useState(false)

  const [refetchData, setRefetchData] = useState()

  const loadAuthors = async () => {
    const response = await axios.get(
      `${baseURL}/api/v1/public/author/all_authors?limit=100000000`,
    )
    setAuthors(response?.data?.authors)
  }

  useEffect(() => {
    const author = authors.filter((author) => author?.AuthorID === selectedAuthorID)
    setEditedAuthorName(author[0]?.AuthorName)
    setEditedAuthorNameBN(author[0]?.AuthorNameBN)
    setEditedAuthorDescription(author[0]?.AuthorDesc)

  }, [selectedAuthorID, authors])

  useEffect(() => {
    loadAuthors()
  }, [token])

  // console.log(refetchData)
  const onAuthorEdit = async (data) => {
    try {
      setEditAuthorState(true)
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.AuthorPhoto[0])


      const imageRes = data?.AuthorPhoto[0] && await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token} `,
          },
        })

      if (imageRes?.data?.status !== 200 && data?.AuthorPhoto[0]) {
        return
      }


      const bodyFormData = new FormData()
      bodyFormData.append('AuthorName', editedAuthorName)
      bodyFormData.append('AuthorNameBN', editedAuthorNameBN)
      bodyFormData.append('AuthorDesc', editedAuthorDescription)
      bodyFormData.append('AuthorID', selectedAuthorID)
      bodyFormData.append('AuthorPhoto', imageRes.data?.data?.mediaLink)
      //console.log(data)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/author/edit`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token} `,
        },
      })
      if (res?.data?.status === 200) {
        setVisible(false)
        loadAuthors()
        console.log(authors)
        setEditAuthorState(false)

      } else {
        setVisible(false)
        setEditAuthorState(false)
      }
    } catch (error) {
      setVisible(false)
      setEditAuthorState(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setAddAuthorState(true)
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.AuthorPhoto[0])

      const imageRes = await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token} `,
          },
        })

      console.log(imageRes?.data)

      if (imageRes?.data?.status !== 200) {
        return
      }


      const bodyFormData = new FormData()
      bodyFormData.append('AuthorName', data?.AuthorName)
      bodyFormData.append('AuthorSlug', data?.AuthorSlug)
      bodyFormData.append('AuthorNameBN', data?.AuthorNameBN)
      bodyFormData.append('AuthorDesc', data?.AuthorDesc)
      bodyFormData.append('AuthorPhoto', imageRes.data?.data?.mediaLink)

      const res = await trackPromise(
        axiosJWT.post(`${baseURL}/api/v1/admin/author/add_new`, bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token} `,
          },
        }),
      )

      //console.log(res.data)
      if (res?.data?.status === 200) {
        setAddAuthorState(false)
        setAuthors([...authors, res.data.author])
        //swal('Success!', 'Create success')
      } else {
        setAddAuthorState(false)
      }
    } catch (e) {
      setAddAuthorState(false)
      //console.log(e.response.data)
    }
  }

  const onAuthorDelete = async (AuthorID) => {
    try {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          setDeleteAuthorState(true)
          const res = await axiosJWT.delete(
            `${baseURL}/api/v1/admin/author/delete?AuthorID=${AuthorID} `,
            {
              headers: {
                Authorization: `${token} `,
              },
            },
          )
          if (res.data?.status === 200) {
            setAuthors(authors?.filter((author) => author.AuthorID !== AuthorID))
            setDeleteAuthorState(false)
            // swal('Success', 'Delete Success')
          } else {
            setDeleteAuthorState(false)
          }
        }
      })
    } catch (error) {
      setDeleteAuthorState(false)
      //console.log(error)
    }
  }

  return (
    <>
      <LoadingOverlay
        active={addAuthorState || deleteAuthorState || editAuthorState}
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
                <h6 className="card-title">Add Author</h6>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit3(onSubmit)}>
                  <div className="row pb-3">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Author Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Author Name</div>}
                        {...register3('AuthorName', { required: true })}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Author Name Bangla"
                        floatingLabel={<div style={{ color: '#808080' }}>Author Name Bangla</div>}
                        {...register3('AuthorNameBN', { required: true })}
                      />
                    </div>
                  </div>
                  <div className="row pb-3">
                    <div className="col-md-12">
                      <textarea
                        type="text"
                        className="form-control"
                        placeholder="Author Description"
                        {...register3('AuthorDesc', { required: true })}
                      />
                    </div>
                  </div>
                  <div className="row pb-3">
                    <div className="col-md-12">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        className="form-control-lg rounded-0"
                        {...register3('AuthorPhoto', { required: true })}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Add Author
                  </button>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              {authors.length > 0 && (
                <div>
                  {authors.map((author) => {
                    return (
                      <>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                          {/* <CTableDataCell>{pub.PublicationID}</CTableDataCell> */}
                          <div style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                            {author?.AuthorName}
                          </div>
                          <div className="text-center">
                            <CButton
                              className=" me-3"
                              style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                              onClick={() => onAuthorDelete(author?.AuthorID)}
                            >
                              <RiDeleteBinFill />
                            </CButton>
                            <CButton
                              onClick={() => {
                                setVisible(!visible)
                                setSelectedAuthorID(author?.AuthorID)
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
                </div>
              )}
              {/*author edit modal*/}
              <CModal
                alignment="center"
                visible={visible}
                onClose={() => setVisible(false)}
                backdrop={true}
              >
                <CModalHeader>
                  <CModalTitle>Edit Author</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm onSubmit={handleSubmit4(onAuthorEdit)}>
                    <div className="flex">
                      <div>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Author Name"
                          value={editedAuthorName}
                          onChange={(e) => setEditedAuthorName(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Author Name BN"
                          value={editedAuthorNameBN}
                          onChange={(e) => setEditedAuthorNameBN(e.target.value)}
                        />
                        <CFormInput
                          type="file"
                          accept="image/*"
                          className="form-control-lg rounded-0 mb-2"
                          {...register4('AuthorPhoto')}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Author Description"
                          row={5}
                          value={editedAuthorDescription}
                          onChange={(e) => setEditedAuthorDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <button className="btn btn-primary text-white my-3" type="submit">
                      Update Author
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

export default AddAuthors
