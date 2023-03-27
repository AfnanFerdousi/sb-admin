/* eslint-disable */
import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'

import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

const EditHigherEducation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm()
  const [editInstituteState, setEditInstituteState] = useState(false)
  const [higherEdu, setHigherEdu] = useState({})

  const cookies = new Cookies()
  const token = cookies.get('token')
  const { id } = useParams()

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)

  const onSubmit = async (data) => {
    try {
      setEditInstituteState(true)
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const bodyFormData = new FormData()
      id && bodyFormData.append('InstituteID', id)
      data?.InstituteName && bodyFormData.append('InstituteName', data?.InstituteName)
      data?.Logo && bodyFormData.append('Logo', data?.Logo[0])
      data?.Picture && bodyFormData.append('Picture', data?.Picture[0])
      bodyFormData.append('ShortDesc', data?.ShortDesc)
      bodyFormData.append('Details', content)
      data?.RankNo && bodyFormData.append('RankNo', data?.RankNo)
      data?.Country && bodyFormData.append('Country', data?.Country)

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/higher-edu/edit`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.data?.status === 200) {
        setEditInstituteState(false)
        //swal('Success!', 'University Edited')
      } else {
        setEditInstituteState(false)

      }
    } catch (e) {
      setEditInstituteState(false)

    }
  }

  useEffect(() => {
    const loadSingleHE = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/higher-edu/universities/get-one?InstituteID=${id}`),
      )
      if (res?.data?.status === 200) {
        //console.log(res?.data?.data)
        setHigherEdu(res?.data?.data)
        const { InstituteName, ShortDesc, Details, RankNo, Country } = res?.data?.data
        reset({
          InstituteName,
          ShortDesc,
          Details,
          RankNo,
          Country,
        })

        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(`${res?.data?.data?.Details}`),
            ),
          ),
        )
      } else {

      }
    }
    loadSingleHE()
  }, [id])
  return (
    <LoadingOverlay
      active={editInstituteState}
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
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h6 className="card-title">Edit Higher Education</h6>
        </div>
        <div className="card-body">
          <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
            <div className="row">
              <div className="col-md-6">
                <CFormInput
                  type="text"
                  id="InstituteName"
                  placeholder="University Name"
                  {...register('InstituteName')}
                  floatingLabel={<div style={{ color: '#808080' }}>University Name</div>}                  
                  className="my-3"
                />
                <CFormInput
                  id="ShortDesc"
                  rows="3"
                  placeholder="Short Description"
                  floatingLabel={<div style={{ color: '#808080' }}>Short Description</div>}
                  {...register('ShortDesc')}
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
                      {...register('RankNo')}
                      className="my-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <CFormInput
                      type="text"
                      id="Country"
                      placeholder="Country"
                      floatingLabel={<div style={{ color: '#808080' }}>Country</div>}
                    
                      {...register('Country')}
                      className="my-3"
                    />
                  </div>
                </div>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="file"
                    accept="image/*"
                    id="Logo" {...register('Logo')} />
                  <CInputGroupText component="label" htmlFor="inputGroupFile02">
                    Upload Logo
                  </CInputGroupText>
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="file"
                    accept="image/*"
                    id="Picture"
                    {...register('Picture')} />
                  <CInputGroupText component="label" htmlFor="inputGroupFile02">
                    Upload Picture
                  </CInputGroupText>
                </CInputGroup>
              </div>
            </div>
            <CButton className="text-white my-3" type="submit">
              Update
            </CButton>
          </CForm>
        </div>
      </div>
    </LoadingOverlay>
  )
}

export default EditHigherEducation
