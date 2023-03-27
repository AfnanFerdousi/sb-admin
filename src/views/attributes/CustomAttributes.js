/* eslint-disable */
import {
  CButton,
  CForm,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
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
import Cookies from 'universal-cookie'

const CustomAttributes = ({ attributes, setAttributes, loadAttributes }) => {
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    control: control2,
  } = useForm()
  const { promiseInProgress } = usePromiseTracker()
  const [deleteAttributeState, setDeleteAttributeState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [visible, setVisible] = useState(false)
  const [selectedAttributeName, setSelectedAttributeName] = useState(null)
  const [editedAttributeName, setEditedAttributeName] = useState('')

  useEffect(() => {
    const attribute = attributes.filter((att) => att?.AttributeName === selectedAttributeName)
    setEditedAttributeName(attribute[0]?.AttributeName)
  }, [selectedAttributeName, attributes])

  const onEdit = async (data) => {
    try {
      console.log(data)
      const bodyFormData = new FormData()
      bodyFormData.append('NewAttributeName', data.NewAttributeName)
      bodyFormData.append('AttributeName', editedAttributeName)
      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/attribute/edit`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      })
      if (res?.data?.status === 200) {
        setVisible(false)
        loadAttributes()
      } else {
        setVisible(false)
      }
    } catch (error) {
      //console.log(error.response)
    }
  }

  const onDelete = async (AttributeName) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', AttributeName)
      setDeleteAttributeState(true)
      const res = await axiosJWT.delete(
        `${baseURL}/api/v1/admin/attribute/delete?AttributeName=${AttributeName}`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        //console.log(res?.data)
        setAttributes(attributes.filter((attribute) => attribute.AttributeName !== AttributeName))
        setDeleteAttributeState(false)
      } else {
        setDeleteAttributeState(false)
      }
    } catch (error) {
      //console.log(error)
    }
  }
  return (
    <>
      <LoadingOverlay
        active={deleteAttributeState}
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
        {promiseInProgress === false ? (
          <div className="mt-3">
            <div className="card border-0 shadow-sm">
              <CTable>
                <CTableBody>
                  {attributes.map((attribute) => (
                    <>
                      <div
                        className="d-flex justify-content-between align-items-center py-2"
                        style={{ backgroundColor: '#EAFFEA', marginBottom: '3px' }}
                      >
                        <div style={{ color: '#8E98AA', fontSize: '14px', fontWeight: 500 }}>
                          {attribute?.AttributeName}
                        </div>
                        <div className="text-center">
                          <CButton
                            className=" me-3"
                            style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                            onClick={() => onDelete(attribute?.AttributeName)}
                          >
                            <RiDeleteBinFill />
                          </CButton>
                          <CButton
                            onClick={() => {
                              setVisible(!visible)
                              setSelectedAttributeName(attribute?.AttributeName)
                            }}
                            style={{ background: 'none', border: 'none', color: '#8E98AA' }}
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
                              <CModalTitle>Edit Attribute</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                              <CForm onSubmit={handleSubmit2(onEdit)}>
                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="mb-2">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Attribute Name"
                                        defaultValue={editedAttributeName}
                                        onChange={(e) => setEditedAttributeName(e.target.value)}
                                        {...register2('NewAttributeName')}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <button className="btn btn-primary text-white my-3" type="submit">
                                  Update
                                </button>
                              </CForm>
                            </CModalBody>
                          </CModal>
                        </div>
                      </div>
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
      </LoadingOverlay>
    </>
  )
}
export default CustomAttributes
