import passport from 'passport'
const { checkToken } = require('../jwt/tokenValidation')
import AuthController from '../controllers/mobile_and_website/auth/AuthController'
import VerificationController from '../controllers/mobile_and_website/auth/VerificationController'
import ProfileController from '../controllers/mobile_and_website/profile/ProfileController'
import validator from '../validators'
require('../services/google')

const routes = (app) => {
    // User Regular Auth
    app.post('/register', validator.validateRegisterUser, AuthController.register)
    app.post('/login', validator.validateLoginUser, AuthController.login)
    app.delete('/logout', AuthController.logout)
    app.post('/forgot', validator.validateForgot, AuthController.forgot)
    app.get('/verification', VerificationController.verifyUser)

    // User Google Sign In
    app.post(
        '/oauth/google',
        passport.authenticate('google-id-token', { session: false }),
        AuthController.googleLogin
    )

    // User Profile
    app.get('/profile',checkToken, ProfileController.getProfile)
    app.patch('/profile/edit',checkToken, validator.validateEditProfile, ProfileController.editProfile)
    app.patch('/profile/password',checkToken, validator.validateEditPassword, ProfileController.editPassword)
}

export default routes
