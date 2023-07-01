import { errorResponse } from '../../../helpers/errorResponse'
import { User, DeleteAccountConfirmationToken } from '../../../db/models'
import { sendEmailDeleteAccount } from '../../../helpers/sendEmail'

const DeleteAccountConfirmationController = {
    async requestDelete(req, res, next) {
        var user_id = req.user.user.id
        User.findOne({
            where: {
                id: user_id,
                is_verified: 1,
            },
        }).then((user) => {


            const NOW = new Date();
            var newDateObj = new Date(NOW.getTime() + 10 * 60000);
            DeleteAccountConfirmationToken.create({
                user_id: user.id,
                token: Randomstring.generate(6),
                valid_through: newDateObj,
            })
                .then((result) => {
                    sendEmailDeleteAccount(
                        'Konfirmasi penghapusan akun ' + user.name,
                        result.token,
                        req.body.email
                    )
                    return res.status(200).send({
                        data: { confirmation_id: result.id },
                        message:
                            'Token konfirmasi penghapusan telah terkirim, periksa folder inbox dan spam email anda',
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

        })
            .catch((error) => {
                return errorResponse(res, 404, 'User not found', [])
            })

    },

    // async confirmtDelete(req, res, next) {
    //     var user_id = req.user.user.id
    //     DeleteAccountConfirmationToken.findOne({
    //         where: { user_id: user.id },
    //     })
    //         .then((foundToken) => {
    //             if (foundToken) {
    //                 return user
    //                     .update({ is_verified: true })
    //                     .then((updatedUser) => {
    //                         return res
    //                             .status(202)
    //                             .json({
    //                                 message: `User with ${user.email} has been verified`,
    //                             })
    //                     })
    //                     .catch((reason) => {
    //                         return errorResponse(
    //                             res,
    //                             403,
    //                             'Verification failed',
    //                             []
    //                         )
    //                     })
    //             } else {
    //                 return errorResponse(
    //                     res,
    //                     403,
    //                     'Token Expired',
    //                     []
    //                 )
    //             }
    //         })
    //         .catch((reason) => {
    //             return errorResponse(res, 403, 'Token Expired', [])
    //         })

    // },
}

export default DeleteAccountConfirmationController
