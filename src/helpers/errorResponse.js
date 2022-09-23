module.exports.errorResponse = (res, statusCode, message, errorStack) => {
    res.status(statusCode || 400).json({
        error: true,
        code: statusCode || 400,
        message: message || 'error',
        errorStacks: errorStack || [],
    })
}
