/* eslint-disable */
import React from 'react';

const Test = () => {
    const onSubmit = async (data) => {
        console.log(data)
        // product image upload
        try {
            // check if image is uploaded or not if not then use the old image
            if (data?.Picture?.length !== 0) {
                const formData = new FormData()
                formData.append('file', data?.Picture[0])
                const config = {
                    headers: {
                        Authorization: `${token}`,
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'multipart/form-data',
                    },
                }
                const res = await axiosJWT.post(`${baseURL}/api/v1/admin/upload/single`, formData, config)
                console.log(res)
                if (res?.data?.status === 200) {
                    data.Picture = res?.data?.data
                    setProductImage(data?.Picture?.mediaLink)
                }
            } else {
                setProductImage(data?.Picture)
            }

            try {
                setEditProductState(true)
                const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))

                // Get an array of string from categoryID where that's an array of object
                const categoryIDs =
                    typeof categoryID == 'string'
                        ? [categoryID]
                        : categoryID
                            ? categoryID?.map((item) => item.value)
                            : []
                const tags = data?.Tags ? data?.Tags : []
                const bodyFormData = new FormData()
                bodyFormData.append('ProductType', data?.ProductType)
                bodyFormData.append('QuantityPerUnit', 1)
                bodyFormData.append('ProductID', id)
                bodyFormData.append('ISBNNumber', data?.ISBNNumber || ' ')
                bodyFormData.append('Edition', data?.Edition || ' ')
                bodyFormData.append('URLSlug', `/${data?.ProductTitle}`)
                bodyFormData.append('TotalPage', 1)
                bodyFormData.append('UnitWeight', 1)
                bodyFormData.append('DiscountAvailable', false)
                productImage && bodyFormData.append('Picture', productImage)
                bodyFormData.append('ProductTitle', data?.ProductTitle)
                bodyFormData.append('ProductBanglishTitle', data?.ProductBanglishTitle)
                bodyFormData.append('ShortDesc', data?.ShortDesc ? data?.ShortDesc : '')
                bodyFormData.append('ProductDesc', content)
                bodyFormData.append('Categories', JSON.stringify(categoryIDs))
                bodyFormData.append(
                    'ParentCategoryID',
                    data?.ParentCategoryID ? data?.ParentCategoryID : JSON.stringify(selectedCategory),
                )
                bodyFormData.append('RegularPrice', parseInt(`${data?.RegularPrice}`))
                bodyFormData.append('SalePrice', parseInt(`${data.SalePrice}`))
                bodyFormData.append('UnitInStock', parseInt(`${data?.UnitInStock}`))
                bodyFormData.append('ProductAvailable', data?.ProductAvailable)
                bodyFormData.append('SubjectCode', `${data?.SubjectCode}`)
                bodyFormData.append('BrandID', data?.BrandID ? data?.BrandID : '')
                bodyFormData.append('Note', 'note')
                bodyFormData.append('Tags', tags ? JSON.stringify(tags) : [])
                bodyFormData.append('SKU', data?.SKU ? data?.SKU : '')
                bodyFormData.append(
                    'PublicationID',
                    data?.PublicationID ? parseInt(`${data?.PublicationID}`) : '',
                )
                bodyFormData.append('AuthorID', data?.AuthorID ? parseInt(`${data?.AuthorID}`) : '')

                bodyFormData.append(
                    'CustomAttributes',
                    JSON.stringify([
                        SubjectCode,
                        Edition,
                        Class,
                        Group,
                        Department,
                        PublishedDate,
                        Exam,
                        Type_MAIN_ACADEMIC,
                        ...customAttributeValues,
                    ]),
                )
                console.log([
                    SubjectCode,
                    Edition,
                    Class,
                    Group,
                    Department,
                    PublishedDate,
                    Exam,
                    Type_MAIN_ACADEMIC,
                    ...customAttributeValues,
                ])
                console.log('FOrmadata', bodyFormData)
                console.log(EDIT_PRODUCT)
                // Post request to edit product
                const res = await axiosJWT.post(EDIT_PRODUCT, bodyFormData, {
                    headers: {
                        Authorization: `${token}`,
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data',
                    },
                })

                if (res?.data?.status === 200) {
                    console.log(res)
                    setEditProductState(false)
                } else if (res?.data?.status === 403) {
                    console.log(res)
                    setEditProductState(false)
                } else {
                    console.log(res)
                    setEditProductState(false)
                }
            } catch (error) {
                console.log(error)
                setEditProductState(false)
            }
        } catch (error) {
            console.log('Image upload error: ', error)
            console.log(error)
        }
    } // end of onSubmit
    return (
        <div>
            
        </div>
    );
};

export default Test;