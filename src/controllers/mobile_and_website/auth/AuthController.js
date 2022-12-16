import jwt from 'jsonwebtoken'
import { errorResponse,errorMapper } from '../../../helpers/errorResponse'
import { User, VerificationToken,SetMaster,Province } from '../../../db/models'
const { Op } = require("sequelize");
import {
    sendEmailVerification,
    sendNewPassword,
} from '../../../helpers/sendEmail'
import { validationResult } from 'express-validator'
import Randomstring from 'randomstring'
import bcrypt from 'bcrypt'
const saltRounds = 10

const getProfile = (googleId, role_id) => {

    // if(fcm_token  !== null && fcm_token  !== "" && fcm_token !== undefined){


    // }

    
    const id = googleId.payload.sub
    const displayName = googleId.payload.name
    const email = googleId.payload.email
    const provider = 'google'
    const photo_profile = googleId.payload.picture
    if (email?.length) {
        // equals to =>> if (email && email.length)
        return {
            google_id: id,
            name: displayName,
            email,
            provider,
            photo_profile,
            is_verified: 1,
            role_id,
            // fcm_token
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

        const role_id = req.query.role_id
        console.log('user ', req.user)

        // const fcm_token = req.query.fcm_token

        try {
            const user = await User.findOne({
                where: { google_id: req.user.payload.sub },
            })
            

            if (!user) {
                const user = await User.findOne({
                    where: { email: getProfile(req.user).email },
                })

                if (!user) {
                    var newUser = await User.create(
                        getProfile(req.user, role_id)
                    )


                    const user = await User.findOne({

                        where: { email: getProfile(req.user).email }})
        

                    console.log("Isinya setelah create : ", user)

                    console.log("Disini masuk : 1")
                    const token = jwt.sign({ user }, process.env.JWT_SECRET)
                    return res.status(200).send({ token, user })
                }


            // if(fcm_token !== null && fcm_token !== "" && fcm_token !== undefined){

            //     const insertToken =  await User.update(
            //          { fcm_token: fcm_token },
            //          {
            //              where: {
            //                  id: user.id,
            //              },
            //          }
            //          )
                 
            //      }


            console.log("Disini masuk : 2")
                const token = jwt.sign({ user }, process.env.JWT_SECRET)
                return res.status(200).send({ token, user })
            }


            // if(fcm_token !== null && fcm_token !== "" && fcm_token !== undefined){

            //     const insertToken =  await User.update(
            //          { fcm_token: fcm_token },
            //          {
            //              where: {
            //                  id: user.id,
            //              },
            //          }
            //          )
                 
            //      }

            console.log("Disini masuk : 3")
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
            const user = await User.findOne({
                include: [
                    { model: SetMaster, as: 'role', attributes: ['id','category','name']},
                    { model: Province, as: 'province', attributes: ['id','name']}
                ],
                where: { [Op.or]: [
                { email: email },
                { username: email }
              ] } })

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    if (user.is_verified == 0) {
                        VerificationToken.create({
                            user_id: user.id,
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
                    } else if (user.is_verified == 1) {

                        // if(req.body.fcm_token !== null && req.body.fcm_token  !== "" && req.body.fcm_token !== undefined){

                        //    const insertToken =  await User.update(
                        //         { fcm_token: req.body.fcm_token },
                        //         {
                        //             where: {
                        //                 id: user.id,
                        //             },
                        //         }
                        //         )
                            
                        //     }


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

            let errStacks = {}

            if (error.errors) {
                error.errors.map((er) => {
                    errStacks[er.path] = er.message
                })
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

        // REGISTER VERIFICATION
        async checkUsername(req, res, next) {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {

                return errorResponse(res, 400, 'Validation error', errors.array())
            }
            try {
                const user = await User.findOne({
                    where: {
                        username: req.body.username
                    },
                })
                if(user){
                    return errorResponse(res, 400, 'Username Sudah Digunakan', [])
                } else {
                    return res.status(200).json({message: "OK"})
                }
    
            } catch (error) {
                console.log(error)
                let errStacks = {}

                if (error.errors) {
                    error.errors.map((er) => {
                        errStacks[er.path] = er.message
                    })
                }
                return errorResponse(res, 400, error.message, errStacks)
            }
        },

        async checkEmailAndPhone(req, res, next) {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, 'Validation error', errors.array())
            }
            try {
                const user = await User.findOne({
                    where: {
                        [Op.or]: [{email: req.body.email}, {phone_number: req.body.phone_number}]
                        
                    },
                })
    
                if(user){
                    return errorResponse(res, 400, 'Email / Nomor Telpon Sudah Digunakan', [])
                } else {

                    return res.status(200).json({message: "OK"})
                }
    
            } catch (error) {
                console.log(error)
    

            }
        },

    async register(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
          }
          
        req.body.is_verified = 0
        // should be unique, so must include on the req body
        // req.body.username = req.body.name //default username = name

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        req.body.password = hashedPassword

        delete req.body.password_confirmation 

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
                    user_id: user.id,
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

            let errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }

            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async logout(req, res, next) {  
        try {
            const clear = localStorage.clear();
            if(clear)
            // will return error because no localStorage detected

            return res.status(200).send({
                message: 'Logout Sukses!',
            })

        } catch (error) {
            return errorResponse(res, 400, 'No Local Storage Found!', [])
        }
    },

    async forgot(req, res, next) {
        const email = req.body.email
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
        }

        try {

            const user = await User.findOne({ where: { email: email, is_verified: 1 } })
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
            let errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
        
    },
}

export default AuthController
