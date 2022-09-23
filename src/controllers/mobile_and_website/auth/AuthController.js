import jwt from 'jsonwebtoken'
import { errorResponse } from '../../../helpers/errorResponse'
import { User, VerificationToken } from '../../../db/models'
import { sendEmailVerification } from '../../../helpers/sendEmail'

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
    async login(req, res, next) {
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
        if (
            !req.body.password ||
            !req.body.password ||
            req.body.passwordConfirmation != req.body.password
        ) {
            return errorResponse(res, 400, 'Password not valid')
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

                return errorResponse(res, 400, 'Validation error', {
                    email: 'email must be unique',
                })

                //  if(user.isVerified == 0){
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
                            tokenErr
                        )
                    })
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
}

export default AuthController
