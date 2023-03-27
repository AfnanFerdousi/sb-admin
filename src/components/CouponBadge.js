/* eslint-disable */
import { CBadge } from '@coreui/react';
import moment from 'moment';
import React from 'react';

const CouponBadge = ({ start, end }) => {
    const presentDate = moment(new Date()).format('MM/DD/YYYY')
    const startDate = moment(start).format('MM/DD/YYYY')
    const endDate = moment(end).format('MM/DD/YYYY')
    return (
        <div>
            {startDate < presentDate && endDate < presentDate ?
                (
                    <CBadge style={{ backgroundColor: '#FFD6DB', color: '#FF3D57' }} shape="rounded-pill">
                        Expired
                    </CBadge>
                ) : startDate < presentDate && endDate >= presentDate ?
                    (
                        <CBadge style={{ backgroundColor: '#C8ECC9', color: '#2E7D32' }} shape="rounded-pill">
                            Running
                        </CBadge>
                    ) : startDate > presentDate && endDate > presentDate ? (
                        <CBadge style={{ backgroundColor: '#FFF1D0', color: '#F5BD33' }} shape="rounded-pill">
                            Upcoming
                        </CBadge>
                    ) : <></>
            }
        </div>
    );
};

export default CouponBadge;
