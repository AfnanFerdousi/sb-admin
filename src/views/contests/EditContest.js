/* eslint-disable */
import { CButton, CForm, CFormInput, CFormSwitch, CFormTextarea } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { baseURL } from '../../baseUrl'

import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import moment from 'moment'

const EditContest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm()
  const [contests, setContests] = useState([])
  const [contest, setContest] = useState({})
const [blogImage, setBlogImage] = useState()
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { id } = useParams()

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [prizeEditorState, setPrizeEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)
  const onPrizeEditorState = (prizeEditorState) => setPrizeEditorState(prizeEditorState)

  const onSubmit = async (data) => {
    try {
      if (typeof data?.ContestBanner === 'object' && data?.ContestBanner?.length !== 0) {
                const formData = new FormData()
                formData.append('file', data?.ContestBanner[0])
                const config = {
                    headers: {
                        Authorization: `${token}`,
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'multipart/form-data',
                    },
                }
                const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)
                if (!res?.data?.status === 200 && data?.ContestBanner[0]) {
                    return
                }
                setBlogImage(res?.data?.data?.mediaLink)
            } else {
                setBlogImage(data?.ContestBanner)
            }

      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      const prize = draftToHtml(convertToRaw(prizeEditorState.getCurrentContent()))
      const contestPrizes = prize.split(/\n/)
      //console.log(contestPrizes)
      const bodyFormData = new FormData()
      data?.ContestStatus && bodyFormData.append('ContestStatus', data?.ContestStatus)
      id && bodyFormData.append('ContestID', id)
      data?.ContestName && bodyFormData.append('ContestName', data?.ContestName)
      bodyFormData.append('ContestDescription', content)
      data?.RegistrationURL && bodyFormData.append('RegistrationURL', data?.RegistrationURL)
      data?.ContestStartDate && bodyFormData.append('ContestStartDate', data?.ContestStartDate)
      data?.LastDateOfRegistration &&
        bodyFormData.append('LastDateOfRegistration', data?.LastDateOfRegistration)
      data?.ContestBanner[0] && bodyFormData.append('ContestBanner',blogImage)
      bodyFormData.append('ContestPrizes', contestPrizes)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/contests/edit`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      //console.log(res)

      if (res.status === 200) {
        //swal('Success!', 'Contest Editted')
        setContests([...contests, res.data?.contest])
        
      }
    } catch (e) {
      //console.log(e)
    }
  }

  useEffect(() => {
    const loadSingleContest = async () => {
      const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/contests/${id}`))
      if (res?.data?.status === 200) {
        //console.log(res?.data?.contest)
        setContest(res?.data?.contest)
        const { ContestName, ContestStatus, ContestDescription, ContestPrizes, RegistrationURL } =
          res?.data?.contest
        reset({
          ContestName,
          ContestStatus,
          ContestDescription,
          ContestPrizes,
          RegistrationURL,
        })

        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(`${res?.data?.contest?.ContestDescription}`)),
          ),
        )
        setPrizeEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(`${res?.data?.contest?.ContestPrizes}`)),
          ),
        )
      } else {

      }
    }
    loadSingleContest()
  }, [id])

  const contestStart = moment(contest?.ContestStartDate).format('MM/DD/YYYY')
  const contestEnd = moment(contest?.LastDateOfRegistration).format('MM/DD/YYYY')
  console.log(contest)
  console.log(contestStart)
  console.log(contestEnd)
  return (
    <div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="card-title">Edit Contests</h6>
        </div>
        <div className="card-body">
          <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
            <CFormSwitch
              className="d-flex justify-content-end gap-2"
              label="Open contest"
              id="ContestStatus"
              {...register('ContestStatus')}
            />
            <div className="row">
              <div className="col-md-6">
                <CFormInput
                  type="text"
                  id="ContestName"
                  placeholder="Contest Name"
                  floatingLabel={<div style={{ color: '#808080' }}>Contest Name</div>}
                  {...register('ContestName')}
                  className="my-3"
                />
                <label style={{ color: '#808080', fontSize: '13px', fontWeight: '600' }}>Description</label>
                <Editor
                  editorState={editorState}
                  rows={5}
                  editorClassName="editor_container"
                  placeholder="Description"
                  value={contest?.ContestDescription}
                  onEditorStateChange={onEditorStateChange}
                  handlePastedText={() => false}
                  
                />
                <label className="mt-3" style={{ color: '#808080', fontSize: '13px', fontWeight: '600' }}>Prizes: Use enter to seperate each prize</label>
                <Editor
                  editorState={prizeEditorState}
                  rows={5}
                  editorClassName="editor_container"
                  placeholder="Prizes: Use enter to seperate each prize"
                  onEditorStateChange={onPrizeEditorState}
                  handlePastedText={() => false}
                  className="mb-3"
                />
               
              </div>
              <div className="col-md-6">
                <div className="row my-3">
                  <div className="col-md-6">
                    {contestStart !== " " && (
                      <>
                        <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>Start date</label>
                        <Controller
                          control={control}
                          name="ContestStartDate"
                          render={({ field }) => (
                            <DatePicker
                              placeholderText="Start offer"
                              onChange={(date) => field.onChange(date)}
                              isClearable
                              value={field?.value ? field?.value : contestStart}
                              selected={field?.value}
                              className="form-control"
                              wrapperClassName="date_picker"
                            />
                          )}
                        />
                      </>
                    )}
                    
                  </div>
                  <div className="col-md-6">
                    {contestEnd !== " " && (
                      <>
                        <label style={{ color: '#808080', fontSize: '12px', fontWeight: '600' }}>Start date</label>
                        <Controller
                          control={control}
                          name="LastDateOfRegistration"
                          render={({ field }) => (
                            <DatePicker
                              placeholderText="Last Date"
                              onChange={(date) => field.onChange(date)}
                              isClearable
                              value={field?.value ? field?.value : contestEnd}
                              selected={field?.value}
                              className="form-control"
                              wrapperClassName="date_picker"
                            />
                          )}
                        />
                      </>
                    )}
                    
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control my-3"
                  {...register('ContestBanner')}
                 
                />
                <CFormInput
                  type="text"
                  id="RegistrationURL"
                  placeholder="Registration Link"
                  floatingLabel={<div style={{ color: '#808080' }}>Registration Link</div>}
                  {...register('RegistrationURL')}
                  className="my-3"
                />
              </div>
            </div>
            <CButton className="text-white mt-3" type="submit">
              Update
            </CButton>
          </CForm>
        </div>
      </div>
    </div>
  )
}

export default EditContest
