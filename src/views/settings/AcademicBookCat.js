/* eslint-disable */
import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CButton,
    CForm,
    CFormInput,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { FILE_UPLOAD } from 'src/api'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const AcademicBookCat = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm()

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        watch: watch2,
        control: control2,
    } = useForm()

    // Form values

    const [academicCat, setAcademicCat] = useState([])
    const [academicCategories, setAcademicCategories] = useState([])
    const { promiseInProgress } = usePromiseTracker()
    const [addAcademicCategories, setAddAcademicCategories] = useState(false)
    const [deleteAcademicCategories, setDeleteAcademicCategories] = useState(false)
    const [visible, setVisible] = useState(false)
    const [selectedCatID, setSelectedCatID] = useState(null)
    const [edittedCatDesc, setEdittedCatDesc] = useState(null)
    const [edittedAcaIcon, setEdittedAcaIcon] = useState(null)
    const cookies = new Cookies()
    const token = cookies.get('token')

    const [selectedCategory, setSelectedCategory] = useState('0')
    const [categoryOptions, setCategoryOptions] = useState([])

    useEffect(() => {
        const category = academicCategories.filter((category) => category?.CategoryID === selectedCatID)
        setEdittedCatDesc(category[0]?.ShortDesc)
    }, [selectedCatID, academicCategories])


    const onSubmit = async (data) => {
        try {

            const imageBodyFormData = new FormData()
            imageBodyFormData.append('file', data?.AcademicIcon[0])


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
            const bodyFormData = new FormData()
            bodyFormData.append('CategoryID', parseInt(data?.CategoryID))
            bodyFormData.append('ShortDesc', data?.ShortDesc)
            bodyFormData.append('AcademicIcon', imageRes?.data?.data?.mediaLink)

            setAddAcademicCategories(true)
            const res = await axiosJWT.post(
                `${baseURL}/api/v1/admin/home-page-academia-book-category/`,
                bodyFormData,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            )
            //console.log(res);
            if (res?.status === 200) {
                //console.log(res.data)
                setAcademicCategories([...academicCategories, res.data?.home_academia])
                setAddAcademicCategories(false)
                //swal('Success!', 'Popular Subjects added')
            } else {
                setAddAcademicCategories(false)
            }
        } catch (error) {
            //console.log(error)
        }
    }

    const onDelete = async (CategoryID) => {
        try {
            const token = cookies.get('token');
            // const bodyFormData = new FormData()
            // bodyFormData.append('CategoryID', parseInt(CategoryID));
            setAddAcademicCategories(true);
            const res = await axiosJWT.delete(
                `${baseURL}/api/v1/admin/home-page-academia-book-category/${CategoryID}`,
                // bodyFormData,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            )
            if (res?.status === 200) {
                setAcademicCategories(
                    academicCategories.filter(
                        (popularSubject) => popularSubject?.CategoryID !== res?.data?.home_academia?.CategoryID,
                    ),
                )
                setAddAcademicCategories(false)
                //swal('Success!', 'Popular Subjects deleted')
            } else {
                setAddAcademicCategories(false)

            }
        } catch (error) {
            //console.log(error)
        }
    }

    const onEdit = async (data) => {
        try {
            const bodyFormData = new FormData()
            bodyFormData.append('CategoryID', parseInt(selectedCatID))
            bodyFormData.append('ShortDesc', edittedCatDesc)

            setAddAcademicCategories(true)
            const res = await axiosJWT.patch(
                `${baseURL}/api/v1/admin/home-page-academia-book-category/`,
                bodyFormData,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            )
            //console.log(res);
            if (res?.status === 200) {
                //console.log(res.data)
                setVisible(false)
                setAddAcademicCategories(false)
                //swal('Success!', 'Popular Subjects added')
            } else {
                setVisible(false)
                setAddAcademicCategories(false)
            }
        } catch (error) {
            setVisible(false)
            console.log(error)
        }
    }

    useEffect(() => {
        const loadCategories = async () => {
            const res = await trackPromise(
                axiosJWT.get(`${baseURL}/api/v1/public/category/categories?ProductType=ACADEMIC_BOOK`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                }),
            )
            if (res?.data?.categories?.length > 0) {
                setAcademicCat(res?.data?.categories)
            }
        }

        const loadAcademicCategories = async () => {
            const res = await trackPromise(
                axiosJWT.get(`${baseURL}/api/v1/public/home-page-academic-book-category/`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                }),
            )
            if (res?.data?.categories_with_category?.length > 0) {
                setAcademicCategories(res?.data?.categories_with_category)
            }
        }
        loadCategories()
        loadAcademicCategories()
    }, [token])

    useEffect(() => {
        const filteredCategory = academicCat.filter((category) => category?.ParentCategoryID === selectedCategory)
        const categoryOptions = filteredCategory.map((category) => {
            return {
                value: category?.CategoryID,
                label: category?.CategoryName,
            }
        })
        setCategoryOptions(categoryOptions)
    }, [academicCat])

    useEffect(() => {
        const filteredCategory = academicCat.filter((category) => category?.ParentCategoryID === selectedCategory)
        const categoryOptions = filteredCategory.map((category) => {
            return {
                value: category?.CategoryID,
                label: category?.CategoryName,
            }
        })
        setCategoryOptions(categoryOptions)
    }, [selectedCategory])
    const defaultCat = categoryOptions.filter((option) => option?.value === selectedCatID)

    // console.log(defaultCat)

    return (
        <>
            <LoadingOverlay
                active={addAcademicCategories || deleteAcademicCategories}
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
                                <h6 className="card-title mb-4">
                                    Home Page Settings
                                </h6>
                                <h5 className="card-title fw-medium">Select Academic Book Category </h5>
                            </div>
                            <div className="card-body">
                                <CForm onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <Controller
                                                control={control}
                                                name="CategoryID"
                                                render={({ field: { onChange, value, ref, name } }) => (
                                                    <Select
                                                        className="my-3"
                                                        options={[{ label: "No Parent", value: "0" }, ...categoryOptions]}
                                                        placeholder="Select Category"
                                                        onChange={(option) => {
                                                            onChange(option.value)
                                                            setSelectedCategory(option.value)
                                                        }}
                                                        styles={selectCustomStyles}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <CFormInput
                                                type="text"
                                                id="ShortDesc"
                                                name={'ShortDesc'}
                                                placeholder="Short Description"
                                                floatingLabel={<div style={{ color: '#808080' }}>Short Description</div>}
                                                className="my-3"
                                                {...register('ShortDesc', { required: 'Short Description required' })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                id="AcademicIcon"
                                                className={'my-3 form-control-lg rounded-0'}
                                                name="AcademicIcon"
                                                {...register('AcademicIcon', { required: true })}
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary text-white my-3 px-4" type="submit">
                                        Add
                                    </button>
                                </CForm>

                                {promiseInProgress === false ? (
                                    <div className="mt-3">
                                        <CTable>
                                            <CTableHead>
                                                <CTableRow style={{ background: '#F3F5F9' }}>
                                                    <CTableHeaderCell className="py-3" scope="col">
                                                        Academic Book Category
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell className="py-3" scope="col">
                                                        Short Description
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell className="py-3 text-end" scope="col">
                                                        Action
                                                    </CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>

                                            <CTableBody>
                                                {academicCategories?.map((category) => (
                                                    <>
                                                        <CTableRow>
                                                            <CTableDataCell style={{ paddingTop: '15px' }}>
                                                                {category?.CategoryName}
                                                            </CTableDataCell>
                                                            <CTableDataCell style={{ paddingTop: '15px' }}>
                                                                {category?.ShortDesc}
                                                            </CTableDataCell>
                                                            <CTableDataCell className="text-end">
                                                                <CButton
                                                                    style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                                                    onClick={() => onDelete(category?.CategoryID)}
                                                                >
                                                                    <RiDeleteBinFill />
                                                                </CButton>
                                                                <CButton
                                                                    onClick={() => {
                                                                        setVisible(!visible)
                                                                        setSelectedCatID(category?.CategoryID)
                                                                    }}
                                                                    style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                                                >
                                                                    <FiEdit />
                                                                </CButton>
                                                                <CModal
                                                                    alignment="center"
                                                                    visible={visible}
                                                                    onClose={() => setVisible(false)}
                                                                >
                                                                    <CModalHeader>
                                                                        <CModalTitle>Edit Category</CModalTitle>
                                                                    </CModalHeader>
                                                                    <CModalBody>
                                                                        <CForm onSubmit={handleSubmit2(onEdit)}>
                                                                            <div className="flex">
                                                                                <div>
                                                                                    <Controller
                                                                                        control={control}
                                                                                        name="CategoryID"
                                                                                        render={({ field: { onChange, value, ref, name } }) => (
                                                                                            <Select
                                                                                                className="my-3"
                                                                                                options={categoryOptions}
                                                                                                defaultValue={defaultCat}
                                                                                                placeholder="Select Category"
                                                                                                onChange={(option) => {
                                                                                                    onChange(option.value)
                                                                                                }}
                                                                                                styles={selectCustomStyles}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                    { }
                                                                                    <CFormInput
                                                                                        type="text"
                                                                                        id="ShortDesc"
                                                                                        name={'ShortDesc'}
                                                                                        placeholder="Short Description"
                                                                                        defaultValue={edittedCatDesc}
                                                                                        floatingLabel={<div style={{ color: '#808080' }}>Short Description</div>}
                                                                                        className="my-3"
                                                                                        onChange={(e) => setEdittedCatDesc(e.target.value)}
                                                                                    />
                                                                                    {/* <input
                                                        type="file"
                                                        className="form-control form-control-lg rounded-0 mt-2"
                                                                                        {...register2('AcademicIcon', {required: true})}
                                                    /> */}
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control mb-2 d-none"
                                                                                        defaultValue={`${selectedCatID}`}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <button
                                                                                className="btn btn-primary text-white my-3"
                                                                                type="submit"
                                                                            >
                                                                                Update Category
                                                                            </button>
                                                                        </CForm>
                                                                    </CModalBody>
                                                                </CModal>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    </>
                                                ))}
                                            </CTableBody>
                                        </CTable>
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
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    )
}

export default AcademicBookCat
