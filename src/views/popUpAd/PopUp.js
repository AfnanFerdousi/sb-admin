/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CTableDataCell,
  CModal,
  CModalBody,
  CModalHeader,
  CModaltitle,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
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
import ModalImage from 'react-modal-image'

const PopUp = () => {
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

  const [popups, setPopups] = useState([])
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const [addCatState, setAddCatState] = useState(false)
  const [deleteCatState, setDeleteCatState] = useState(false)
  const [productImage, setProductImage] = useState()

  const loadPopUp = async () => {
    const res = await axiosJWT.get(`${baseURL}/api/v1/public/popup/`)
    if (res?.status == 200) {
      setPopups(res.data?.data)
      console.log(res?.data?.data)
    }
  }

  const onSubmit = async (data) => {

    try {

      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.image[0])

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


      //console.log(data)
      const bodyFormData = new FormData()
      bodyFormData.append('title', data?.title)
      bodyFormData.append('url', data?.url)
      bodyFormData.append('image', imageRes.data?.data?.mediaLink)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/popup/`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      //console.log(res.data)
      if (res?.data?.status === 200) {
        setAddCatState(false)
        setPopups([...popups, res?.data])
        loadPopUp()
      } else {
        setAddCatState(false)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const onDelete = async (popupId) => {
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
            `${baseURL}/api/v1/admin/popup/${popupId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )
          if (res?.status === 200) {
            setPopups(popups.filter((popup) => popup.popupId !== popupId))
            setDeleteCatState(false)
            loadPopUp()
          } else {
            setDeleteCatState(false)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadPopUp()
  }, [token])

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
                <h6 className="card-title">Add PopUp Ad</h6>
              </div>

              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row pb-3">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Ad title"
                        floatingLabel={<div style={{ color: '#808080' }}>Ad title</div>}
                        {...register('title', { required: true })}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        className="form-control"
                        placeholder="Link"
                        floatingLabel={<div style={{ color: '#808080' }}>Link</div>}
                        {...register('url', { required: true })}
                      />
                    </div>
                  </div>
                  <div className="row pb-3">
                    <div className="col-md-6">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        id="thumbnail"
                        {...register('image', { required: true })}
                        className="mb-3 form-control-lg rounded-0"
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Create
                  </button>
                </CForm>
              </div>
            </div>
          </div>
          {promiseInProgress === false ? (
            <div className="mt-5">
              <h6 className="card-title">Manage Pop Up Ads</h6>
              {popups && (
                <>
                  <CTable>
                    {popups.map((popup) => {
                      return (
                        <>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center ps-2">
                            <CTableDataCell style={{ width: '6rem' }}>
                              <ModalImage
                                // className="w-50"
                                style={{ width: '6rem' }}
                                small={popup?.image}
                                large={popup?.image}
                                alt={`${popup?.title}`}
                              />
                            </CTableDataCell>
                            <CTableDataCell style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                              {popup?.title}
                            </CTableDataCell>
                            <CTableDataCell >
                              <CButton
                                className=" me-3"
                                style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                onClick={() => onDelete(popup?.popupId)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                            </CTableDataCell>
                          </div>
                        </>
                      )
                    })}

                  </CTable>
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

export default PopUp;