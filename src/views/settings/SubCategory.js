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
import axios from 'axios'
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

const SubCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm()

  // Form values
  const subCategoryID = watch('SubCategoryID')
  const [subCategories, setSubCategories] = useState([])
  const [popularSubCategories, setPopularSubCategories] = useState([])
  const { promiseInProgress } = usePromiseTracker()
  const [addPopularSubCategoryState, setAddPopularSubCategoryState] = useState(false);
  const [refetchSubCategory, setRefetchSubCategory] = useState(false);
  const [deletePopularSubCategoryState, setDeletePopularSubCategoryState] = useState(false)
  const cookies = new Cookies()
  const token = cookies.get('token')

  const [selectedCategory, setSelectedCategory] = useState('0')
  const [categoryOptions, setCategoryOptions] = useState([])

  const onSubmit = async (data) => {
    try {
      const token = cookies.get('token');
      const formData = JSON.stringify({
        CategoryID: data?.SubCategoryID,
        popular: true
      });
      setAddPopularSubCategoryState(true)
      const res = await axiosJWT.patch(
        `${baseURL}/api/v1/admin/category/toggle-popular`,
        formData,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        setAddPopularSubCategoryState(false);
        setRefetchSubCategory(!refetchSubCategory);
        //swal('Success!', 'Popular Subjects added')
      } else {
        setAddPopularSubCategoryState(false);
      }
    } catch (error) {
      setAddPopularSubCategoryState(false);
      //console.log(error);
    }
  }

  const onDelete = async (SubCategoryID) => {
    try {
      const token = cookies.get('token');

      const formData = JSON.stringify({
        CategoryID: SubCategoryID,
        popular: false
      });
      //console.log(formData);
      setAddPopularSubCategoryState(true)
      const res = await axiosJWT.patch(
        `${baseURL}/api/v1/admin/category/toggle-popular`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        },
      )
      if (res?.status === 200) {
        setRefetchSubCategory(!refetchSubCategory);
        setAddPopularSubCategoryState(false);
        //swal('Success!', 'Popular sub category deleted');
      } else {
        setAddPopularSubCategoryState(false);
      }
    } catch (error) {
      setAddPopularSubCategoryState(false);
      //console.log(error);
    }
  }

  useEffect(() => {
    const loadSubCategory = async () => {
      const res = await trackPromise(axios.get(`${baseURL}/api/v1/public/category/categories`))
      setSubCategories(res?.data?.categories)
    };
    const loadPopularSubCategory = async () => {
      const res = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/public/category/categories?Popular=true`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      if (res?.data?.status === 200) {
        //console.log('axios', res?.data)
        setPopularSubCategories(res?.data?.categories)
      }
    }
    loadSubCategory()
    loadPopularSubCategory()
  }, [token, refetchSubCategory])

  useEffect(() => {
    const filteredCategory = subCategories.filter((category) => category?.ParentCategoryID === selectedCategory)
    const categoryOptions = filteredCategory.map((category) => {
      return {
        value: category?.CategoryID,
        label: category?.CategoryName,
      }
    })
    setCategoryOptions(categoryOptions)
  }, [subCategories])

  useEffect(() => {
    const filteredCategory = subCategories.filter((category) => category?.ParentCategoryID === selectedCategory)
    const categoryOptions = filteredCategory.map((category) => {
      return {
        value: category?.CategoryID,
        label: category?.CategoryName,
      }
    })
    setCategoryOptions(categoryOptions)
  }, [selectedCategory])

 

  return (
    <>
      <LoadingOverlay
        active={addPopularSubCategoryState || deletePopularSubCategoryState}
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
                <h5 className="card-title fw-medium">Make popular category</h5>
              </div>
              <div className="card-body">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        control={control}
                        name="SubCategoryID"
                        render={({ field: { onChange, value, ref, name } }) => (
                          <Select
                            className="my-3"
                            options={[{ label: "No Parent", value: "0" }, ...categoryOptions]}
                            // placeholder={<div style={{ marginTop: '-8px' }}>Select Sub Category</div>}
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
                            Category Name
                          </CTableHeaderCell>
                          <CTableHeaderCell className="py-3 text-end" scope="col">
                            Action
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>

                      <CTableBody>
                        {popularSubCategories?.map((subCategory) => (
                          <>
                            <CTableRow>
                              <CTableDataCell style={{ paddingTop: '15px' }}>
                                {subCategory?.CategoryName}
                              </CTableDataCell>
                              <CTableDataCell className="text-end">
                                <CButton
                                  style={{ background: 'none', border: 'none', color: '#8E98AA' }}
                                  onClick={() => onDelete(subCategory?.CategoryID)}
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

export default SubCategory
