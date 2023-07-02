const { check, body } = require('express-validator')

// USERS
exports.validateCheckUsername = [
    check('name')
        .exists()
        .withMessage('Nama wajib di isi')
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Nama minimal terdiri dari 5 karakter'),

    check('username')
        .exists()
        .withMessage('Username wajib di isi')
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isLength({ min: 5 })
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
        .isLength({ min: 5 })
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
        .isLength({ min: 5 })
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
        .isLength({ min: 6 })
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
        .isLength({ min: 6 })
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
        .isLength({ min: 6 })
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
        .optional()
        .notEmpty()
        .withMessage('Nama tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Nama minimal terdiri dari 5 karakter'),

    check('username')
        .optional()
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Username minimal terdiri dari 5 karakter'),

    check('gender')
        .optional()
        .notEmpty()
        .withMessage('Gender tidak boleh kosong'),

    check('phone_number')
        .optional()
        .notEmpty()
        .withMessage('Nomor HP tidak boleh kosong')
        .isMobilePhone()
        .withMessage('Nomor HP tidak valid')
        .isLength({ min: 11, max: 13 })
        .withMessage('Nomor HP minimal 11 digit dan maksimal 13 digit'),

    check('birth_date')
        .optional()
        .notEmpty()
        .withMessage('Tanggal lahir tidak boleh kosong'),

    check('province_id')
        .optional()
        .notEmpty()
        .withMessage('Id Provinsi tidak boleh kosong'),

    check('province')
        .optional()
        .notEmpty()
        .withMessage('Provinsi tidak boleh kosong'),

    check('password')
        .optional()
        .custom((password) => {
            if (!isEmptyObject(password)) {
                throw new Error('Attribute Not Allowed');
            }
        }),

    check('new_password')
        .optional()
        .custom((new_password) => {
            if (!isEmptyObject(new_password)) {
                throw new Error('Attribute Not Allowed');
            }
        }),
    check('is_verified')
        .optional()
        .custom((is_verified) => {
            if (!isEmptyObject(is_verified)) {
                throw new Error('Attribute Not Allowed');
            }
        }),

    check('fcm_token')
        .optional()
        .custom((new_password) => {
            if (!isEmptyObject(new_password)) {
                throw new Error('Attribute Not Allowed');
            }
        }),

    check('google_id')
        .optional()
        .custom((google_id) => {
            if (!isEmptyObject(google_id)) {
                throw new Error('Attribute Not Allowed');
            }
        }),
    check('role_id')
        .optional()
        .custom((role_id) => {
            if (!isEmptyObject(role_id)) {
                throw new Error('Attribute Not Allowed');
            }
        }),
    check('deleted_at')
        .optional()
        .custom((deleted_at) => {
            if (!isEmptyObject(deleted_at)) {
                throw new Error('Attribute Not Allowed');
            }
        }),

]

exports.validateEditPhotoProfile = [
    check('photo_profile')
        .exists()
        .withMessage('Photo profile wajib di isi')
        .notEmpty()
        .withMessage('Photo profil tidak boleh kosong')
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


exports.validateInsertAnswerLksExamQuestion = [
    check('answer')
        .exists()
        .withMessage('Answer wajib di isi')
    // .notEmpty()
    // .withMessage('Answer tidak boleh kosong')
    ,

    check('lks_attemption_id')
        .exists()
        .withMessage('Attemption Id wajib di isi')
        .notEmpty()
        .withMessage('attemption_id tidak boleh kosong'),

    check('question_id')
        .exists()
        .withMessage('Question Id wajib di isi')
        .notEmpty()
        .withMessage('Question Id tidak boleh kosong')
]
exports.validateUpdateAnswerLksExamQuestion = [
    check('answer_id')
        .exists()
        .withMessage('Answer Id wajib di isi')
        .notEmpty()
        .withMessage('Answer Id tidak boleh kosong'),

    check('answer')
        .exists()
        .withMessage('Answer wajib di isi')
    // .notEmpty()
    // .withMessage('Answer tidak boleh kosong')
    ,

    check('lks_attemption_id')
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

exports.validateDeleteAnswerLksExamQuestion = [
    check('answer_id')
        .exists()
        .withMessage('Answer Id wajib di isi')
        .notEmpty()
        .withMessage('Answer Id tidak boleh kosong'),

    check('lks_attemption_id')
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

exports.validateCorrectedLksExamAnswer = [
    check('is_correct')
        .exists()
        .withMessage('Jawaban wajib di isi')
        .notEmpty()
        .withMessage('Jawaban Id tidak boleh kosong'),

]


exports.validateConfirmDeleteAccount = [
    check('confirmation_id')
        .exists()
        .withMessage('Confirmation Id wajib di isi')
        .notEmpty()
        .withMessage('Confirmation Id tidak boleh kosong')
    ,

    check('token')
        .exists()
        .withMessage('Token wajib di isi')
        .notEmpty()
        .withMessage('Token tidak boleh kosong'),
]