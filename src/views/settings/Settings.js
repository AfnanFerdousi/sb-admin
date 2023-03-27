/* eslint-disable */
import AcademicBookCat from './AcademicBookCat'
import PopularAuthors from './PopularAuthors'
import PopularBooks from './PopularBooks'
import PrivacyPolicy from './PrivacyPolicy'
import ReturnPolicy from './ReturnPolicy'
import SiteDetails from './SiteDetails'
import FooterDetails from './FooterDetails'
import SubCategory from './SubCategory'
import TermsCondition from './TermsCondition'
import Book from './Book'
import Category from './Category'

const Settings = () => {
  return (
    <div className="mb-4">
      <SiteDetails />
      {/* <FooterDetails/> */}
      {/* <Book/> */}
      <PopularBooks />
      <SubCategory />
      {/* <Category/> */}
      <AcademicBookCat />
      {/* <PopularSubjects /> */}
      <PopularAuthors />
      <TermsCondition />
      <ReturnPolicy />
      <PrivacyPolicy />
    </div>
  )
}

export default Settings
