import { errorResponse } from '../../../helpers/errorResponse'
import { User, VerificationToken } from '../../../db/models'

const VerificationController = {
    async verifyUser(req, res, next) {


        if(!req.query.verificationToken || !req.query.email){
            return errorResponse(res, 400, 'Oops, data tidak valid.', [])
        }

        User.findOne({
            where: { email: req.query.email },
        })
            .then((user) => {
                if (user.is_verified) {
                    return res
                        .status(202)
                        .json({ message: 'Email kamu sudah terverifikasi.' })
                } else {
                    return VerificationToken.findOne({
                        where: { 
                            user_id: user.id,
                            token: req.query.verificationToken 
                         },
                    })
                        .then((foundToken) => {
                            if (foundToken) {
                                return user
                                    .update({ is_verified: true })
                                    .then((updatedUser) => {

                                        VerificationToken.destroy({
                                            where: {
                                                user_id: user.id,
                                                token: req.query.verificationToken
                                            }
                                        })
                                        return res
                                            .status(202)
                                            .json({
                                                message: `Horee ${user.email}, akun kamu sudah terverifikasi, silahkan login di aplikasi yaa.`,
                                            })
                                    })
                                    .catch((reason) => {
                                        return errorResponse(
                                            res,
                                            403,
                                            'Verifikasi Gagal',
                                            []
                                        )
                                    })
                            } else {
                                return errorResponse(
                                    res,
                                    403,
                                    'Token sudah expired.',
                                    []
                                )
                            }
                        })
                        .catch((reason) => {
                            return errorResponse(res, 403, 'Token sudah expired.', [])
                        })
                }
            })
            .catch((reason) => {
                return errorResponse(res, 404, 'Akun tidak ditemukan.', [])
            })
    },
}

export default VerificationController
