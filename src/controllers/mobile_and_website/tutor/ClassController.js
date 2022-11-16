import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize')
const Op = Sequelize.Op
import { User, Class, SetMaster } from '../../../db/models'
import { pagination } from '../../../helpers/pagination'
import { body, validationResult } from 'express-validator'
import Randomstring from 'randomstring'

const ClassController = {
    async createClass(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }

        req.body.creator_id = req.user.user.id
        req.body.enroll_code = Randomstring.generate(6)

        try {
            await Class.create(req.body)
            return res.status(200).json({ message: 'Kelas Berhasil Dibuat' })
        } catch (error) {
            console.log(error)
            let errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async getClass(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }
        try {
            // // Get Decoded ID
            var user_id = req.user.user.id

            const classes = await Class.findAll({
                //  include: [
                //      { model: SetMaster, as: 'role', attributes: ['id','category','name']},
                //      { model: Province, as: 'province', attributes: ['id','name']}
                //  ],
                where: {
                    creator_id: user_id,
                },
            })

            if (classes) {
                return res.status(200).send(classes)
            } else {
                return errorResponse(res, 400, 'Kelas Tidak Ditemukan', [])
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

export default ClassController
