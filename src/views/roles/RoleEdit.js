/* eslint-disable */
import { CAlert, CButton, CForm, CFormInput } from '@coreui/react'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller, useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import Cookies from 'universal-cookie'
import { axiosJWT } from '../../axiosJWT'
import { baseURL } from '../../baseUrl'
import swal from 'sweetalert'

const RoleEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm()
  const [role, setRole] = useState({})
  const [addRoleState, setAddRoleState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')
  const permissions = watch('Permissions')
  //console.log('RoleEdit ~ permissions', permissions)
  const { id } = useParams()

  const onSubmit = async (data) => {
    try {
      setAddRoleState(true)
      //console.log('onSubmit ~ data', data)
      const newPermissionArray = permissions?.map((item) => item?.value)
      const bodyFormData = new FormData()
      bodyFormData.append('username', data?.username)
      bodyFormData.append('password', data?.Password)
      bodyFormData.append('fullName', data?.FullName)
      bodyFormData.append('permissions', newPermissionArray.join(','))
      bodyFormData.append('AdminID', id)

      const res = await axiosJWT.patch(`${baseURL}/api/v1/admin/auth/edit_user`, bodyFormData, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (res?.status === 200) {
        setAddRoleState(false)
        swal('Success!', 'Role Updated', 'success')
        
      } else {
        setAddRoleState(false)
        swal('Something went wrong', 'error')
      }
    } catch (e) {
      setAddRoleState(false)
      swal('Something went wrong', 'error')
    }
  }

  useEffect(() => {
    const loadSingleRole = async () => {
      const response = await axiosJWT.get(`${baseURL}/api/v1/admin/auth/users?AdminID=${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      setRole(response?.data?.admins[0])
      reset(response?.data?.admins[0])
      // reset(role)
    }
    loadSingleRole()
  }, [id, token, reset])
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

  const selectedPermissions = permissionOption.filter((option) =>
    role?.Permissions?.includes(option.value),
  )
  //console.log('RoleEdit ~ selectedPermissions', selectedPermissions)
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
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">Add Roles</h6>
              </div>
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
                        {...register('username')}
                        className="my-3"
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="fullName"
                        placeholder="Full Name"
                        floatingLabel={<div style={{ color: '#808080' }}>Full Name</div>}
                        {...register('FullName')}
                        className="mt-3"
                      />
                    </div>
                    <div className="col-md-6">
                      {selectedPermissions?.length > 0 && (
                        <Controller
                          control={control}
                          name="Permissions"
                          render={({ field: { onChange, value, ref, name } }) => (
                            <Select
                              defaultValue={selectedPermissions}
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
                      )}
                      
                    </div>
                    <div className="col-md-6">
                      <CFormInput
                        type="text"
                        id="password"
                        placeholder="Give New Password"
                        floatingLabel={<div style={{ color: '#808080' }}>Password</div>}
                        {...register('Password')}
                        className="mb-3"
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
        </div>
      </LoadingOverlay>
    </>
  )
}

export default RoleEdit
