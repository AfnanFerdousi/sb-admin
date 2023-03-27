import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem } from '@coreui/react'
import AddAuthors from './AddAuthors'
import AddBrand from './AddBrand'
import AddPublication from './AddPublication'
import CustomAttributes from './CustomAttributes'

// eslint-disable-next-line react/prop-types
const Attributes = ({ attributes, setAttributes, loadAttributes }) => {
  return (
    <div className="card-body">
      {/* <AddAttribute /> */}
      <div className="card-body">
        <h6 className="card-title my-5 ps-2">All Attributes</h6>
      </div>
      <CAccordion className="rounded-0">
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>Publications</CAccordionHeader>
          <CAccordionBody>
            <AddPublication />
          </CAccordionBody>
        </CAccordionItem>

        <CAccordionItem itemKey={2}>
          <CAccordionHeader>Authors</CAccordionHeader>
          <CAccordionBody>
            <AddAuthors />
          </CAccordionBody>
        </CAccordionItem>

        <CAccordionItem itemKey={3}>
          <CAccordionHeader>Brands</CAccordionHeader>
          <CAccordionBody>
            <AddBrand />
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>

      <CustomAttributes
        attributes={attributes}
        setAttributes={setAttributes}
        loadAttributes={loadAttributes}
      />
    </div>
  )
}

export default Attributes
