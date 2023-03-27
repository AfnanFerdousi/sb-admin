/* eslint-disable */
import { CNavGroup, CNavItem } from '@coreui/react'
import allproducts from './assets/images/allproducts.png'
import attributes from './assets/images/attributes.png'
import circle from './assets/images/circle.png'
import dashboard from './assets/images/dashboard.png'
import marketing from './assets/images/Marketing.png'
import menu from './assets/images/menu.png'
import customOrder from './assets/images/Mobile Order.png'
import role from './assets/images/role.png'
import settings from './assets/images/settings.png'
import order from './assets/images/shopping-cart.png'
import specialextra from './assets/images/specialextra.png'
import users from './assets/images/Users.png'
import blog from './assets/images/blog.png'

export const allRoles = [
  'MANAGE_PRODUCT',
  'MANAGE_ORDERS',
  'MANAGE_SITE_SETTINGS',
  'CREATE_CUSTOM_ORDER',
  'MANAGE_BLOG',
  'MANAGE_COUPON',
  'SUPER_ADMIN',
  'MANAGE_SPECIAL_EXTRA',
]

const user = JSON.parse(localStorage.getItem('user'))

const adminPerm = ['SUPER_ADMIN']?.some((item) => user.Permissions.includes(item))
const manageProductPerm = ['MANAGE_PRODUCT']?.some((item) => user.Permissions.includes(item))
const manageOrdersPerm = ['MANAGE_ORDERS']?.some((item) => user.Permissions.includes(item))
const manageSiteSettingsPerm = ['MANAGE_SITE_SETTINGS']?.some((item) =>
  user.Permissions.includes(item),
)
const customOrderPerm = ['CREATE_CUSTOM_ORDER']?.some((item) => user.Permissions.includes(item))
const couponPerm = ['MANAGE_COUPON']?.some((item) => user.Permissions.includes(item))
const manageSpecialExtraPerm = ['MANAGE_SPECIAL_EXTRA']?.some((item) =>
  user.Permissions.includes(item),
)

