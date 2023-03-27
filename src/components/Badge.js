/* eslint-disable */
import { CBadge } from '@coreui/react'

// eslint-disable-next-line react/prop-types
const Badge = ({ status }) => {
  return (
    <div>
      {status === 'RECEIVED' ? (
        <CBadge style={{ backgroundColor: '#C8ECC9', color: '#2E7D32' }} shape="rounded-pill">
          Success
        </CBadge>
      ) : status === 'PENDING' ? (
        <CBadge style={{ backgroundColor: '#FFF1D0', color: '#F5BD33' }} shape="rounded-pill">
          Pending
        </CBadge>
      ) : status === 'PENDING_PAYMENT' ? (
          <CBadge style={{ backgroundColor: '#FFF1D0', color: '#F5BD33' }} shape="rounded-pill">
            Pending Payment
          </CBadge>
        ) : status === 'PROCESSING' ? (
          <CBadge style={{ backgroundColor: '#FFF1D0', color: '#F5BD33' }} shape="rounded-pill">
            Processing
          </CBadge>
        ) : status === 'SHIPPED' ? (
          <CBadge style={{ backgroundColor: '#C8ECC9', color: '#2E7D32' }} shape="rounded-pill">
            Shipped
          </CBadge>
        ) : status === 'DELIVERED' ? (
          <CBadge style={{ backgroundColor: '#C8ECC9', color: '#2E7D32' }} shape="rounded-pill">
            Delivered
          </CBadge>
                ) : status === true ? (
                  <CBadge style={{ backgroundColor: '#C8ECC9', color: '#2E7D32' }} shape="rounded-pill">
                    VERIFIED
                  </CBadge>
                ) : status === 'DELIVERY_FAILED' ? (
          <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
            Delivery failed
          </CBadge>
        ) : status === 'CANCELED_BY_CUSTOMER' ? (
          <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
            Cancelled by customer
          </CBadge>
        ) : status === 'CANCELED_BY_SELLER' ? (
          <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
            Cancelled by seller
          </CBadge>
        )
        
                        : status === false ? (
                          <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
                            UNVERIFIED
                          </CBadge>
                        ) : (
          <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
            unknown status
          </CBadge>
        )}
    </div>
  )
}

export default Badge
