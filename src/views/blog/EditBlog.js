/* eslint-disable */
import {
    CAlert,
    CBadge,
    CButton,
    CForm,
    CFormInput,
    CFormSwitch,
    CFormTextarea,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useParams, useLocation } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import TableContainer from 'src/components/reusable/TableContainer';
import Select from 'react-select'
import { selectCustomStyles } from 'src/selectCustomStyles'

const EditBlog = () => {
    const { state } = useLocation()
    // console.log(state)
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm({ defaultValues: state })

    const categoryID = watch('CategoryID')

    const { id } = useParams()
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()
    const [editorState, setEditorState] = useState(state?.content
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(state?.content)),
        )
        : EditorState.createEmpty(),)
    const onEditorState = (editorState) => setEditorState(editorState)
    const [blog, setBlog] = useState({})
    const [categories, setCategories] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [defaultCat, setDefaultCat] = useState([])
    const [addBlogState, setAddBlogState] = useState(false)
    // const [selectedCategory, setSelectedCategory] = useState('0')
    const [blogImage, setBlogImage] = useState()

    // Load blog categories
    const loadCategories = async () => {
        const res = await axiosJWT.get(`${baseURL}/api/v1/admin/blog-category/`)
        if (res?.status == 200) {
            setCategories(res.data?.data)
            // console.log(res?.data?.data)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        const categoryOptions = categories.map((category) => {
            return {
                value: category?.CategoryID,
                label: category?.CategoryName,
            }
        })
        setCategoryOptions(categoryOptions)
    }, [categories])
    // console.log(categoryOptions)

    const onSubmit = async (data) => {
        console.log(data)
        try {
            if (typeof data?.thumbnail === 'object' && data?.thumbnail?.length !== 0) {
                const formData = new FormData()
                formData.append('file', data?.thumbnail[0])
                const config = {
                    headers: {
                        Authorization: `${token}`,
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'multipart/form-data',
                    },
                }
                const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)
                if (!res?.data?.status === 200 && data?.thumbnail[0]) {
                    return
                }
                setBlogImage(res?.data?.data?.mediaLink)
            } else {
                setBlogImage(data?.thumbnail)
            }

            const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            const categories = categoryID ? categoryID?.map((item) => item.value) : [];
            console.log(data)
            const tags = typeof data?.tags === 'object' ? data?.tags : typeof data?.tags?.split(/\n/) === "object" ? data?.tags?.split(/\n/) : [data?.tags]

            const editedData = {
                ...state,
                ...data,
                content,
                categories,
                blogImage,
                tags,
            }
            console.log(editedData)
                const res = await axiosJWT.patch(`${baseURL}/api/v1/admin/blog/blog/${state?.blogID}`, editedData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                })
                console.log(res)
                if (res?.data?.status === 200) {
                    swal('Success', 'Edit Successful', 'success')
                    setAddBlogState(false)
                    console.log(res)
                }
        } catch (error) {
           console.log(error)
            setAddBlogState(false)
        }
    }
    useEffect(() => {
        const defaultCat = state?.categories.map((category) => {
            return {
                value: category?.CategoryID,
                label: category?.CategoryName,
            }
        })
        setDefaultCat(defaultCat)
    }, [state?.categories])
console.log(state)
    const errorMessages = Object.keys(errors)
    return (
        <>
            <LoadingOverlay
                active={addBlogState}
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
                        <TableContainer title="Edit Blog">
                            <div className="card-body">
                                {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                                <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <CFormInput
                                                type="text"
                                                id="title"
                                                // defaultValue={blog?.title}
                                                placeholder="Blog title"
                                                floatingLabel={<div style={{ color: '#808080' }}>Blog title</div>}
                                                {...register('title')}
                                                className="mb-3"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <CFormInput
                                                type="text"
                                                id="Tags"
                                                // defaultValue={blog?.tags}
                                                placeholder="Tags - Use comma seperator"
                                                floatingLabel={<div style={{ color: '#808080' }}>Tags - Use comma seperator</div>}
                                                {...register('tags')}
                                                className=""
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            {defaultCat?.length > 0 &&
                                                <Controller
                                                    control={control}
                                                    name="CategoryID"
                                                    render={({ field: { onChange, value, ref, name } }) => (
                                                        <Select
                                                            defaultValue={defaultCat}
                                                            options={categoryOptions}
                                                            placeholder=" Categories"
                                                            onChange={(option) => {
                                                                onChange(option)
                                                                // setSelectedCategory(option)
                                                            }}
                                                            styles={selectCustomStyles}
                                                            isMulti
                                                        />
                                                    )}
                                                />
                                            }
                                        </div>
                                        <div className="col-md-6">
                                            <CFormInput
                                                type="file"
                                                accept="image/*"
                                                id="thumbnail"
                                                {...register('thumbnail')}
                                                className="mb-3 form-control-lg rounded-0"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <Editor
                                                editorState={editorState}
                                                rows={5}
                                                editorClassName="editor_container"
                                                placeholder="Description"
                                                onEditorStateChange={onEditorState}
                                                handlePastedText={() => false}
                                            />
                                        </div>
                                    </div>
                                    <CButton className="text-white mt-3" type="submit">
                                        Update
                                    </CButton>
                                </CForm>
                            </div>
                        </TableContainer>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    );
};

export default EditBlog;