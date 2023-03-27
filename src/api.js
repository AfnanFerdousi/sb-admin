import { baseURL } from './baseUrl'

export const GET_ALL_BANNERS = `${baseURL}/api/v1/public/banner/home_page_banners`
export const POST_NEW_BANNER = `${baseURL}/api/v1/admin/banner/new`
export const DELETE_BANNER = `${baseURL}/api/v1/admin/banner/delete/[[id]]`
export const ADD_NEW_PRODUCT = `${baseURL}/api/v1/admin/product/create_new`
export const EDIT_PRODUCT = `${baseURL}/api/v1/admin/product/edit`
export const GET_SUBJECTS_BY_PRODUCT_TYPE = `${baseURL}/api/v1/public/subject/all_subjects?limit=10000&ProductType=[[productType]]`
export const GET_CATEGORIES_BY_SUBJECT = `${baseURL}/api/v1/public/category/categories?limit=10000&page=1&ProductType=[[productType]]`
export const GET_CATEGORIES = `${baseURL}/api/v1/public/category/categories?limit=10000`
export const GET_SUBCATEGORIES_BY_CATEGORY = `${baseURL}/api/v1/public/subcategory/get_subcategory/[[categoryID]]`
export const GET_AUTHORS = `${baseURL}/api/v1/public/author/all_authors?limit=10000`
export const GET_PUBLICATIONS = `${baseURL}/api/v1/public/publication/all`
export const GET_BRANDS = `${baseURL}/api/v1/public/brand/`
export const FILE_UPLOAD = `${baseURL}/api/v1/admin/upload/single`
