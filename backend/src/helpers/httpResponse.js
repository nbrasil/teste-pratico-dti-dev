export const ok = (body) => {
    return{
        body: body,
        success: true,
        statusCode: 200
    }
}

export const notFound = () => {
    return{
        body: 'Not Found',
        success: false,
        statusCode: 400
    }
}

export const serverError = (error) => {
    return{
        body: 'Server Error: ' + error.message,
        success: false,
        statusCode: 400
    }
}