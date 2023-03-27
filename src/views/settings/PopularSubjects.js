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

const PopularBooks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm()

  // Form values
  const subjectID = watch('SubjectID')

  const [subjects, setSubjects] = useState([])
  const [popularSubjects, setPopularSubjects] = useState([])
  const { promiseInProgress } = usePromiseTracker()
  const [addPopularSubjectsState, setAddPopularSubjectsState] = useState(false)
  const [deletePopularSubjectsState, setDeletePopularCategoryState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')

  const onSubmit = async (data) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('SubjectID', parseInt(data?.SubjectID))
      bodyFormData.append('isPopular', true)

      setAddPopularSubjectsState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/subject/toggle-popular`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setPopularSubjects([...popularSubjects, res.data?.subject])
        setAddPopularSubjectsState(false)
        //swal('Success!', 'Popular Subjects added')
      } else {
        setAddPopularSubjectsState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  const onDelete = async (SubjectID) => {
    try {
      const bodyFormData = new FormData()
      bodyFormData.append('SubjectID', parseInt(SubjectID))
      bodyFormData.append('isPopular', false)

      setAddPopularSubjectsState(true)
      const res = await axiosJWT.post(
        `${baseURL}/api/v1/admin/subject/toggle-popular`,
        bodyFormData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      )
      if (res?.data?.status === 200) {
        setPopularSubjects(
          popularSubjects.filter(
            (popularsubject) => popularsubject?.SubjectID !== res?.data?.subject?.SubjectID,
          ),
        )
        setAddPopularSubjectsState(false)
        //swal('Success!', 'Popular Subjects deleted')
      } else {
        setAddPopularSubjectsState(false)

      }
    } catch (error) {
      //console.log(error)
    }
  }

  useEffect(() => {
    const loadSubjects = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/subject/all_subjects`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.subjects?.length > 0) {
        setSubjects(res?.data?.subjects)
      }
    }

    const loadPopularSubjects = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/subject/popular`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.subjects?.length > 0) {
        setPopularSubjects(res?.data?.subjects)
      }
    }
    loadSubjects()
    loadPopularSubjects()
  }, [token])

  const subjectsOptions = subjects?.map((subject) => {
    return { value: subject?.SubjectID, label: subject?.SubjectName }
  })

  return (
    <>
      <LoadingOverlay
        active={addPopularSubjectsState || deletePopularSubjectsState}
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
                <h5 className="card-title fw-bolder">Select জনপ্রিয় বিষয়সমূহ </h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="SubjectID"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            className="my-3"
                            options={subjectsOptions}
                            placeholder="Select Subject"
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
                            Subject Name
                          </CTableHeaderCell>
                          <CTableHeaderCell className="py-4 text-end" scope="col">
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {popularSubjects?.map((subject) => (
                          <>
                            <CTableRow>
                              <CTableDataCell style={{ paddingTop: '15px' }}>
                                {subject?.SubjectName}
                              </CTableDataCell>
                              <CTableDataCell className="text-end">
                                <CButton
                                  className="text-white bg-primary"
                                  onClick={() => onDelete(subject?.SubjectID)}
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

export default PopularBooks
