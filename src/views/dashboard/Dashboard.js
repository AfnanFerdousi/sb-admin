import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { axiosJWT } from 'src/axiosJWT'
import { baseURL } from 'src/baseUrl'
import Cookies from 'universal-cookie'
import { gray, primary_orange } from '../../colors'
import RecentOrders from './RecentOrders'
import StockOutProducts from './StockOutProducts'

const Dashboard = () => {
  const cookies = new Cookies()
  const token = cookies.get('token')
  const [orders, setOrders] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const [todayOrders, setTodayOrders] = useState([])
  const [products, setProducts] = useState([])
  const { promiseInProgress } = usePromiseTracker()

  useEffect(() => {
    const loadStats = async () => {
      const response = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/admin/order/get_orders?limit=100000000`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      setOrders(response?.data?.orders)
    }
    const loadStats2 = async () => {
      const response = await trackPromise(
        axiosJWT.get(
          `${baseURL}/api/v1/admin/order/get_orders?limit=100000000&OrderStatus=DELIVERED`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        ),
      )
      setSoldItems(response?.data?.orders)
    }
    const loadStats3 = async () => {
      const response = await trackPromise(
        axiosJWT.get(`${baseURL}/api/v1/admin/order/today`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      )
      setTodayOrders(response?.data?.orders)
    }

    const loadProducts = async () => {
      const res = await trackPromise(
        axios.get(`${baseURL}/api/v1/public/product/product_filter?limit=10000`),
      )
      if (res?.data) setProducts(res?.data?.products)
    }
    loadProducts()
    loadStats()
    loadStats2()
    loadStats3()
  }, [token])
  //console.log(orders)

  const getSumByKey = (arr, key) => {
    return arr?.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
  }

  const totalPrice = getSumByKey(orders, 'TotalPrice')

  return (
    <div>
      {promiseInProgress === false ? (
        <>
          {' '}
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <CCard className={'shadow-sm border-0 mb-3'}>
                <CCardBody className={'flex align-items-center text-center'}>
                  <CCardTitle style={{ color: gray }} className={'fs-6'}>
                    Todays Orders
                  </CCardTitle>
                  <CCardText className={'fs-1 fw-bold'}>{todayOrders?.length}</CCardText>
                </CCardBody>
              </CCard>
            </div>
            <div className="col-md-3 col-sm-6">
              <CCard className={'shadow-sm border-0 mb-3'}>
                <CCardBody className={'flex align-items-center text-center'}>
                  <CCardTitle style={{ color: gray }} className={'fs-6'}>
                    Total Orders
                  </CCardTitle>
                  <CCardText className={'fs-1 fw-bold'}>৳{Math.round(totalPrice)}</CCardText>
                </CCardBody>
              </CCard>
            </div>
            <div className="col-md-3 col-sm-6">
              <CCard className={'shadow-sm border-0 mb-3'}>
                <CCardBody className={'flex align-items-center text-center'}>
                  <CCardTitle style={{ color: gray }} className={'fs-6'}>
                    Orders
                  </CCardTitle>
                  <CCardText className={'fs-1 fw-bold'}> {orders?.length}</CCardText>
                </CCardBody>
              </CCard>
            </div>
            <div className="col-md-3 col-sm-6">
              <CCard className={'shadow-sm border-0 mb-3'}>
                <CCardBody className={'flex align-items-center text-center'}>
                  <CCardTitle style={{ color: gray }} className={'fs-6'}>
                    Sold Items
                  </CCardTitle>
                  <CCardText className={'fs-1 fw-bold'}>{soldItems?.length}</CCardText>
                </CCardBody>
              </CCard>
            </div>
          </div>
          <div className="row">
            <RecentOrders orders={orders} />
            <StockOutProducts products={products} />
          </div>{' '}
        </>
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
  )
}

export default Dashboard
