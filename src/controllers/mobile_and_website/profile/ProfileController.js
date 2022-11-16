import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
import { User,SetMaster,Province } from '../../../db/models'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
const saltRounds = 10

const ProfileController = {
    async getProfile(req, res, next) {
        try {
            // // Get Decoded ID
            var user_id = req.user.user.id

            const user = await User.findOne({
                include: [
                    { model: SetMaster, as: 'role', attributes: ['id','category','name']},
                    { model: Province, as: 'province', attributes: ['id','name']}
                ],
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
            let errStacks = []
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
            // // Get Decoded ID
            var user_id = req.user.user.id

            if (req.body.photo_profile == null || req.body.photo_profile == '') {
                delete req.body.photo_profile
            }

            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            })

            if (user) {
                await User.update(
                    req.body,
                    {
                        where: {
                            id: user_id,
                        },
                    }
                )
                return res.status(200).json({ message: 'Profile Berhasil Diubah' })
            } else {
                return errorResponse(res, 400, 'User Tidak Ditemukan', [])
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

    async editPassword(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }

        try {
            // // Get Decoded ID
            var user_id = req.user.user.id

            const user = await User.findOne({
                where: {
                    id: user_id,
                },
            })

            if (user) {

                if (bcrypt.compareSync(req.body.old_password, user.password)) {
                    const hashedPassword = await bcrypt.hash(
                        req.body.new_password,
                        saltRounds
                    )
                    req.body.new_password = hashedPassword
                    delete req.body.password_confirmation
                    delete req.body.old_password

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
                        .json({ message: 'Password Berhasil Diubah' })

                } else {
                    return errorResponse(res, 400, 'Password Lama Salah', [])
                }


            } else {
                return errorResponse(res, 400, 'User Tidak Ditemukan', [])
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

export default ProfileController
