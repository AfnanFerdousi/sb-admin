import { Navigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

// eslint-disable-next-line react/prop-types
export default function PrivateRoute({ children }) {
  const cookies = new Cookies()
  const token = cookies.get('token')

  return token ? children : <Navigate to="/login" />
}
