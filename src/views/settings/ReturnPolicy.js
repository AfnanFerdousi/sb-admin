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

const ReturnPolicy = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm()

  const [addReturnPolicyState, setAddReturnPolicyState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (editorState) => setEditorState(editorState)

  useEffect(() => {
    const loadReturnPolicy = async () => {
      const res = await axios.get(`${baseURL}/api/v1/public/commoninfo/ReturnPolicy`)
      //console.log(res)
      if (res?.data?.status === 200) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(`${res?.data?.data?.ReturnPolicy}`)),
          ),
        )
      }
    }
    loadReturnPolicy()
  }, [])

  const onSubmit = async (data) => {
    try {
      const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      const bodyFormData = new FormData()
      bodyFormData.append('UpdatedText', content)

      setAddReturnPolicyState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/commoninfo/update-return-policy`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setAddReturnPolicyState(false)
        //swal('Success!', 'Return Policy added')
      } else {
        setAddReturnPolicyState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <>
      <LoadingOverlay
        active={addReturnPolicyState}
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
                <h5 className="card-title ">Return Policy</h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <Editor
                    editorState={editorState}
                    editorClassName="editor_container"
                    placeholder="Return Policy"
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

export default ReturnPolicy
