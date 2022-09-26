module.exports.errorResponse = (res, statusCode, message, errorStack) => {
    res.status(statusCode || 400).json({
        error: true,
        code: statusCode || 400,
        message: message || 'error',
        errorStacks: errorStack || [],
    })
}


module.exports.errorMapper = (array) => {
    var newArray = []
    for(var i = 0; i< array.length; i++){
        var newError = {
            msg : array[i].message,
            param : array[i].path,
            location: "body"
        }
        newArray.push(newError)

        return newArray
    }
}
