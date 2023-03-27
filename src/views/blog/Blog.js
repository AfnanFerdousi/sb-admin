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
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Controller, useForm } from 'react-hook-form'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import TableContainer from 'src/components/reusable/TableContainer';
import Select from 'react-select'
import { selectCustomStyles } from 'src/selectCustomStyles'



const Blog = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm()

    const categoryID = watch('CategoryID')

    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const onEditorState = (editorState) => setEditorState(editorState)

    const [categories, setCategories] = useState([])
    const [categoryOptions, setCategoryOptions] = useState([])
    const [addBlogState, setAddBlogState] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('0')
    const [blogImage, setBlogImage] = useState()


    const loadCategories = async () => {
        const res = await axiosJWT.get(`${baseURL}/api/v1/admin/blog-category/`)
        if (res?.status == 200) {
            setCategories(res.data?.data)
            // console.log(res?.data?.data)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [selectedCategory])

    useEffect(() => {
        const categoryOptions = categories.map((category) => {
            return {
                value: category?.CategoryID,
                label: category?.CategoryName,
            }
        })
        setCategoryOptions(categoryOptions)
    }, [categories])

    const onSubmit = async (data) => {
        // console.log(data)
        try {
            if (data?.thumbnail?.length !== 0) {
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
                console.log(res)
                if (res?.status == 200) {
                    data.thumbnail = res?.data?.data
                    setBlogImage(data?.thumbnail?.mediaLink)
                    console.log(data?.thumbnail)
                }
            } else {
                setBlogImage(data?.thumbnail)
            }

            // DATA
            try {
                console.log(blogImage)
                const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                const urlSlug = data?.title.replaceAll(' ', '-').toLowerCase()
                const categoryIDs = categoryID ? categoryID?.map((item) => item.value) : []
                setAddBlogState(true)
                const tag = typeof data?.tags.split(/\n/) === "object" ? data?.tags.split(/\n/) : [data?.tags]
                const bodyFormData = new FormData()
                bodyFormData.append('title', data?.title)
                bodyFormData.append('content', content)
                bodyFormData.append('tags', JSON.stringify(tag))
                bodyFormData.append('thumbnail', data?.thumbnail?.mediaLink)
                bodyFormData.append('urlSlug', urlSlug)
                bodyFormData.append('categories', JSON.stringify(categoryIDs))
                const res = await axiosJWT.post(`${baseURL}/api/v1/admin/blog/blog`, bodyFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                })
                if (res?.status == 200) {
                    setAddBlogState(false)
                }
            }
            catch (error) {
                console.log(error)
                setAddBlogState(false)
            }
        } catch (error) {
            console.log('Image upload error: ', error)
            console.log(error)
        }
    }
    const errorMessages = Object.keys(errors)
    return (
        <div className="flex flex-column">
            <div>
                <TableContainer title="Create blog">
                    <div className="card-body">
                        {errorMessages.length > 0 && <CAlert>Please fill all the required fields</CAlert>}
                        <CForm onSubmit={handleSubmit(onSubmit)} className="mb-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <CFormInput
                                        type="text"
                                        id="title"
                                        placeholder="Blog title"
                                        floatingLabel={<div style={{ color: '#808080' }}>Blog title</div>}
                                        {...register('title', { required: true })}
                                        className="mb-3"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <CFormInput
                                        type="text"
                                        id="Tags"
                                        placeholder="Tags - Use comma seperator"
                                        floatingLabel={<div style={{ color: '#808080' }}>Tags - Use comma seperator</div>}
                                        {...register('tags', { required: true })}
                                        className=""
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Controller
                                        control={control}
                                        name="CategoryID"
                                        render={({ field: { onChange, value, ref, name } }) => (
                                            <Select
                                                options={categoryOptions}
                                                placeholder="Categories"
                                                onChange={(option) => {
                                                    onChange(option)
                                                    setSelectedCategory(option)
                                                }}
                                                styles={selectCustomStyles}
                                                isMulti
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <CFormInput
                                        type="file"
                                        accept="image/*"
                                        id="thumbnail"
                                        {...register('thumbnail', { required: true })}
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
                                Create
                            </CButton>
                        </CForm>
                    </div>
                </TableContainer>
            </div>
        </div>
    );
};

export default Blog;