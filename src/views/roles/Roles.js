import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit3 } from 'react-icons/fi'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { usePromiseTracker } from 'react-promise-tracker'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'
import TableContainer from 'src/components/reusable/TableContainer'

const Roles = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm()

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    control: control2,
    reset: reset2,
  } = useForm()
  const [roles, setRoles] = useState([])
  const [addRoleState, setAddRoleState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const { promiseInProgress } = usePromiseTracker()
  const permissions = watch('permissions')

  const onSubmit = async (data) => {
    try {
      setAddRoleState(true)
      const newPermissionArray = permissions?.map((item) => item?.value)
      //console.log(newPermissionArray.join(','))
      const bodyFormData = new FormData()
      bodyFormData.append('username', data?.username)
      bodyFormData.append('password', data?.password)
      bodyFormData.append('fullName', data?.fullName)
      bodyFormData.append('permissions', newPermissionArray.join(','))

      const res = await axiosJWT.post(`${baseURL}/api/v1/admin/auth/new_user`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.status === 200) {
        setAddRoleState(false)
        setRoles([...roles, res?.data?.data])
      } else {
        setAddRoleState(false)
      }
    } catch (e) {
      setAddRoleState(false)
    }
  }

  useEffect(() => {
    const loadRoles = async () => {
      const response = await axiosJWT.get(`${baseURL}/api/v1/admin/auth/users`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setRoles(response?.data?.admins)
    }
    loadRoles()
  }, [token])

  const allPermissions = [
    {
      name: 'Manage Product',
      permID: 'MANAGE_PRODUCT',
    },
    {
      name: 'Manage Orders',
      permID: 'MANAGE_ORDERS',
    },
    {
      name: 'Manage Site Settings',
      permID: 'MANAGE_SITE_SETTINGS',
    },
    {
      name: 'Create Custom Order',
      permID: 'CREATE_CUSTOM_ORDER',
    },
    {
      name: 'Manage Blog',
      permID: 'MANAGE_BLOG',
    },
    {
      name: 'Manage Coupon',
      permID: 'MANAGE_COUPON',
    },
    {
      name: 'Manage Special Extra',
      permID: 'MANAGE_Special_Extra',
    },
    {
      name: 'Super Admin',
      permID: 'SUPER_ADMIN',
    },
  ]
  const permissionOption = allPermissions?.map((permission) => {
    // //console.log(permission)
    return {
      value: permission?.permID,
      label: permission?.name,
    }
  })

  const errorMessages = Object.keys(errors)

  return (
    <>
      <LoadingOverlay
        active={addRoleState}
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
            <TableContainer title="Add Roles">
              <div className="card-body">
                {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                  <div className="row">
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="username"
                        placeholder="Email or username"
                        floatingLabel={<div style={{ color: '#808080' }}>Email or username</div>}
                        {...register('username', { required: true })}
                        className="mb-3"
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="fullName"
                        placeholder="Full Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Full Name</div>}
                        {...register('fullName', { required: true })}
                        className="mb-3"
                      />
                    </div>
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="permissions"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            options={permissionOption}
                            placeholder="Select Role"
                            onChange={(option) => {
                              onChange(option)
                            }}
                            styles={selectCustomStyles}
                            isMulti
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="password"
                        placeholder="Password"
                        floatingLabel={<div style={{ color: '#808080' }}>Password</div>}
                        {...register('password', { required: true })}
                        className="mb-3"
                      />
                    </div>
                  </div>
                  <CButton className="text-white mt-3" type="submit">
                    Create
                  </CButton>
                </CForm>
              </div>
            </TableContainer>
          </div>
          <div className="mt-5">
            {promiseInProgress === false ? (
              <TableContainer title="All Users (ADMINS)">
                <div className="card-body">
                  <CTable>
                    <CTableHead>
                      <CTableRow style={{ background: '#F3F5F9' }}>
                        <CTableHeaderCell className="py-3" scope="col">
                          User Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Role
                        </CTableHeaderCell>
                        <CTableHeaderCell className="py-3" scope="col">
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {roles?.map((role) => (
                        <>
                          <CTableRow>
                            <CTableHeaderCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                              scope="row"
                            >
                              {role?.username}
                            </CTableHeaderCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {role?.FullName}
                            </CTableDataCell>
                            <CTableDataCell
                              style={{ color: '#8E98AA', fontSize: '14px' }}
                              className="pt-3"
                            >
                              {role?.Permissions?.join(', ')}
                            </CTableDataCell>
                            <CTableDataCell>
                              <Link
                                to={`/edit-role/${role?.AdminID}`}
                                className="mx-2 cursor-pointer bg-transparent border-0 edit_btn_hover"
                                style={{ color: '#8E98AA' }}
                              >
                                <FiEdit3 />
                              </Link>
                            </CTableDataCell>
                          </CTableRow>
                        </>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </TableContainer>
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

export default Roles
