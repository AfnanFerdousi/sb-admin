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

const FooterDetails = () => {
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
    const onSubmit = async (data) => {
        try {
            const bodyFormData = new FormData()
            bodyFormData.append('Email', data?.Email)
            bodyFormData.append('OfficeAddress', data?.OfficeAddress)
            bodyFormData.append('Phone', data?.Phone)
            bodyFormData.append('FooterDescription', data?.FooterDescription)

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
                swal('Success!', 'Footer Updated')
            }
        } catch (e) {
            console.log(e.message)
        }
    }

  
    useEffect(() => {
        const loadSiteDetails = async () => {
            const res = await axios.get(`${baseURL}/api/v1/public/commoninfo`)
            if (res?.status === 200) {
                setSite(res?.data?.attributes)
                console.log(res?.data?.attributes)
            }
        }
        loadSiteDetails()
    }, [])

    console.log(site)
    return (
        <>
            <div className="flex flex-column mt-4">
                <div>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="card-title">Footer Settings</h6>
                        </div>
                        <div className="card-body">
                            <CForm onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-md-6">
                                        {' '}
                                        <CFormInput
                                            type="text"
                                            id="Email"
                                            {...register('Email')}
                                            placeholder="Email"
                                            defaultValue={site?.Email}
                                            floatingLabel={<div style={{ color: '#808080' }}>Email</div>}
                                            className="my-2"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        {' '}
                                        <CFormInput
                                            type="text"
                                            id="Phone"
                                            {...register('Phone')}
                                            placeholder="Phone"
                                            defaultValue={site?.Phone}
                                            floatingLabel={<div style={{ color: '#808080' }}>Phone</div>}
                                            className="my-2"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        {' '}
                                        <CFormInput
                                            type="text"
                                            id="OfficeAddress"
                                            {...register('OfficeAddress')}
                                            placeholder="Office Address"
                                            defaultValue={site?.OfficeAddress}
                                            floatingLabel={<div style={{ color: '#808080' }}>Office Address</div>}
                                            className="my-2"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <CFormTextarea
                                            id="FooterDescription"
                                            rows="5"
                                            defaultValue={site?.FooterDescription}
                                            placeholder="Footer Description"
                                            {...register('FooterDescription')}
                                            className="my-2"
                                        />
                                    </div>
                                </div>
                                <CButton className="text-white" color="primary" type="submit">
                                    Save
                                </CButton>
                            </CForm>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FooterDetails
