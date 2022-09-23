const { verify } = require('jsonwebtoken')
const { errorResponse } = require('../helpers/errorResponse')

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization')
        if (token) {
            token = token.slice(7)
            verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    errorResponse(res, 401, 'Invalid Token')
                } else {
                    console.log(decoded)
                    req.user = decoded
                    next()
                }
            })
        } else {
            errorResponse(res, 401, 'Unauthorized')
        }
    },
}
