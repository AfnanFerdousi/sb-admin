import React from 'react'
import RequireAuth from './RequireAuth'
import Invoice from './views/orders/Invoice'
import UserDetails from './views/users/UserDetails'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CommonAddProduct = React.lazy(() => import('./views/product/CommonAddProduct'))
const AddBanner = React.lazy(() => import('./views/AddBanner'))
const AddCategory = React.lazy(() => import('./views/AddCategory'))
const ViewProduct = React.lazy(() => import('./views/product/ViewProduct'))
const EditProduct = React.lazy(() => import('./views/product/EditProduct2'))
const AddOffers = React.lazy(() => import('./views/offers/AddOffers'))
const EditOffer = React.lazy(() => import('./views/offers/EditOffer'))
const AddContest = React.lazy(() => import('./views/contests/AddContest'))
const EditContest = React.lazy(() => import('./views/contests/EditContest'))
const AddHigherEducation = React.lazy(() => import('./views/higher_education/AddHigherEducation'))
const EditHigherEducation = React.lazy(() => import('./views/higher_education/EditHigherEducation'))
const Settings = React.lazy(() => import('./views/settings/Settings'))
const AllOrders = React.lazy(() => import('./views/orders/AllOrders'))
const OrderStats = React.lazy(() => import('./views/orders/OrderStats'))
const ViewOrder = React.lazy(() => import('./views/orders/ViewOrder'))
const AddAttribute = React.lazy(() => import('./views/attributes/AddAttribute'))
const Roles = React.lazy(() => import('./views/roles/Roles'))
const RoleEdit = React.lazy(() => import('./views/roles/RoleEdit'))
const CustomOrders = React.lazy(() => import('./views/custom_orders/CustomOrders'))
const AddCoupon = React.lazy(() => import('./views/coupon/AddCoupon'))
const CouponList = React.lazy(() => import('./views/coupon/CouponList'))
const EditCoupon = React.lazy(() => import('./views/coupon/EditCoupon'))
const AllUsers = React.lazy(() => import('./views/users/AllUsers'))
const Blog = React.lazy(() => import('./views/blog/Blog'))
const AllBlog = React.lazy(() => import('./views/blog/AllBlog'))
const EditBlog = React.lazy(() => import('./views/blog/EditBlog'))
const BlogCat = React.lazy(() => import('./views/blog/BlogCat'))
const PopUp = React.lazy(() => import('./views/popUpAd/PopUp'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN', 'MANAGE_ORDERS']}>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: '/all-users',
    name: 'Dashboard',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <AllUsers />
      </RequireAuth>
    ),
  },
  {
    path: '/add-blog',
    name: 'Blog',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <Blog />
      </RequireAuth>
    ),
  },
  {
    path: '/all-blogs',
    name: 'All Blogs',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <AllBlog />
      </RequireAuth>
    ),
  },
  {
    path: '/blog-category',
    name: 'Blog Category',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <BlogCat />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-blog/:id',
    name: 'All Blogs',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <EditBlog />
      </RequireAuth>
    ),
  },
  {
    path: '/all-users/:id',
    name: 'UserDetails',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <UserDetails />
      </RequireAuth>
    ),
  },
  {
    path: '/invoice/:id',
    name: 'Invoice',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <Invoice />
      </RequireAuth>
    ),
  },
  {
    path: '/product/view-product',
    name: 'View Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <ViewProduct />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-product/:id',
    name: 'Edit Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <EditProduct />
      </RequireAuth>
    ),
  },
  {
    path: '/add-banner',
    name: 'Add Banner',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <AddBanner />
      </RequireAuth>
    ),
  },
  {
    path: '/roles',
    name: 'Roles',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <Roles />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-role/:id',
    name: 'RoleEdit',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <RoleEdit />
      </RequireAuth>
    ),
  },
  {
    path: '/custom-order',
    name: 'CustomOrders',
    element: () => (
      <RequireAuth permissions={['CREATE_CUSTOM_ORDER']}>
        <CustomOrders />
      </RequireAuth>
    ),
  },
  { path: '/add-coupon', name: 'AddCoupon', element: AddCoupon },
  {
    path: '/edit-coupon/:id',
    name: 'EditCoupon',
    element: () => (
      <RequireAuth permissions={['MANAGE_COUPON']}>
        <EditCoupon />
      </RequireAuth>
    ),
  },
  {
    path: '/coupon-list',
    name: 'Coupon List',
    element: () => (
      <RequireAuth permissions={['MANAGE_COUPON']}>
        <CouponList />
      </RequireAuth>
    ),
  },

  {
    path: '/popup-ad',
    name: 'Pop Up Ads',
    element: () => (
      <RequireAuth permissions={['SUPER_ADMIN']}>
        <PopUp />
      </RequireAuth>
    ),
  },
  // { path: '/add-subject', name: 'Add Subject', element: AddSubject },
  {
    path: '/add-offer',
    name: 'Add Offer',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <AddOffers />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-offer/:id',
    name: 'Edit Offer',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <EditOffer />
      </RequireAuth>
    ),
  },
  {
    path: '/add-contest',
    name: 'Add Contest',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <AddContest />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-contest/:id',
    name: 'Edit Contest',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <EditContest />
      </RequireAuth>
    ),
  },
  {
    path: '/add-higher-education',
    name: 'Add Higher Education',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <AddHigherEducation />
      </RequireAuth>
    ),
  },
  {
    path: '/edit-higher-education/:id',
    name: 'Edit Higher Education',
    element: () => (
      <RequireAuth permissions={['MANAGE_SPECIAL_EXTRA']}>
        <EditHigherEducation />
      </RequireAuth>
    ),
  },
  {
    path: '/settings',
    name: 'Settings',
    element: () => (
      <RequireAuth permissions={['MANAGE_SITE_SETTINGS']}>
        <Settings />
      </RequireAuth>
    ),
  },
  // { path: '/add-sub-category', name: 'Add Sub Category', element: AddSubCategory },
  {
    path: '/all-orders',
    name: 'All Orders',
    element: () => (
      <RequireAuth permissions={['MANAGE_ORDERS']}>
        <AllOrders />
      </RequireAuth>
    ),
  },
  {
    path: '/orders-stats',
    name: 'Order Stats',
    element: () => (
      <RequireAuth permissions={['MANAGE_ORDERS']}>
        <OrderStats />
      </RequireAuth>
    ),
  },
  {
    path: '/view-order/:id',
    name: 'View Order',
    element: () => (
      <RequireAuth permissions={['MANAGE_ORDERS']}>
        <ViewOrder />
      </RequireAuth>
    ),
  },
  {
    path: '/attributes',
    name: 'Attributes',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <AddAttribute />
      </RequireAuth>
    ),
  },
  // Add Product Routes
  {
    path: '/academic-book/product/add-product',
    name: 'Academic Book Add Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <CommonAddProduct productType="ACADEMIC_BOOK" />
      </RequireAuth>
    ),
  },
  {
    path: '/subject-book/product/add-product',
    name: 'Subject Book Add Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <CommonAddProduct productType="SUBJECT_BOOK" />
      </RequireAuth>
    ),
  },
  {
    path: '/stationary/product/add-product',
    name: 'Stationary Add Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <CommonAddProduct productType="STATIONARY" />
      </RequireAuth>
    ),
  },
  {
    path: '/fashion/product/add-product',
    name: 'Fashion Add Product',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <CommonAddProduct productType="FASHION" />
      </RequireAuth>
    ),
  },
  // Add Category Routes
  {
    path: '/academic-book/category/add-category',
    name: 'Academic Book Add Category',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <AddCategory productType="ACADEMIC_BOOK" />
      </RequireAuth>
    ),
  },
  {
    path: '/subject-book/category/add-category',
    name: 'Subject Book Add Category',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        {' '}
        <AddCategory productType="SUBJECT_BOOK" />
      </RequireAuth>
    ),
  },
  {
    path: '/stationary/category/add-category',
    name: 'Stationary Add Category',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <AddCategory productType="STATIONARY" />
      </RequireAuth>
    ),
  },
  {
    path: '/fashion/category/add-category',
    name: 'Fashion Add Category',
    element: () => (
      <RequireAuth permissions={['MANAGE_PRODUCT']}>
        <AddCategory productType="FASHION" />
      </RequireAuth>
    ),
  },
]

export default routes
