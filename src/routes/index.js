import passport from 'passport'
const { checkToken } = require('../jwt/tokenValidation')
import AuthController from '../controllers/mobile_and_website/auth/AuthController'
import VerificationController from '../controllers/mobile_and_website/auth/VerificationController'
import ProfileController from '../controllers/mobile_and_website/profile/ProfileController'
import GeneralController from '../controllers/mobile_and_website/general/GeneralController'
import validator from '../validators'
require('../services/google')
import {upload} from './../helpers/multer'
import ExamController from '../controllers/mobile_and_website/siswa/ExamController'

const routes = (app) => {   
    // GENERAL
    app.get('/',(req, res) => {
        // res.send('Welcome to Taktix API Server, Server is okay!')
        res.sendFile('welcome.html', {root: __dirname })
      })
    app.post('/upload', upload ,checkToken, GeneralController.uploadImage)
    app.get('/set-masters', checkToken, GeneralController.getSetMasters)
    app.get('/provinces', checkToken, GeneralController.getProvinces)

    // Register validation
    app.post('/register/validation/1', validator.validateCheckUsername, AuthController.checkUsername)
    app.post('/register/validation/2', validator.validateCheckEmailAndPhone, AuthController.checkEmailAndPhone)

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

    // Both User 
    app.get('/exam', checkToken ,validator.validateGetExams, ExamController.getExams)

    // User Siswa 
    app.get('/student/exam/:exam_id', checkToken , ExamController.getExamDetail)
    app.post('/student/exam/:exam_id/assign', checkToken , ExamController.assignExam)
    app.get('/student/exam-pagination', checkToken , ExamController.getUserExamsPagination)
    app.get('/student/exam', checkToken , ExamController.getUserExams)
    app.post('/student/exam/:exam_id/start', checkToken , ExamController.startExam)
    app.post('/student/exam/:exam_id/finish', checkToken , ExamController.finishExam)
    app.post('/student/exam/:exam_id/answer/insert', checkToken, validator.validateInsertAnswerExamQuestion , ExamController.insertAnswerExamQuestion)
    app.patch('/student/exam/:exam_id/answer/update', checkToken, validator.validateUpdateAnswerExamQuestion , ExamController.updateAnswerExamQuestion)
    app.delete('/student/exam/:exam_id/answer/delete', checkToken, validator.validateDeleteAnswerExamQuestion , ExamController.deleteAnswerExamQuestion)
    app.get('/student/exam/:exam_id/attemption/:attemption_id', checkToken, ExamController.getExamAttemptionDetail)
    app.post('/student/exam/:exam_id/rate', checkToken, validator.validateRateExam ,ExamController.rateExam)
    app.get('/student/exam/:exam_id/check-if-ever-rate', checkToken,ExamController.checkEverRateExam)
    
}

export default routes
