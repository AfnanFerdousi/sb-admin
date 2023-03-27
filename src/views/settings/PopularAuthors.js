/* eslint-disable */
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CForm,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { RiDeleteBinFill } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Select from 'react-select'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import { primary_orange } from 'src/colors'
import { selectCustomStyles } from 'src/selectCustomStyles'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const PopularAuthors = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm()

  // Form values
  const authorID = watch('AuthorID');

  const [authors, setAuthors] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [addPopularAuthorsState, setAddPopularAuthorsState] = useState(false);
  const [deletePopularAuthorsState, setDeletePopularAuthorsState] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get('token');

  const onSubmit = async (data) => {
    try {
      const token = cookies.get('token');
      const bodyFormData = new FormData()

      bodyFormData.append('AuthorID', parseInt(data?.AuthorID))
      bodyFormData.append('Popular', true)

      setAddPopularAuthorsState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/author/toggle-popular`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setPopularAuthors([...popularAuthors, res.data?.author])
        setAddPopularAuthorsState(false)
        //swal('Success!', 'Popular Author added')
      } else {
        setAddPopularAuthorsState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  const onDelete = async (AuthorID) => {
    try {
      const bodyFormData = new FormData()

      bodyFormData.append('AuthorID', parseInt(AuthorID))
      bodyFormData.append('Popular', false)

      setAddPopularAuthorsState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/author/toggle-popular`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setPopularAuthors(
          popularAuthors.filter(
            (popularAuthor) => popularAuthor.AuthorID !== res?.data?.author?.AuthorID,
          ),
        )
        setAddPopularAuthorsState(false)
        //swal('Success!', 'Popular Author Deleted')
      } else {
        setAddPopularAuthorsState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  useEffect(() => {
    const loadAuthors = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/author/all_authors?limit=100000000`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.authors?.length > 0) {
        setAuthors(res?.data?.authors)
      }
    }

    const loadPopularAuthors = async () => {
      // NEED TO CHANGE API
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/author/popular_authors`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.authors?.length > 0) {
        setPopularAuthors(res?.data?.authors)
      }
    }
    loadAuthors()
    loadPopularAuthors()
  }, [token])

  const authorOptions = authors?.map((author) => {
    return { value: author?.AuthorID, label: author?.AuthorName }
  })

  return (
    <>
      <LoadingOverlay
        active={addPopularAuthorsState || deletePopularAuthorsState}
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
                <h5 className="card-title fw-medium">Select জনপ্রিয় লেখকজন</h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="AuthorID"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            className="my-3"
                            options={authorOptions}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Select Author</div>}
                            placeholder="Select Author"
                            onChange={(option) => {
                              onChange(option.value)
                            }}
                            styles={selectCustomStyles}
                          />
                        )}
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
                            Author Name
                          </CTableHeaderCell>
                          <CTableHeaderCell className="py-3 text-end" scope="col">
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {popularAuthors.map((author) => (
                          <>
                            <CTableRow>
                              <CTableDataCell style={{ paddingTop: '15px' }}>
                                {author?.AuthorName}
                              </CTableDataCell>
                              <CTableDataCell className="text-end">
                                <CButton
                                  style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                  onClick={() => onDelete(author?.AuthorID)}
                                >
                                  <RiDeleteBinFill />
                                </CButton>
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

export default PopularAuthors
