const yup = require("yup");

exports.registerValidationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  username: yup
    .string()
    .min(3, "Username must be at least 3 chars long")
    .required("Username is required"),
  name: yup
    .string()
    .min(3, "Name must be at least 3 chars long")
    .max(50, "Name cannot be more than 50 chars long")
    .required("Name is required"),
  // .optional(),

  password: yup
    .string()
    .min(8, "Password must be at least 8 chars long")
    .required("Password is required"),
});

exports.loginValidationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 chars long")
    .required("Password is required"),
});

exports.forgetPasswordValidationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

exports.resetPasswordValidationSchema = yup.object({
  token: yup.string().required("Reset Token is required !"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 chars ...")
    .required("Password is required"),
});
