const { check, body } = require('express-validator')
import { User } from '../db/models'

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
    

        check('phoneNumber')

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

    check('passwordConfirmation')
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

    check('isTutor')
        .exists()
        .withMessage('isTutor wajib di isi')
        .notEmpty()
        .withMessage('isTutor tidak boleh kosong'),
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
