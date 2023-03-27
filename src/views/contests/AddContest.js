/* eslint-disable */
import {
  CAlert,
  CBadge,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const AddContest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()
  const [contests, setContests] = useState([])
  const [addContestState, setAddContestState] = useState(false)
  const [deleteContestState, setDeleteContestState] = useState(false)
  const { promiseInProgress } = usePromiseTracker()

  const cookies = new Cookies()
  const token = cookies.get('token')

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [prizeEditorState, setPrizeEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)
  const onPrizeEditorState = (prizeEditorState) => setPrizeEditorState(prizeEditorState)

  const onSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.ContestBanner[0])

      const imageRes = await axiosJWT
        .post(`${baseURL}/api/v1/admin/upload/single`,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      console.log(imageRes)

      if (!imageRes?.data?.status === 200) {
        return
      }

      setAddContestState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      const prize = draftToHtml(convertToRaw(prizeEditorState.getCurrentContent()))

      const contestPrizes = prize.split(/\n/)
      const bodyFormData = new FormData()
      bodyFormData.append('ContestStatus', data?.ContestStatus)
      bodyFormData.append('ContestName', data?.ContestName)
      bodyFormData.append('ContestDescription', content)
      bodyFormData.append('RegistrationURL', data?.RegistrationURL)
      bodyFormData.append('ContestStartDate', data?.ContestStartDate)
      bodyFormData.append('LastDateOfRegistration', data?.LastDateOfRegistration)
      bodyFormData.append('ContestBanner', imageRes.data?.data?.mediaLink)
      bodyFormData.append('ContestPrizes', contestPrizes)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/contests/`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setAddContestState(false)
        //swal('Success!', 'Contest Created')
        setContests([...contests, res.data?.contest])
      } else {
        setAddContestState(false)

      }
    } catch (e) {
      setAddContestState(false)

    }
  }

  const contestDelete = async (id) => {
    try {
      setDeleteContestState(true)
      const deleted = await axiosJWT.post(
        `${baseURL}/api/v1/admin/contests/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (deleted?.data?.status === 200) {
        setDeleteContestState(false)
        //swal('Success!', 'Contest Deleted')
        setContests(contests.filter((contest) => contest?.ContestID !== id))
      } else {
        setDeleteContestState(false)

      }
    } catch (e) {
      setDeleteContestState(false)

    }
  }

  useEffect(() => {
    const loadContests = async () => {
      try {
        const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/contests/`))
        if (res.status === 200) {
          setContests(res?.data)
        }
      } catch (e) {
        //console.log('Something was wrong')
      }
    }
    loadContests()
  }, [])

  const errorMessages = Object.keys(errors)
  return (
    <>
      <LoadingOverlay
        active={addContestState || deleteContestState}
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
                <h6 className="card-title">Add Contest</h6>
              </div>
              <div className="card-body">
                {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                  <CFormSwitch
                    className="d-flex justify-content-end gap-2"
                    label="Open contest"
                    id="ContestStatus"
                    {...register('ContestStatus', { required: true })}
                  />
                  <div className="row">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="ContestName"
                        placeholder="Contest Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Contest Name</div>}
                        {...register('ContestName', { required: true })}
                        className="my-3"
                      />
                      <Editor
                        editorState={editorState}
                        rows={5}
                        editorClassName="editor_container"
                        placeholder="Description"
                        onEditorStateChange={onEditorStateChange}
                        handlePastedText={() => false}
                      />
                      <CFormInput
                        type="text"
                        id="RegistrationURL"
                        placeholder="Registration Link"
                        floatingLabel={<div style={{ color: '#808080' }}>Registration Link</div>}
                        {...register('RegistrationURL', { required: true })}
                        className="my-3"
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="row my-3">
                        <div className="col-md-6">
                          <Controller
                            control={control}
                            name="ContestStartDate"
                            render={({ field }) => (
                              <DatePicker
                                placeholderText="Start offer"
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                className="form-control"
                                wrapperClassName="date_picker"
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-6">
                          <Controller
                            control={control}
                            name="LastDateOfRegistration"
                            render={({ field }) => (
                              <DatePicker
                                placeholderText="Last Date"
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                className="form-control"
                                wrapperClassName="date_picker"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <CFormInput
                        type="file"
                        accept="image/*"
                        id="ContestBanner"
                        {...register('ContestBanner', { required: true })}
                        className="my-3 form-control-lg rounded-0"
                      />
                      <Editor
                        editorState={prizeEditorState}
                        rows={5}
                        editorClassName="editor_container"
                        placeholder="Prizes: Use enter to seperate each prize"
                        onEditorStateChange={onPrizeEditorState}                        
                        handlePastedText={() => false}
                      />
                    </div>
                  </div>
                  <CButton className="text-white" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">Manage Contest</h6>
              </div>
              <div className="card-body">
                {promiseInProgress === false ? (
                  <CTable>
                    <CTableHead>
                      <CTableRow style={{ background: '#F3F5F9' }}>
                        <CTableHeaderCell className="py-3" scope="col">
                          Contest Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Status
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Days Left
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {contests?.map((contest) => (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                              scope="row"
                            >
                              {contest?.ContestName}
                            </CTableHeaderCell>
                            <CTableDataCell className="pt-3">
                              {contest?.ContestStatus === true ? (
                                <CBadge color="success" shape="rounded-pill">
                                  Open
                                </CBadge>
                              ) : (
                                <CBadge color="danger" shape="rounded-pill">
                                  Closed
                                </CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {contest?.ContestStatus !== true
                                ? 'Closed'
                                : moment(contest?.LastDateOfRegistration).startOf('day').fromNow()}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                style={{ color: '#8E98AA' }}
                                onClick={() => contestDelete(contest?.ContestID)}
                              >
                                <RiDeleteBinFill />
                              </CButton>
                              <Link to={`/edit-contest/${contest?.ContestID}`}>
                                <CButton
                                  className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                  style={{ color: '#8E98AA' }}
                                >
                                  <FiEdit />
                                </CButton>
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      ))}
                    </CTableBody>
                  </CTable>
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
          </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default AddContest
