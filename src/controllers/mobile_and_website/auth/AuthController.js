import jwt from 'jsonwebtoken'
import { errorResponse,errorMapper } from '../../../helpers/errorResponse'
import { User, VerificationToken } from '../../../db/models'
import {
    sendEmailVerification,
    sendNewPassword,
} from '../../../helpers/sendEmail'
import { validationResult } from 'express-validator'

import Randomstring from 'randomstring'
import bcrypt from 'bcrypt'
const saltRounds = 10

const getProfile = (googleId, isTutor) => {
    const id = googleId.payload.sub
    const displayName = googleId.payload.name
    const email = googleId.payload.email
    const provider = 'google'
    const profileImage = googleId.payload.picture
    if (email?.length) {
        // equals to =>> if (email && email.length)
        return {
            googleId: id,
            name: displayName,
            email,
            provider,
            profileImage,
            isVerified: 1,
            isTutor,
        }
    }

    return null
}

const AuthController = {
    // GOOGLE AUTH
    async googleLogin(req, res, next) {
        if (!req.user) {
            return res.status(401).send({ error: 'User was not authenticate' })
        }

        const isTutor = req.query.isTutor
        console.log('user ', req.user)

        try {
            const user = await User.findOne({
                where: { googleId: req.user.payload.sub },
            })

            if (!user) {
                const user = await User.findOne({
                    where: { email: getProfile(req.user).email },
                })

                if (!user) {
                    const user = await User.create(
                        getProfile(req.user, isTutor)
                    )
                    const token = jwt.sign({ user }, process.env.JWT_SECRET)
                    return res.status(200).send({ token, user })
                }

                const token = jwt.sign({ user }, process.env.JWT_SECRET)
                return res.status(200).send({ token, user })
            }

            const token = jwt.sign({ user }, process.env.JWT_SECRET)
            return res.status(200).send({ token, user })
        } catch (err) {
            console.log(err)
        }
    },

    // REGULAR AUTH
    async login(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
          }

        const { email, password } = req.body

        

        try {
            const user = await User.findOne({ where: { email } })

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    if (user.isVerified == 0) {
                        VerificationToken.create({
                            userId: user.id,
                            token: Randomstring.generate(16),
                        })
                            .then((result) => {
                                sendEmailVerification(
                                    'Verifikasi Email untuk akun ' + user.name,
                                    result.token,
                                    user.email
                                )

                                return errorResponse(
                                    res,
                                    400,
                                    'Email belum terverifikasi, periksa folder inbox dan spam email anda',
                                    []
                                )
                            })
                            .catch((tokenErr) => {
                                return errorResponse(
                                    res,
                                    400,
                                    tokenErr.message,
                                    tokenErr
                                )
                            })
                    } else if (user.isVerified == 1) {
                        const token = jwt.sign({ user }, process.env.JWT_SECRET)
                        return res.status(200).send({ token, user })
                    }
                } else {
                    return errorResponse(res, 400, 'User tidak ditemukan', [])
                }
            } else {
                return errorResponse(res, 400, 'User tidak ditemukan', [])
            }
        } catch (error) {
            console.log(error)

            const errStacks = {}

            if (error.errors) {
                error.errors.map((er) => {
                    errStacks[er.path] = er.message
                })
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async register(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
          }
        req.body.isVerified = 0

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        req.body.password = hashedPassword

        try {
            const [user, created] = await User.findOrCreate({
                where: { email: req.body.email },
                defaults: req.body,
            })


            if (!created) {
                console.log('user, ' + user.name)

                if (user.provider == 'google') {
                    return errorResponse(
                        res,
                        400,
                        'Akun anda sudah tertaut dengan Google Sign In',
                        []
                    )
                }

                return errorResponse(res, 400, 'Validation error', [{
                    msg: "Email must be unique",
                    param: "email",
                    location: "body"
                }])
                

                // if(user.isVerified == 0){
                // VerificationToken.create(
                //     {
                //         userId: user.id,
                //         token: Randomstring.generate(16)
                //     }
                // ).then((result) => {

                //     sendEmailVerification(
                //         'Verifikasi Email untuk akun' + req.body.name,
                //         result.token,
                //         req.body.email
                //     )

                //     return res
                //     .status(200)
                //     .send({
                //         message:
                //             'Registrasi berhasil, silahkan verifikasi email anda (Ulang)',
                // })

                // }).catch((tokenErr) => {
                //     return errorResponse(res,400,tokenErr.message,tokenErr)
                // })

                //     return errorResponse(res,400,"Validation error",{
                //         "email": "email must be unique"
                //     })

                //    }else

                //    if (user.isVerified == 1){

                //        return errorResponse(res,400,"Akun telah terdaftar",[])
                //    }

            } else {
                VerificationToken.create({
                    userId: user.id,
                    token: Randomstring.generate(16),
                })
                    .then((result) => {
                        sendEmailVerification(
                            'Verifikasi Email untuk akun ' + req.body.name,
                            result.token,
                            req.body.email
                        )

                        return res.status(200).send({
                            message:
                                'Registrasi berhasil, silahkan verifikasi email anda, periksa folder inbox dan spam email anda',
                        })
                    })
                    .catch((tokenErr) => {

                        
                        return errorResponse(
                            res,
                            400,
                            tokenErr.message,
                            tokenErr.errors
                        )
                    })
            }
        } catch (error) {
            console.log(error)

            var errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }

            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async forgot(req, res, next) {
        const email = req.body.email
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
        }

        try {

            const user = await User.findOne({ where: { email: email, isVerified: 1 } })
            if (!user) {
                return errorResponse(res, 400, 'Email tidak ditemukan', [])
            } else {
                const newpassword = Randomstring.generate(12)
                const hashedPassword = await bcrypt.hash(newpassword, saltRounds)

                await User.update(
                { password: hashedPassword },
                {
                    where: {
                        email: email,
                    },
                }
                )

                // NODEMAILER SEND EMAIL WITH NEW PASSWORD
                sendNewPassword(
                    'Password baru untuk akun ' + user.name,
                    newpassword,
                    user.email
                )

                return res.status(200).send({
                    message:
                        'Reset Password berhasil, silahkan cek email untuk melihat password baru anda, periksa folder inbox dan spam email anda',
                })
            }
            
        } catch (error) {
            console.log(error)
            var errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
        
    },
}

export default AuthController
