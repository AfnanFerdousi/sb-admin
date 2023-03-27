// eslint-disable-next-line react/prop-types
export default function RequireAuth(props) {
  const user = JSON.parse(localStorage.getItem('user'))

  return props.permissions.find((role) => user.Permissions.includes(role)) ||
    user.Permissions.includes('SUPER_ADMIN') ? (
    props.children
  ) : (
    <h3 className="text-center">You are not permitted to access this</h3>
  )
}
