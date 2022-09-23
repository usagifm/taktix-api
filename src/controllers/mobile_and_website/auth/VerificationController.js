import { errorResponse } from '../../../helpers/errorResponse'
import { User, VerificationToken } from '../../../db/models'

const VerificationController = {
    async verifyUser(req, res, next) {
        User.findOne({
            where: { email: req.query.email },
        })
            .then((user) => {
                if (user.isVerified) {
                    return res
                        .status(202)
                        .json({ message: 'Email Already Verified' })
                } else {
                    return VerificationToken.findOne({
                        where: { token: req.query.verificationToken, userId: user.id },
                    })
                        .then((foundToken) => {
                            if (foundToken) {
                                return user
                                    .update({ isVerified: true })
                                    .then((updatedUser) => {
                                        return res
                                            .status(202)
                                            .json({
                                                message: `User with ${user.email} has been verified`,
                                            })
                                    })
                                    .catch((reason) => {
                                        return errorResponse(
                                            res,
                                            403,
                                            'Verification failed',
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
                }
            })
            .catch((reason) => {
                return errorResponse(res, 404, 'Email not found', [])
            })
    },
}

export default VerificationController
