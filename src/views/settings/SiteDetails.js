/* eslint-disable */
import { CButton, CForm, CFormInput, CFormSwitch, CFormTextarea, CInputGroupText, CInputGroup } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import { FILE_UPLOAD } from 'src/api'

const SiteDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch
  } = useForm()

  const cookies = new Cookies()
  const token = cookies.get('token')
  const [site, setSite] = useState({})
  const Maintain = watch('MaintainenceMode');
  const [isUnderMaintainance, setIsUnderMaintainance] = useState(false)

  const onSubmit = async (data) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('SiteTitle', data?.SiteTitle)
      bodyFormData.append('SiteDescription', data?.SiteDescription)
      bodyFormData.append('MaintainenceMode', isUnderMaintainance)

      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/commoninfo/update_site_details`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        swal('Success!', 'Info Updated')
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const onNavLogoSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.navLogo[0])

      const imageRes = await axiosJWT
        .post(FILE_UPLOAD,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      if (imageRes?.data?.status !== 200) {
        return
      }
      // console.log(data);
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', "Logo")
      bodyFormData.append('AttributeValue', imageRes?.data?.data?.mediaLink)
      // bodyFormData.append('GrayLogo', data?.GrayLogo[0])

      const res = await axiosJWT.patch(
        `${baseURL}/api/v1/admin/commoninfo/UpdateAttribute`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        swal('Success!', 'Navbar Logo Updated')
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const onFooterLogoSubmit = async (data) => {
    try {
      const imageBodyFormData = new FormData()
      imageBodyFormData.append('file', data?.footer_logo[0])

      const imageRes = await axiosJWT
        .post(FILE_UPLOAD,
          imageBodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        })

      if (imageRes?.data?.status !== 200) {
        return
      }
      // console.log(data);
      const bodyFormData = new FormData()
      bodyFormData.append('AttributeName', "GrayLogo")
      bodyFormData.append('AttributeValue', imageRes?.data?.data?.mediaLink)
      // bodyFormData.append('GrayLogo', data?.GrayLogo[0])

      const res = await axiosJWT.patch(
        `${baseURL}/api/v1/admin/commoninfo/UpdateAttribute`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        swal('Success!', 'Footer Logo Updated')
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }


  useEffect(() => {
    const loadSiteDetails = async () => {
      const res = await axios.get(`${baseURL}/api/v1/public/commoninfo/SiteDetails`)
      setIsUnderMaintainance(res.data?.data?.SiteDetails?.MaintainenceMode)
      if (res?.status === 200) {
        setSite(res?.data?.data?.SiteDetails)
      }
    }
    loadSiteDetails()
  }, [])

  console.log(site)
  return (
    <>
      <div className="flex flex-column">
        <div>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Site Details Settings</h6>
            </div>
            <div className="card-body">
              <CForm onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    {' '}
                    <CFormInput
                      type="text"
                      id="SiteTitle"
                      {...register('SiteTitle')}
                      placeholder="Site Title"
                      defaultValue={site?.SiteTitle}
                      floatingLabel={<div style={{ color: '#808080' }}>Site Title</div>}
                      className="my-2"
                    />
                  </div>

                  {/* <div className="col-md-6">
                    <CInputGroup className="mt-2">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        id="SiteFavicon"
                        className='form-control-lg rounded-0'
                        {...register('SiteFavicon')}
                      />
                      <CInputGroupText component="label" htmlFor="inputGroupFile02">
                        Site Favicon
                      </CInputGroupText>
                    </CInputGroup>
                  </div> */}
                  <div className="col-md-6">
                    <CFormTextarea
                      id="SiteDescription"
                      rows="2"
                      defaultValue={site?.SiteDescription}
                      placeholder="Site Description"
                      {...register('SiteDescription')}
                      className="my-2"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <CFormSwitch
                      className="my-2"
                      label="Make Site Maintainence Mode"
                      checked={isUnderMaintainance}
                      onChange={(e) => setIsUnderMaintainance(e.target.checked)}
                    />
                  </div>
                </div>
                <CButton className="text-white" color="primary" type="submit">
                  Save
                </CButton>
              </CForm>
            </div>
            <div className="card-body mt-5">
              <div className="row">
                <div className="col-md-6">
                  <CForm onSubmit={handleSubmit(onNavLogoSubmit)}>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      id="update_logo"
                      className='form-control-lg rounded-0'
                      {...register('navLogo')}
                    />
                    <CButton className="text-white mt-2" color="primary" type="submit">
                      Submit Navbar Logo
                    </CButton>
                  </CForm>
                </div>

                <div className="col-md-6">
                  <CForm onSubmit={handleSubmit(onFooterLogoSubmit)}>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      id="update_logo"
                      className='form-control-lg rounded-0'
                      {...register('footer_logo')}
                    />
                    <CButton className="text-white mt-2" color="primary" type="submit">
                      Submit Footer Logo
                    </CButton>
                  </CForm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SiteDetails
