import axios from 'axios'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const token = cookies.get('token')

export const getCategoriesByType = async (productType) => {
  const res = await axios.get(
    `${baseURL}/api/v1/public/category/categories?ProductType=${productType}`,
  )
  return res?.data?.categories
}

export const addCategory = async (bodyFormData) => {
  return await axiosJWT.post(`${baseURL}/api/v1/admin/category/create_new`, bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${token}`,
    },
  })
}

export const deleteCategory = async (CategoryID) => {
  return await axiosJWT.post(
    `${baseURL}/api/v1/admin/category/delete/`,
    {
      CategoryID,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    },
  )
}

export const editCategory = async (bodyFormData) => {
  return await axiosJWT.post(`${baseURL}/api/v1/admin/category/edit`, bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${token}`,
    },
  })
}
