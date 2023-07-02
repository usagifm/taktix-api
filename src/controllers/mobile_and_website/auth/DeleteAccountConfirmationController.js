import { errorResponse } from '../../../helpers/errorResponse'
import { User, DeleteAccountConfirmationToken } from '../../../db/models'
import { sendEmailDeleteAccount } from '../../../helpers/sendEmail'
import Randomstring from 'randomstring'
const Sequelize = require('sequelize');
const Op = Sequelize.Op
import { validationResult } from 'express-validator'


const DeleteAccountConfirmationController = {
    async requestDelete(req, res, next) {
       var user_id = req.user.user.id


      var user = await User.findOne({
        where: {
            id: user_id,
            is_verified: 1
        }})

        if(user){


            const NOW = new Date();
            var newDateObj = new Date(NOW.getTime() + 5 * 60000);
            DeleteAccountConfirmationToken.create({
                user_id: user.id,
                token: Randomstring.generate(6),
                valid_through: newDateObj,
                is_account_deleted: 0,
            })
                .then((result) => {
                    sendEmailDeleteAccount(
                        'Konfirmasi penghapusan akun ' + user.name,
                        result.token,
                        req.user.user.email
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

        }else{
            return errorResponse(res, 403, 'User tidak ditemukan', [])

        }


    },

    async confirmDelete(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, "Validation error", errors.array())
          }

        var user_id = req.user.user.id
        const NOW = new Date();
        DeleteAccountConfirmationToken.findOne({
            where: { 
                id: req.body.confirmation_id,
                user_id: user_id,
                valid_through:{
                    [Op.gt]: NOW,
                },
                token: req.body.token,
                is_account_deleted: 0,
            }
        
        }).then((foundToken) => {
                if (foundToken) {
                    return foundToken
                        .update({ is_account_deleted: true })
                        .then((updatedToken) => {

                           return User.update(
                                    {
                                        deleted_at: NOW,
                                        email: 'deleted_at.'+Date.now().toString()+"."+req.user.user.email,
                                        username: 'deleted_at.'+Date.now().toString()+"."+req.user.user.username,
                                        phone_number: 'deleted_at.'+Date.now().toString()+"."+req.user.user.phone_number
                                    },
                                    {
                                        where: {
                                            id: user_id,
                                            is_verified: 1,
                                        },
                                    }
                            ).then((deleted_user) => {

                                return res
                                .status(200)
                                .json({
                                    message: `Akun berhasil dihapus, Sampai jumpa lagi ${req.user.user.name}.`,
                                })

                            }).catch((reason) => {


                                return errorResponse(
                                    res,
                                    403,
                                    "Gagal menghapus akun",
                                    []
                                )
                            })
                     
                        })
                        .catch((reason) => {
                            return errorResponse(
                                res,
                                403,
                                "Token Expired",
                                []
                            )
                        })
                } else {
                    return errorResponse(
                        res,
                        403,
                        'Token Expired',
                        []
                    )
                }
            })
            .catch((reason) => {
                return errorResponse(res, 403, 'Token Expired', [])
            })

    },
}

export default DeleteAccountConfirmationController
