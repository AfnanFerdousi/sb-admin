/* eslint-disable */
import {
    CBadge,
    CButton,
    CFormInput,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBin5Fill, RiDeleteBin5Line } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Link, useNavigate } from 'react-router-dom'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import Badge from 'src/components/Badge'
import Cookies from 'universal-cookie'
import Paginate from '../product/Paginate';
import swal from 'sweetalert'

const AllBlog = () => {

    const [blogs, setBlogs] = useState([])
    const cookies = new Cookies()
    const token = cookies.get('token')
    const { promiseInProgress } = usePromiseTracker()
    const [blogTitle, setBlogTitle] = useState('')
    const [deleteBlogState, setDeleteBlogState] = useState(false)

    const [productsPerPage] = useState(10)
    const [currentProduct, setCurrentPage] = useState(1)
    const indexOfLastProduct = currentProduct * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    // uncomment it after getting api
    const currentBlogs = blogs.slice(indexOfFirstProduct, indexOfLastProduct)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const navigate = useNavigate()
    const loadBlogs = async () => {
        const res = await trackPromise(
            axiosJWT.get(
                `${baseURL}/api/v1/public/blog/blogs?query=${blogTitle ? `${blogTitle}` : ''}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            ),
        )
        if (res?.data?.status === 200) {
            setBlogs(res?.data?.data)
            console.log(res?.data?.data)
        }
    }
    useEffect(() => {
        
        loadBlogs()
    }, [token, blogTitle])

    const onDelete = async (id) => {
      console.log("CLICKED")
        try {
            swal({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    setDeleteBlogState(true)
                    const res = await axiosJWT.delete(
                        `${baseURL}/api/v1/admin/blog/blog/${id}`,
                        {
                            BlogID: id,
                        },
                        {
                            headers: {
                                Authorization: `${token}`,
                            },
                        },
                    )
                    if (res?.status === 200) {
                        setDeleteBlogState(false)
                        setBlogs(blogs.filter((blog) => blog.BlogID !== id))
                        loadBlogs()
                    }
                }
            })
        } catch (error) {
            console.log(error)
            setDeleteBlogState(false)
        }
    }

    const blogEditHandler = (blog) => {
        navigate(`/edit-blog/${blog?.blogID}`, { state: blog })
    }
    return (
        <>
            <LoadingOverlay
                active={deleteBlogState}
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
                <div>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="card-title">All Blogs</h6>
                            <div className="my-3 d-flex">
                                <CFormInput
                                    placeholder="Search by title"
                                    className="w-25"
                                    onChange={(e) => setBlogTitle(e.target.value)}
                                />
                            </div>
                            {promiseInProgress === false ? (
                                <CTable >
                                    <CTableHead>
                                        <CTableRow style={{ background: '#F3F5F9' }}>
                                            <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                                Title
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="py-3" scope="col" style={{ fontSize: '14px' }}>
                                                Published Date
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="py-3 text-center" scope="col" style={{ fontSize: '14px' }}>
                                                Action
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    {/* Uncomment is after getting api */}
                                    <CTableBody>
                                        {currentBlogs?.reverse().map((blog, index) => {
                                            return (
                                                <>
                                                    <CTableRow key={index}>
                                                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>{blog?.title.length > 35 ? blog?.title.slice(0, 35) : blog?.title}</CTableDataCell>
                                                        <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}> {moment(blog?.date).calendar()}</CTableDataCell>
                                                        <CTableDataCell className="d-flex align-items-center justify-content-center w-full">
                                                            <div
                                                                onClick={() => blogEditHandler(blog)}
                                                            >
                                                                <FiEdit className="cursor-pointer mx-3" />
                                                            </div>
                                                            <CButton
                                                                onClick={() => onDelete(blog?.blogID)}
                                                                className="bg-transparent border-0 cursor-pointer delete_btn_hover"
                                                                style={{ color: '#8E98AA' }}
                                                            >
                                                                <RiDeleteBin5Fill />
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                </>
                                            )
                                        })}
                                    </CTableBody>
                                </CTable>
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
                            {/* Uncomment it after getting api */}
                            <Paginate
                        productsPerPage={productsPerPage}
                        totalProducts={blogs.length}
                        paginate={paginate}
                    />
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </>
    );
};

export default AllBlog;