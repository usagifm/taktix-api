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
import ExamAnswerController from '../controllers/mobile_and_website/siswa/ExamAnswerController'
import TutorClassController from '../controllers/mobile_and_website/tutor/TutorClassController'
import TutorLksController from '../controllers/mobile_and_website/tutor/TutorLksController'
import UserClassController from '../controllers/mobile_and_website/siswa/UserClassController'


const routes = (app) => {   
    // GENERAL
    app.get('/',(req, res) => {
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
    app.post('/student/exam/:exam_id/answer/insert', checkToken, validator.validateInsertAnswerExamQuestion , ExamAnswerController.insertAnswerExamQuestion)
    app.patch('/student/exam/:exam_id/answer/update', checkToken, validator.validateUpdateAnswerExamQuestion , ExamAnswerController.updateAnswerExamQuestion)
    app.delete('/student/exam/:exam_id/answer/delete', checkToken, validator.validateDeleteAnswerExamQuestion , ExamAnswerController.deleteAnswerExamQuestion)
    app.get('/student/exam/:exam_id/attemption/:attemption_id', checkToken, ExamAnswerController.getExamAttemptionDetail)
    app.post('/student/exam/:exam_id/rate', checkToken, validator.validateRateExam ,ExamAnswerController.rateExam)
    app.get('/student/exam/:exam_id/check-if-ever-rate', checkToken,ExamAnswerController.checkEverRateExam)
    app.get('/exam-recommendation', checkToken , ExamController.getExamRecommendation)

    

    // User Siswa Class 
    app.post('/student/class-enroll', checkToken, validator.validateEnrollUserToClass ,UserClassController.enrollToClass)
    app.get('/student/class', checkToken ,UserClassController.enrolledClass)
    app.get('/student/class/:class_id', checkToken ,UserClassController.getClassById)
    app.delete('/student/class/:class_id/unenroll', checkToken ,UserClassController.unenrollFromClass)
    
    app.get('/student/class/:class_id/section/:section_id', checkToken ,UserClassController.getClassLksSectionDetail)
    app.get('/student/class/:class_id/section/:section_id/content/:content_id', checkToken ,UserClassController.getClassLksContentDetail)
    app.post('/student/class/:class_id/section/:section_id/content/:content_id/mark', checkToken ,UserClassController.markClassLksContent)


    // User Tutor Class
    app.post('/tutor/class', checkToken , validator.validateCreateClass ,TutorClassController.createClass)
    app.patch('/tutor/class/:class_id', checkToken , validator.validateEditClass ,TutorClassController.editClass)
    app.delete('/tutor/class/:class_id', checkToken  ,TutorClassController.deleteClass)
    app.get('/tutor/class/:class_id', checkToken  ,TutorClassController.getClassById)
    app.get('/tutor/class', checkToken,TutorClassController.getClasses)
    app.post('/tutor/class/:class_id/set-lks/:lks_id', checkToken,TutorClassController.setLksToClass)
    app.delete('/tutor/class/:class_id/member/:member_id', checkToken  ,TutorClassController.deleteClassMember)
    app.patch('/tutor/class/:class_id/lks/unset', checkToken  ,TutorClassController.unsetClassLks)

    // User Tutor LKS 
    app.get('/lks', checkToken, TutorLksController.getLks)
    app.get('/tutor/lks', checkToken, TutorLksController.getTutorLks)
    app.get('/tutor/lks-pagination', checkToken, TutorLksController.getTutorLksPagination)
    app.post('/tutor/lks/:lks_id/buy', checkToken, TutorLksController.buyLks)
    app.get('/tutor/lks/:lks_id', checkToken, TutorLksController.getLksById)

}

export default routes
