/* eslint-disable */
import { CButton, CForm, CFormInput } from '@coreui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Cookies from 'universal-cookie'
import Attributes from './Attributes'

const AddAttribute = () => {
  const { register, handleSubmit, control } = useForm()

  // Form values

  const [attributes, setAttributes] = useState([])
  const [addAttributeState, setAddAttributeState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const loadAttributes = async () => {
    const res = await axiosJWT.get(`${baseURL}/api/v1/admin/attribute`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    // setAttributes(res?.data?.attributes)
    if (res?.data?.attributes?.length > 0) {
      setAttributes(res?.data?.attributes)
    }
    // //console.log(res?.data)
  }

  useEffect(() => {
    loadAttributes()
  }, [token])

  const onSubmit = async (data) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', data?.AttributeName)
      setAddAttributeState(true)
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/attribute/new`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        //console.log('onSubmit ~ attributes ', attributes)
        setAddAttributeState(false)
        setAttributes([...attributes, res?.data?.attribute])
      } else {
        setAddAttributeState(false)
      }
    } catch (error) {
      //console.log(error)
    }
  }

  //console.log('onSubmit ~ attributes', attributes)
  return (
    <>
      <LoadingOverlay
        active={addAttributeState}
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
                <h6 className="card-title">Add Attributes</h6>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CFormInput
                        placeholder="Attribute Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Attribute Name</div>}
                        {...register('AttributeName', { required: true })}
                      />
                    </div>
                  </div>
                  <CButton className="text-white" type="submit">
                    Add Attribute
                  </CButton>
                </CForm>
              </div>
            </div>
          </div>
        </div>
        <Attributes
          attributes={attributes}
          setAttributes={setAttributes}
          loadAttributes={loadAttributes}
        />
      </LoadingOverlay>
    </>
  )
}

export default AddAttribute
