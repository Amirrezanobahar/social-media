//* helper function to format success response
export const successResponse = (res, statusCode = 200, data) => {
    return res.status(statusCode).json({ status: statusCode, success: true, data })
}


//* helper function to format error response
export const errorResponse = (res, statusCode, message, data) => {
    console.log({ message, data });

    return res.status(statusCode).json({ status: statusCode, success: false, error: message, data })
}


