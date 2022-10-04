import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
import { User } from '../../../db/models'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt_decode from 'jwt-decode'
const saltRounds = 10

const ProfileController = {
    async getProfile(req, res, next) {
        try {
            // Get Token and Decode
            var token = req.headers.token
            var decoded = jwt_decode(token)
            // // Get Decoded ID
            var user_id = decoded.user.id

            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            })

            if (user) {
                return res.status(200).send(user)
            } else {
                return errorResponse(res, 400, 'User Tidak Ditemukan', [])
            }
        } catch (error) {
            console.log(error)
            const errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async editProfile(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }
        try {
            // Get Token and Decode
            var token = req.headers.token
            var decoded = jwt_decode(token)
            // // Get Decoded ID
            var user_id = decoded.user.id

            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            })

            if (user) {
                await User.update(
                    {
                        name: req.body.name,
                        username: req.body.username,
                        email: req.body.email,
                        birth_date: req.body.birth_date,
                        phone_number: req.body.phone_number,
                        gender: req.body.gender,
                    },
                    {
                        where: {
                            id: user_id,
                        },
                    }
                )
                return res.status(200).json({ msg: 'Profile Berhasil Diubah' })
            } else {
                return errorResponse(res, 400, 'User Tidak Ditemukan', [])
            }
        } catch (error) {
            console.log(error)

            const errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async editPassword(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }

        try {
            // Get Token and Decode
            var token = req.headers.token
            var decoded = jwt_decode(token)
            // // Get Decoded ID
            var user_id = decoded.user.id

            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            })

            const hashedPassword = await bcrypt.hash(
                req.body.new_password,
                saltRounds
            )
            req.body.new_password = hashedPassword

            if (user) {
                delete req.body.password_confirmation
                await User.update(
                    {
                        password: req.body.new_password,
                    },
                    {
                        where: {
                            id: user_id,
                        },
                    }
                )
                return res
                    .status(200)
                    .json({ msg: 'Password Berhasil Diubah' })
            } else {
                return errorResponse(res, 400, 'User Tidak Ditemukan', [])
            }
        } catch (error) {
            console.log(error)

            const errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },
}

export default ProfileController