const _nav = [
  ...(adminPerm
    ? [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: (
          <img
            src={dashboard}
            alt={'dashboard'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
      },
    ]
    : []),
  ...(adminPerm || manageProductPerm
    ? [
      {
        component: CNavGroup,
        name: 'Menu',
        icon: (
          <img
            src={menu}
            alt={'menu'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
        items: [
          {
            component: CNavGroup,
            name: 'Academic Book',
            icon: (
              <img
                src={circle}
                alt={'Book'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
            items: [
              {
                component: CNavItem,
                name: 'Add Product',
                to: '/academic-book/product/add-product',
                icon: (
                  <img
                    src={circle}
                    alt={'add product'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
              {
                component: CNavItem,
                name: 'Add Category',
                to: '/academic-book/category/add-category',
                icon: (
                  <img
                    src={circle}
                    alt={'add_category'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Subject Book',
            icon: (
              <img
                src={circle}
                alt={'Book'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
            items: [
              {
                component: CNavItem,
                name: 'Add Product',
                to: '/subject-book/product/add-product',
                icon: (
                  <img
                    src={circle}
                    alt={'add product'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
              {
                component: CNavItem,
                name: 'Add Category',
                to: '/subject-book/category/add-category',
                icon: (
                  <img
                    src={circle}
                    alt={'add_category'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Stationary',
            icon: (
              <img
                src={circle}
                alt={'stationary'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
            items: [
              {
                component: CNavItem,
                name: 'Add Product',
                to: '/stationary/product/add-product',
                icon: (
                  <img
                    src={circle}
                    alt={'add product'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
              {
                component: CNavItem,
                name: 'Add Category',
                to: '/stationary/category/add-category',
                icon: (
                  <img
                    src={circle}
                    alt={'add_category'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
            ],
          },
          {
            component: CNavGroup,
            name: 'Fashion',
            icon: (
              <img
                src={circle}
                alt={'fashion'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
            items: [
              {
                component: CNavItem,
                name: 'Add Product',
                to: '/fashion/product/add-product',
                icon: (
                  <img
                    src={circle}
                    alt={'add product'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
              {
                component: CNavItem,
                name: 'Add Category',
                to: '/fashion/category/add-category',
                icon: (
                  <img
                    src={circle}
                    alt={'add_category'}
                    className="ms-4 me-2"
                    style={{ width: '15px', height: '15px' }}
                  />
                ),
              },
            ],
          },
          {
            component: CNavItem,
            name: 'Add Banner',
            to: '/add-banner',
            icon: (
              <img
                src={circle}
                alt={'add banner'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
        ],
      },
      {
        component: CNavItem,
        name: 'All Products',
        to: '/product/view-product',
        icon: (
          <img
            src={allproducts}
            alt={'menu'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
      },
    ]
    : []),
  ...(couponPerm || adminPerm
    ? [
      {
        component: CNavGroup,
        name: 'Orders',
        icon: (
          <img
            src={order}
            alt={'order'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: 'All Orders',
            to: '/all-orders',
            icon: (
              <img
                src={circle}
                alt={'Coupon List'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
          {
            component: CNavItem,
            name: 'Daily Orders Summary',
            to: '/orders-stats',
            icon: (
              <img
                src={circle}
                alt={'Pop Up Ads'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
        ],
      },
    ]
    : []),
  ...(couponPerm || adminPerm
    ? [
      {
        component: CNavGroup,
        name: 'Marketing',
        icon: (
          <img
            src={marketing}
            alt={'marketing'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: 'Add New Coupon',
            to: '/add-coupon',
            icon: (
              <img
                src={circle}
                alt={'Add New Coupon'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
          {
            component: CNavItem,
            name: 'Coupon List',
            to: '/coupon-list',
            icon: (
              <img
                src={circle}
                alt={'Coupon List'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
          {
            component: CNavItem,
            name: 'Pop Up Ads',
            to: '/popup-ad',
            icon: (
              <img
                src={circle}
                alt={'Pop Up Ads'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
        ],
      },
    ]
    : []),
  ...(customOrderPerm || adminPerm
    ? [
      {
        component: CNavItem,
        name: 'Custom Order',
        to: '/custom-order',
        icon: (
          <img
            src={customOrder}
            alt={'customOrder'}
            className={'me-3'}
            style={{ width: '18px', height: '18px' }}
          />
        ),
      },
    ]
    : []),
  ...(manageProductPerm || adminPerm
    ? [
      {
        component: CNavItem,
        name: 'Attributes',
        to: '/attributes',
        icon: (
          <img
            src={attributes}
            alt={'attributes'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
      },
    ]
    : []),
  ...(manageSpecialExtraPerm || adminPerm
    ? [
      {
        component: CNavGroup,
        name: 'Special Extra',
        icon: (
          <img
            src={specialextra}
            alt={'special extra'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: 'Offers',
            to: '/add-offer',
            icon: (
              <img
                src={circle}
                alt={'offers'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
          {
            component: CNavItem,
            name: 'Contests',
            to: '/add-contest',
            icon: (
              <img
                src={circle}
                alt={'contests'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
          {
            component: CNavItem,
            name: 'Higher Education',
            to: '/add-higher-education',
            icon: (
              <img
                src={circle}
                alt={'higher education'}
                className={'me-3'}
                style={{ width: '18px', height: '18px' }}
              />
            ),
          },
        ],
      },
    ]
    : []),
  {
    component: CNavGroup,
    name: 'Blogs',
    icon: (
      <img
        src={blog}
        alt={'Blog'}
        className={'me-3'}
        style={{ width: '18px', height: '18px' }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: 'Add Blog',
        to: '/add-blog',
        icon: (
          <img
            src={circle}
            alt={'add blog'}
            className="me-2"
            style={{ width: '15px', height: '15px' }}
          />
        ),
      },
      {
        component: CNavItem,
        name: 'Blog Category',
        to: '/blog-category',
        icon: (
          <img
            src={circle}
            alt={'blog category'}
            className="me-2"
            style={{ width: '15px', height: '15px' }}
          />
        ),
      },
      {
        component: CNavItem,
        name: 'All Blogs',
        to: '/all-blogs',
        icon: (
          <img
            src={circle}
            alt={'all blog'}
            className="me-2"
            style={{ width: '15px', height: '15px' }}
          />
        ),
      },
    ],
  },
  ...(adminPerm || adminPerm
    ? [
      {
        component: CNavItem,
        name: 'Roles',
        to: '/roles',
        icon: (
          <img
            src={role}
            alt={'role'}
            className={'me-3'}
            style={{ width: '18px', height: '18px' }}
          />
        ),
      },
    ]
    : []),
  ...(adminPerm
    ? [
      {
        component: CNavItem,
        name: 'All Users',
        to: '/all-users',
        icon: (
          <img
            src={users}
            alt={'users'}
            className={'me-3'}
            style={{ width: '20px', height: '20px' }}
          />
        ),
      },

    ]
    : []),
  ...(manageSiteSettingsPerm || adminPerm
    ? [
      {
        component: CNavItem,
        name: 'Settings',
        to: '/settings',
        icon: (
          <img
            src={settings}
            alt={'settings'}
            className={'me-3'}
            style={{ width: '18px', height: '18px' }}
          />
        ),
      },
    ]
    : []),
]

export default _nav
