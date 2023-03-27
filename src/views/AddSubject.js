/* eslint-disable */
import {
  CButton,
  CForm,
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
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Fill } from 'react-icons/ri'
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

const AddSubject = () => {
  const cookies = new Cookies()
  const token = cookies.get('token')

  // create subject
  const { register, handleSubmit, control } = useForm()
  // update subject
  const { register: register2, handleSubmit: handleSubmit2 } = useForm()

  const { promiseInProgress } = usePromiseTracker()

  const [subjects, setSubjets] = useState([])
  const [visible, setVisible] = useState(false)
  const [addSubjectState, setAddSubjectState] = useState(false)
  const [deleteSubjectState, setDeleteSubjectState] = useState(false)
  const [editSubjectState, setEditSubjectState] = useState(false)

  useEffect(() => {
    const loadSubjects = async () => {
      const response = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/subject/all_subjects?limit=100000000`),
      )
      setSubjets(response?.data?.subjects)
    }
    loadSubjects()
  }, [token])

  const onSubEdit = async (data) => {
    try {
      setVisible(false)
      setEditSubjectState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('NewSubjectName', data?.NewSubjectName)
      bodyFormData.append('SubjectName', data?.SubjectName)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/subject/edit`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setEditSubjectState(false)
        const newSubjects = subjects.map((subject) => {
          if (subject.SubjectID === data?.SubjectID) {
            return {
              ...subject,
              SubjectName: data?.NewSubjectName,
            }
          }
          return subject
        })
        setSubjets(newSubjects)
        // swal('Success', 'Updated Subject').then(() => {
        //   window.location.reload()
        // })
      } else {
        setEditSubjectState(false)

      }
    } catch (error) {
      setVisible(false)
    }
  }

  const onSubjectSubmit = async (data) => {
    try {
      setAddSubjectState(true)
      const bodyFormData = new FormData()
      bodyFormData.append('SubjectName', data?.SubjectName)
      bodyFormData.append('SubjectBanner', data?.SubjectBanner[0])
      bodyFormData.append('ProductType', data?.ProductType)
      //console.log(data?.SubjectBanner[0])

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/subject/new`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setSubjets([...subjects, res.data.subject])
        setAddSubjectState(false)
        // swal('Success', 'Inserted subjects')/
      } else {
        setAddSubjectState(false)
        // swal('Oh no', 'Something went wrong', 'error')
      }
    } catch (e) {
      setAddSubjectState(false)
      // swal('Oh no', 'Something went wrong', 'error')
    }
  }

  const onSubjectDelete = async (SubjectName) => {
    try {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          setDeleteSubjectState(true)
          const res = await axiosJWT.post(
            `${baseURL}/api/v1/admin/subject/delete/${SubjectName}`,
            {},
            {
              headers: {
                Authorization: `${token}`,
              },
            },
          )
          if (res.data?.status === 200) {
            setDeleteSubjectState(false)
            setSubjets(subjects.filter((subject) => subject.SubjectName !== SubjectName))
            // swal('Success', 'Delete Success')
          } else {
            setDeleteSubjectState(false)
          }
        }
      })
    } catch (error) {
      setDeleteSubjectState(false)
    }
  }

  const productTypes = [
    { value: 'BOOK', label: 'Book' },
    { value: 'FASHION', label: 'Fashion' },
    { value: 'STATIONARY', label: 'Stationary' },
  ]

  return (
    <LoadingOverlay
      active={addSubjectState || deleteSubjectState || editSubjectState}
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
              <h6 className="card-title">Add Subject</h6>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubjectSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject Name"
                        {...register('SubjectName', { required: true })}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        {...register('SubjectBanner', { required: true })}
                      />
                    </div>

                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="ProductType"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            options={productTypes}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Select Product Type</div>}
                            placeloder="Select Product Type"
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
                  <button className="btn btn-primary text-white my-3" type="submit">
                    Add Subject
                  </button>
                </CForm>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-5" style={{ height: '35rem', overflowY: 'scroll' }}>
          {promiseInProgress === false ? (
            <div className="">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Manage Subjects</h6>
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
                        <CTableHeaderCell className="py-3 text-center" scope="col">
                          Actions
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {subjects.map((subject) => {
                        return (
                          <>
                            <CTableRow style={{ color: '#8E98AA' }}>
                              <CTableHeaderCell
                                style={{ color: '#8E98AA' }}
                                className="pt-3"
                                scope="row"
                              >
                                {subject?.SubjectID}
                              </CTableHeaderCell>
                              <CTableDataCell style={{ color: '#8E98AA' }} className="pt-3">
                                {subject?.SubjectName}
                              </CTableDataCell>
                              <CTableDataCell className="text-center">
                                <CButton
                                  className="text-white"
                                  onClick={() => onSubjectDelete(subject.SubjectName)}
                                >
                                  <RiDeleteBin5Fill />
                                </CButton>
                                {/* subject */}
                                <CButton
                                  onClick={() => setVisible(!visible)}
                                  className="text-white cursor-pointer mx-2"
                                  color="success"
                                >
                                  <FiEdit />
                                </CButton>
                                <CModal
                                  alignment="center"
                                  visible={visible}
                                  onClose={() => setVisible(false)}
                                  backdrop={true}
                                >
                                  <CModalHeader>
                                    <CModalTitle>Edit Subject</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <CForm onSubmit={handleSubmit2(onSubEdit)}>
                                      <div className="flex">
                                        <div>
                                          <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="New Subject Name"
                                            {...register2('NewSubjectName')}
                                          />
                                          <input
                                            type="text"
                                            className="form-control mb-2 d-none"
                                            defaultValue={`${subject?.SubjectName}`}
                                            {...register2('SubjectName')}
                                            readOnly
                                          />
                                        </div>
                                      </div>

                                      <button
                                        className="btn btn-primary text-white my-3"
                                        type="submit"
                                      >
                                        Update Subject
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
        </div>
      </div>
    </LoadingOverlay>
  )
}

export default AddSubject
