import * as yup from 'yup';
export const registerValidation = yup.object({
    email: yup.string().email('Email is not valid').required('Email is required'),
    username: yup.string().min(3, 'Username must be at least 3 characters long').required('Username is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    name: yup.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters').required('Name is required'),
});

export const loginValidation = yup.object({
    username: yup.string().min(3, 'Username must be at least 3 characters long').required('Username is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
})