/* eslint-disable */
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { FiEdit3 } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link } from 'react-router-dom'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'

import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

const AddHigherEducation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()
  const [universities, setUniversities] = useState([])
  const [addInstituteState, setAddInstitute] = useState(false)
  const [deleteInstituteState, setDeleteInstitute] = useState(false)
  const { promiseInProgress } = usePromiseTracker()

  const cookies = new Cookies()
  const token = cookies.get('token')

   const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const onSubmit = async (data) => {
    try {
      setAddInstitute(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const bodyFormData = new FormData()
      bodyFormData.append('Logo', data?.Logo[0])
      bodyFormData.append('Picture', data?.Picture[0])
      bodyFormData.append('InstituteName', data?.InstituteName)
      bodyFormData.append('ShortDesc', data?.ShortDesc)
      bodyFormData.append('Details', content)
      bodyFormData.append('RankNo', data?.RankNo)
      bodyFormData.append('Country', data?.Country)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/higher-edu/new`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        //swal('Success!', 'University Created')
        setUniversities([...universities, res.data?.data])
        setAddInstitute(false)
      } else {
        setAddInstitute(false)

      }
    } catch (e) {
      setAddInstitute(false)

    }
  }

  const contestDelete = async (id) => {
    try {
      setDeleteInstitute(true)
      const deleted = await axiosJWT.post(
        `${baseURL}/api/v1/admin/higher-edu/delete?InstituteID=${id}`,
      )
      if (deleted?.data?.status === 200) {
        setDeleteInstitute(false)
        //swal('Success!', 'Contest Deleted')
        setUniversities(universities.filter((institute) => institute?.InstituteID !== id))
      } else {
        setDeleteInstitute(false)

      }
    } catch (e) {
      setDeleteInstitute(false)

    }
  }

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const res = await trackPromise(
          axios.get(`${baseURL}/api/v1/public/higher-edu/universities`),
        )
        if (res.status === 200) {
          setUniversities(res?.data?.data)
        }
      } catch (e) {
        //console.log('Something was wrong')
      }
    }
    loadUniversities()
  }, [])

  const errorMessages = Object.keys(errors)

  return (
    <>
      <LoadingOverlay
        active={addInstituteState || deleteInstituteState}
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
                <h6 className="card-title">Add Higher Education</h6>
              </div>
              <div className="card-body">
                {errorMessages.length > 0 && <CAlert>Please fill the required fields</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                  <div className="row">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="InstituteName"
                        placeholder="University Name"
                        floatingLabel={<div style={{ color: '#808080' }}>University Name</div>}
                        {...register('InstituteName', { required: true })}
                        className="my-3"
                      />
                      <CFormInput
                        id="ShortDesc"
                        floatingLabel={<div style={{ color: '#808080' }}>Short Description</div>}
                        placeholder="Short Description"
                        {...register('ShortDesc', { required: true })}
                        className="my-3"
                      />

                      <Editor
                        editorState={editorState}
                        rows={5}
                        editorClassName="editor_container"
                        placeholder="University Details"
                        onEditorStateChange={onEditorStateChange}
                        handlePastedText={() => false}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <CFormInput
                            type="text"
                            id="RankNo"
                            placeholder="Rank No"
                            floatingLabel={<div style={{ color: '#808080' }}>Rank No</div>}
                            {...register('RankNo', { required: true })}
                            className="my-3"
                          />
                        </div>
                        <div className="col-md-6">
                          <CFormInput
                            type="text"
                            id="Country"
                            placeholder="Country"
                            floatingLabel={<div style={{ color: '#808080' }}>Country</div>}
                            {...register('Country', { required: true })}
                            className="my-3"
                          />
                        </div>
                      </div>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          id="Logo"
                          className='form-control-lg rounded-0'
                          {...register('Logo', { required: true })}
                        />
                        <CInputGroupText component="label" htmlFor="inputGroupFile02">
                          Upload Logo
                        </CInputGroupText>
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CFormInput
                          type="file"
                          accept="image/*"
                          id="Picture"
                          className='form-control-lg rounded-0'
                          {...register('Picture', { required: true })}
                        />
                        <CInputGroupText component="label" htmlFor="inputGroupFile02">
                          Upload Picture
                        </CInputGroupText>
                      </CInputGroup>
                    </div>
                  </div>
                  <CButton className="text-white my-3" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {promiseInProgress === false ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Manage Higher Education</h6>
                </div>
                <div className="card-body">
                  <CTable>
                    <CTableHead>
                      <CTableRow style={{ background: '#F3F5F9' }}>
                        <CTableHeaderCell className="py-3" scope="col">
                          University Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Rank No
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Country
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {universities.map((uni) => (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                              scope="row"
                            >
                              {uni?.InstituteName}
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {uni?.RankNo}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {uni?.Country}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                style={{ color: '#8E98AA' }}
                                onClick={() => contestDelete(uni?.InstituteID)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                              <Link to={`/edit-higher-education/${uni?.InstituteID}`}>
                                <FiEdit3
                                  className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                  style={{ color: '#8E98AA' }}
                                />
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      ))}
                    </CTableBody>
                  </CTable>
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
    </>
  )
}

export default AddHigherEducation
