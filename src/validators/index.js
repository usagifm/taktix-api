const { check, body } = require('express-validator')

exports.validateCheckUsername = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong'),
]

exports.validateCheckEmailAndPhone = [
  
    check('email')
        .exists()
        .withMessage('Email wajib di isi')
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Format email salah'),

    check('phone_number')
        .exists()
        .withMessage('Nomor HP wajib di isi')
        .notEmpty()
        .withMessage('Nomor HP tidak boleh kosong')
        .isMobilePhone()
        .withMessage('Nomor HP tidak valid'),

]

exports.validateRegisterUser = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong'),

    check('email')
        .exists()
        .withMessage('Email wajib di isi')
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Format email salah'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong'),

    check('phone_number')
        .exists()
        .withMessage('Nomor HP wajib di isi')
        .notEmpty()
        .withMessage('Nomor HP tidak boleh kosong')
        .isMobilePhone()
        .withMessage('Nomor HP tidak valid'),

    check('password')
        .exists()
        .withMessage('Password wajib di isi')
        .notEmpty()
        .withMessage('Password tidak boleh kosong'),

    check('password_confirmation')
        .exists()
        .withMessage('Password Konfirmasi wajib di isi')
        .notEmpty()
        .withMessage('Password Konfirmasi tidak boleh kosong')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(
                    'Password Konfirmasi tidak sesuai dengan password'
                )
            }
            return true
        }),

    check('role_id')
        .exists()
        .withMessage('Role id wajib di isi')
        .notEmpty()
        .withMessage('Role id tidak boleh kosong'),
]

exports.validateForgot = [
    check('email')
        .exists()
        .withMessage('Email wajib di isi')
        .notEmpty()
        .withMessage('Email tidak boleh kosong'),
]

exports.validateLoginUser = [
    check('email')
        .exists()
        .withMessage('Email wajib di isi')
        .notEmpty()
        .withMessage('Email tidak boleh kosong'),

    check('password')
        .exists()
        .withMessage('Password wajib di isi')
        .notEmpty()
        .withMessage('Password tidak boleh kosong'),
]

exports.validateEditPassword = [

    check('old_password')
        .exists()
        .withMessage('Password lama wajib di isi')
        .notEmpty()
        .withMessage('Password lama tidak boleh kosong')
        .isLength({ min: 6 }),

    check('new_password')
        .exists()
        .withMessage('Password baru wajib di isi')
        .notEmpty()
        .withMessage('Password baru tidak boleh kosong')
        .isLength({ min: 6 })
        .withMessage('Password minimal harus terdiri dari 6 karakter'),

    check('password_confirmation')
        .exists()
        .withMessage('Password Konfirmasi wajib di isi')
        .notEmpty()
        .withMessage('Password Konfirmasi tidak boleh kosong')
        .custom((value, { req }) => {
            if (value !== req.body.new_password) {
                throw new Error(
                    'Password Konfirmasi tidak sesuai dengan password baru'
                )
            }
            return true
        }),
]

exports.validateEditProfile = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong'),

    check('gender')
        .exists()
        .withMessage('Gender wajib di isi')
        .notEmpty()
        .withMessage('Gender tidak boleh kosong'),

    check('phone_number')
        .exists()
        .withMessage('Nomor HP wajib di isi')
        .notEmpty()
        .withMessage('Nomor HP tidak boleh kosong')
        .isMobilePhone()
        .withMessage('Nomor HP tidak valid'),

    check('email')
        .exists()
        .withMessage('Email wajib di isi')
        .notEmpty()
        .withMessage('Email tidak boleh kosong')
        .isEmail()
        .withMessage('Format email salah'),
]


// EXAMS
exports.validateGetExams = [
    check('per_page')
        .exists()
        .withMessage('Masukan nomor halaman data dalam query parameter'),

    check('per_page')
        .exists()
        .withMessage('Masukan jumlah per page data dalam query parameter'),
  
]

exports.validateInsertAnswerExamQuestion = [
    check('answer')
        .exists()
        .withMessage('Answer wajib di isi')
        .notEmpty()
        .withMessage('Answer tidak boleh kosong'),

    check('attemption_id')
        .exists()
        .withMessage('Attemption Id wajib di isi')
        .notEmpty()
        .withMessage('attemption_id tidak boleh kosong'),

    check('question_id')
        .exists()
        .withMessage('Question Id wajib di isi')
        .notEmpty()
        .withMessage('Question Id tidak boleh kosong'),

]

exports.validateInsertAnswerExamQuestion = [
    check('answer')
        .exists()
        .withMessage('Answer wajib di isi')
        .notEmpty()
        .withMessage('Answer tidak boleh kosong'),

    check('attemption_id')
        .exists()
        .withMessage('Attemption Id wajib di isi')
        .notEmpty()
        .withMessage('attemption_id tidak boleh kosong'),

    check('question_id')
        .exists()
        .withMessage('Question Id wajib di isi')
        .notEmpty()
        .withMessage('Question Id tidak boleh kosong'),

]



exports.validateUpdateAnswerExamQuestion = [
    check('answer_id')
        .exists()
        .withMessage('Answer Id wajib di isi')
        .notEmpty()
        .withMessage('Answer Id tidak boleh kosong'),

    check('answer')
        .exists()
        .withMessage('Answer wajib di isi')
        .notEmpty()
        .withMessage('Answer tidak boleh kosong'),

    check('attemption_id')
        .exists()
        .withMessage('Attemption Id wajib di isi')
        .notEmpty()
        .withMessage('attemption_id tidak boleh kosong'),

    check('question_id')
        .exists()
        .withMessage('Question Id wajib di isi')
        .notEmpty()
        .withMessage('Question Id tidak boleh kosong'),

]

exports.validateDeleteAnswerExamQuestion = [
    check('answer_id')
        .exists()
        .withMessage('Answer Id wajib di isi')
        .notEmpty()
        .withMessage('Answer Id tidak boleh kosong'),

    check('attemption_id')
        .exists()
        .withMessage('Attemption Id wajib di isi')
        .notEmpty()
        .withMessage('attemption_id tidak boleh kosong'),

    check('question_id')
        .exists()
        .withMessage('Question Id wajib di isi')
        .notEmpty()
        .withMessage('Question Id tidak boleh kosong'),

]


exports.validateRateExam = [
    check('rate')
        .exists()
        .withMessage('Answer Id wajib di isi')
        .notEmpty()
        .withMessage('Answer Id tidak boleh kosong'),
]
