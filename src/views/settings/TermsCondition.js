/* eslint-disable */
import { CForm } from '@coreui/react'
import axios from 'axios'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const TermsCondition = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [addTermConditionState, setAddTermConditionsState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => setEditorState(editorState)

  useEffect(() => {
    const loadTermsCondition = async () => {
      const res = await axios.get(`${baseURL}/api/v1/public/commoninfo/TermsCondition`)
      if (res?.data?.status === 200) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(`${res?.data?.data?.TermsCondition}`),
            ),
          ),
        )
      }
    }
    loadTermsCondition()
  }, [])

  const onSubmit = async (data) => {
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

      const bodyFormData = new FormData()
      bodyFormData.append('UpdatedText', content)

      setAddTermConditionsState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/commoninfo/update-terms-condition`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setAddTermConditionsState(false)
        //swal('Success!', 'Terms & Conditions added')
      } else {
        setAddTermConditionsState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <>
      <LoadingOverlay
        active={addTermConditionState}
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
        <div className="flex flex-column mt-5">
          <div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title ">Terms And Conditions</h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <Editor
                    editorState={editorState}
                    editorClassName="editor_container"
                    placeholder="Terms And Conditions"
                    onEditorStateChange={onEditorStateChange}
                    handlePastedText={() => false}
                  />

                  <button className="btn btn-primary text-white my-3 px-4" type="submit">
                    Add
                  </button>
                </CForm>
              </div>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default TermsCondition
