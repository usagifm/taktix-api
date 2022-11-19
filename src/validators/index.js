const { check, body } = require('express-validator')

// USERS
exports.validateCheckUsername = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Nama minimal terdiri dari 5 karakter'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Username minimal terdiri dari 5 karakter'),
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
        .withMessage('Nomor HP tidak valid')
        .isLength({ min: 11, max: 13 })
        .withMessage('Nomor HP minimal 11 digit dan maksimal 13 digit'),
]
exports.validateRegisterUser = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Nama minimal terdiri dari 5 karakter'),

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
        .withMessage('Username tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Username minimal terdiri dari 5 karakter'),

    check('phone_number')
        .exists()
        .withMessage('Nomor HP wajib di isi')
        .notEmpty()
        .withMessage('Nomor HP tidak boleh kosong')
        .isMobilePhone()
        .withMessage('Nomor HP tidak valid')
        .isLength({ min: 11, max: 13 })
        .withMessage('Nomor HP minimal 11 digit dan maksimal 13 digit'),

    check('password')
        .exists()
        .withMessage('Password wajib di isi')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
        .isLength({ min:6 })
        .withMessage('Password minimal harus terdiri dari 6 karakter'),

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
        })
        .isLength({ min:6 })
        .withMessage('Password minimal harus terdiri dari 6 karakter'),

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
        .withMessage('Password tidak boleh kosong')
        .isLength({ min:6 })
        .withMessage('Password minimal harus teridiri dari 6 karakter'),
]
exports.validateEditPassword = [
    check('old_password')
        .exists()
        .withMessage('Password lama wajib di isi')
        .notEmpty()
        .withMessage('Password lama tidak boleh kosong')
        .isLength({ min: 6 })
        .withMessage('Password minimal harus terdiri dari 6 karakter'),

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
        })
        .isLength({ min: 6 })
        .withMessage('Password minimal harus terdiri dari 6 karakter'),
]
exports.validateEditProfile = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Nama minimal terdiri dari 5 karakter'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isLength({ min:5 })
        .withMessage('Username minimal terdiri dari 5 karakter'),

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
        .withMessage('Nomor HP tidak valid')
        .isLength({ min: 11, max: 13 })
        .withMessage('Nomor HP minimal 11 digit dan maksimal 13 digit'),

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

// CLASSES
exports.validateCreateClass = [
    check('class_name')
        .exists()
        .withMessage('Nama kelas wajib di isi')
        .notEmpty()
        .withMessage('Nama kelas tidak boleh kosong'),

    check('subject_id')
        .exists()
        .withMessage('Mata pelajaran wajib di isi')
        .notEmpty()
        .withMessage('Mata pelajaran tidak boleh kosong'),
    check('grade_id')
        .exists()
        .withMessage('Tingkat kelas wajib di isi')
        .notEmpty()
        .withMessage('Tingkat kelas tidak boleh kosong'),
    check('limit')
        .exists()
        .withMessage('Limit kuota kelas wajib di isi')
        .notEmpty()
        .withMessage('Limit kuota kelas tidak boleh kosong'),
        
]
exports.validateEditClass = [
    check('class_name')
        .exists()
        .withMessage('Nama kelas wajib di isi')
        .notEmpty()
        .withMessage('Nama kelas tidak boleh kosong'),
    check('subject_id')
        .exists()
        .withMessage('Mata pelajaran wajib di isi')
        .notEmpty()
        .withMessage('Mata pelajaran tidak boleh kosong'),
    check('grade_id')
        .exists()
        .withMessage('Tingkat kelas wajib di isi')
        .notEmpty()
        .withMessage('Tingkat kelas tidak boleh kosong'),
    check('limit')
        .exists()
        .withMessage('Limit kuota kelas wajib di isi')
        .notEmpty()
        .withMessage('Limit kuota kelas tidak boleh kosong'),
]
exports.validateEnrollUserToClass = [
    check('enroll_code')
        .exists()
        .withMessage('Kode enroll kelas wajib di isi')
        .notEmpty()
        .withMessage('Kode enroll kelas boleh kosong')
]
