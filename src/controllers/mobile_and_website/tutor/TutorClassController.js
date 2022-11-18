import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op

import { Class, SetMaster, Lks, TutorLks, LksSection,LksContent,User } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { body, validationResult } from 'express-validator'

const TutorClassController = {

    async createClass(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }
        req.body.creator_id = req.user.user.id

        var code_gen = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)

        req.body.enroll_code = code_gen(5)


        var kelas = await Class.findOne({
            where: {
                enroll_code: req.body.enroll_code,
            },
        })

        if (kelas) {
            req.body.enroll_code = code_gen(5)
            kelas = await Class.findOne({
                where: {
                    enroll_code: req.body.enroll_code,
                },
            })
        }


        try {
            const newKelas = await Class.create(req.body)
            return res.status(200).json({ message: 'Kelas berhasil dibuat', data: newKelas })
        } catch (error) {
            console.log(error)
            let errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },


    async editClass(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }
        try {

            var kelas = Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                }
            })

            if (kelas) {

                await Class.update(req.body, {
                    where: {
                        id: req.params.class_id,
                        creator_id: req.user.user.id
                    },
                })
                return res.status(200).json({ message: 'Kelas berhasil diubah' })

            } else {

                return errorResponse(res, 400, "Kelas tidak di temukan", [])
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


    async deleteClass(req, res, next) {
        try {
            const kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                },
            })

            if (kelas) {
                await Class.destroy({
                    where: {
                        id: req.params.class_id,
                        creator_id: req.user.user.id
                    },
                })
                return res
                    .status(200)
                    .json({ message: 'Kelas berhasil dihapus' })
            } else {
                return res.status(400).json({ message: 'Kelas tidak ditemukan' })
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

    async getClassById(req, res, next) {
        try {
            const kelas = await Class.findOne({
                include: [
                    { model: SetMaster, as: 'grade' },
                    { model: SetMaster, as: 'subject' },
                    { model: Lks, as: 'lks', include: {model: LksSection, as: "sections", include: {model: LksContent, as: "contents"}}},
                    { model: User, as: "class_members", attributes: ['id','name','email','photo_profile','phone_number'] , include:[{model: SetMaster, as: "gender_type"}]}
                ],
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                },
            })

            if (kelas) {
                return res.status(200).send(kelas)
            } else {
                return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
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


    async getClasses(req, res, next) {
        try {

            const where = {};
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const { subject_id, class_name, grade_id } = req.query;
            where.creator_id = req.user.user.id
            if (subject_id) where.subject_id = { [Op.eq]: subject_id }
            if (grade_id) where.grade_id = { [Op.eq]: grade_id }
            if (class_name) where.class_name = { [Op.like]: `%${class_name}%` }
            const offset = 0 + (req.query.page - 1) * per_page
            const { count, rows } = await Class.findAndCountAll({
                include: [
                    { model: SetMaster, as: 'grade' },
                    { model: SetMaster, as: 'subject' },
                    { model: Lks, as: 'lks' },
                ],
                where,
                offset: offset,
                limit: per_page,


            });
            console.log(pagination)
            const result = pagination({
                data: rows,
                count,
                page,
                per_page
            });


            return res.status(200).send(result)

        } catch (error) {
            console.log(error)
            let errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },


    async setLksToClass(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }
        try {

            const kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                },
            })

            if (kelas) {
                     if (kelas.lks_id == null) {

                    const is_owned = await TutorLks.findOne({
                        where: {
                            lk_id: req.params.lks_id,
                            tutor_id: req.user.user.id
                        }
                    })

                    if (is_owned) {


                        await Class.update({ lks_id: req.params.lks_id }, {
                            where: {
                                id: req.params.class_id,
                                creator_id: req.user.user.id
                            },
                        })

                        return res.status(200).json({ message: 'LKS berhasil ditambahkan pada kelas' })

                    } else {
                        return errorResponse(res, 400, "Anda belum membeli LKS", [])
                    }

                } else if (kelas.lks_id != null) {
                    return errorResponse(res, 400, "Kelas sudah mempunyai LKS", [])
                }
            } else {
                return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
            }

            // var kelas = Class.findOne({
            //     where: {
            //         id: req.params.class_id,
            //         creator_id: req.user.user.id
            //     }
            // })

            // if (!kelas) {

            //     return errorResponse(res, 400, "Kelas tidak di temukan", [])
    

            // } else {

            //     if (kelas.lks_id == null) {

            //         const is_owned = await TutorLks.findOne({
            //             where: {
            //                 lk_id: req.params.lks_id,
            //                 tutor_id: req.user.user.id
            //             }
            //         })

            //         if (is_owned) {


            //             await Class.update({ lks_id: req.params.lks_id }, {
            //                 where: {
            //                     id: req.params.class_id,
            //                     creator_id: req.user.user.id
            //                 },
            //             })

            //             return res.status(200).json({ message: 'LKS berhasil ditambahkan pada kelas' })

            //         } else {
            //             return errorResponse(res, 400, "Anda belum membeli LKS", [])
            //         }

            //     } else if (kelas.lks_id != null | kelas.lks_id != NULL  ) {
            //         return errorResponse(res, 400, "Kelas sudah mempunyai LKS", [])
            //     }

            // }
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
export default TutorClassController