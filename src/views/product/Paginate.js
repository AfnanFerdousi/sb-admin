// eslint-disable-next-line react/prop-types
const Paginate = ({ productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <span onClick={() => paginate(number)} className="page-link cursor-pointer">
              {number}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Paginate
