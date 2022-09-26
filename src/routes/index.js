import passport from 'passport'
const { checkToken } = require('../jwt/tokenValidation')
import AuthController from '../controllers/mobile_and_website/auth/AuthController'
import VerificationController from '../controllers/mobile_and_website/auth/VerificationController'
import validator from '../validators'
require('../services/google')

const routes = (app) => {
    app.post('/register', validator.validateRegisterUser ,AuthController.register)
    app.post('/login',validator.validateLoginUser , AuthController.login)
    app.post('/forgot', validator.validateForgot ,AuthController.forgot)
    app.get('/verification', VerificationController.verifyUser)

    // User Google Sign In
    app.post(
        '/oauth/google',
        passport.authenticate('google-id-token', { session: false }),
        AuthController.googleLogin
    )
}

export default routes
