import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'

const StockOutProducts = ({ products }) => {
  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="card-title" style={{ fontSize: '20px' }}>
            Stock Out Products
          </h5>
          <Link to={`/product/view-product`}>
            <CButton color="primary" variant="outline" className="btn">
              All Products
            </CButton>
          </Link>
        </div>
        <div className="">
          <CTable>
            <CTableHead>
              <CTableRow style={{ background: '#F3F5F9' }}>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Stock
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="py-3 border-end-0"
                  style={{ fontSize: '14px' }}
                  scope="col"
                >
                  Amount
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {products?.slice(0, 15)?.map((product) => {
                return (
                  <>
                    {product?.ProductAvailable ? (
                      <></>
                    ) : (
                      <>
                        <CTableRow>
                          <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                            {product?.ProductTitle}
                          </CTableDataCell>
                          <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                            000
                          </CTableDataCell>
                          <CTableDataCell style={{ fontSize: '14px', color: '#8E98AA' }}>
                            à§³{product?.SalePrice}
                          </CTableDataCell>
                        </CTableRow>
                      </>
                    )}
                  </>
                )
              })}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  )
}

export default StockOutProducts
