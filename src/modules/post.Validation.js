import yup from 'yup'

export const uploadPOstValidation = new yup.object({
    description:yup.string().max(2200,' Description must be less than 2200 characters'),
})