import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op

import { Class, SetMaster, Lks, LksSection, LksContent, ClassMember, User, ClassMarkContent,LksExamQuestion } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { body, validationResult } from 'express-validator'

const UserClassController = {

    async enrollToClass(req, res, next) {
        try {
            const kelas = await Class.findOne({
                where: {
                    enroll_code: req.body.enroll_code,
                },
            })

            var NOW = new Date()
            if (kelas) {

                if (kelas.member_total == kelas.limit) {
                    return res.status(400).json({ message: 'Kelas sudah penuh' })
                } else {

                    const is_enrolled = await ClassMember.findOne({
                        where: {
                            class_id: kelas.id,
                            user_id: req.user.user.id
                        }
                    })



                    if (is_enrolled) {
                        return res.status(400).json({ message: 'Sudah masuk ke dalam kelas' })
                    } else {
                        await ClassMember.create({
                            class_id: kelas.id,
                            user_id: req.user.user.id,
                            joined_at: NOW
                        }, { fields: ["class_id", "user_id", "joined_at"] }
                        )
                        return res
                            .status(200)
                            .json({ message: 'Berhasil masuk dalam kelas' })
                    }

                }

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

    async enrolledClass(req, res, next) {
        try {
            const user = await User.findOne({
                include: [{ model: Class, as: "user_classes" }],
                where: {
                    id: req.user.user.id
                },
            })

            return res
                .status(200)
                .json(user.user_classes)
            // if (kelas) {

            // } else {
            //     return res.status(400).json({ message: 'Kelas tidak ditemukan' })
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

    async getClassById(req, res, next) {
        try {

            var is_enrolled = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if (is_enrolled) {

                const kelas = await Class.findOne({
                    include: [
                        { model: SetMaster, as: 'grade' },
                        { model: SetMaster, as: 'subject' },
                        { model: User, as: "tutor", attributes: ['id', 'name', 'email', 'photo_profile'] },
                        // { model: Lks, as: 'lks', include: { model: LksSection, as: "sections", include: { model: LksContent, as: "contents" } } },
                        { model: Lks, as: 'lks', include: { model: LksSection, as: "sections" } },
                        { model: User, as: "class_members", attributes: ['id', 'name', 'email', 'photo_profile'], include: [{ model: SetMaster, as: "gender_type" }] }
                    ],
                    where: {
                        id: req.params.class_id,
                    },
                })

                if (kelas) {

                    var marks = await ClassMarkContent.findAll({
                        where: {
                            class_id: req.params.class_id,
                            member_id: req.user.user.id
                        }
                    })

                    kelas.setDataValue('marks', marks);

                    return res.status(200).send(kelas)
                } else {
                    return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
                }
            } else {
                return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
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

    async unenrollFromClass(req, res, next) {
        try {

            var is_enrolled = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if (is_enrolled) {

                const unenroll = await ClassMember.destroy({
                    where: {
                        class_id: req.params.class_id,
                        user_id: req.user.user.id
                    }
                })

                return res.status(200).send({ message: "Berhasil keluar dari kelas" })

            } else {
                return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
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




    async getClassLksSectionDetail(req, res, next) {
        try {

            var is_enrolled = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if (is_enrolled) {

                const kelas = await Class.findOne({
                    where: {
                        id: req.params.class_id,
                    },
                })

                if (kelas) {

                    var section = await LksSection.findOne({
                        include: [{
                            model: LksContent, as: "contents", include: [{ model: SetMaster, as: "lks_content_type" }, {
                                model: ClassMarkContent, as: "mark", required: false, where: {
                                    member_id: req.user.user.id
                                }
                            }]
                        }],
                        where: {
                            id: req.params.section_id,
                            lks_id: kelas.lks_id
                        }
                    })

                    if (section) {
                        return res.status(200).send(section)
                    } else {
                        return errorResponse(res, 400, 'Bab tidak ditemukan', [])
                    }

                } else {
                    return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
                }
            } else {
                return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
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

    async getClassLksContentDetail(req, res, next) {
        try {

            var is_enrolled = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if (is_enrolled) {

                const kelas = await Class.findOne({
                    where: {
                        id: req.params.class_id,
                    },
                })

                if (kelas) {

                    var content = await LksContent.findOne({
                        include: [{ model: SetMaster, as: "lks_content_type" }, {
                            model: LksExamQuestion,
                            as: 'questions',
                            include: {
                                model: SetMaster,
                                as: 'question_type',
                            },
                        }, {
                            model: ClassMarkContent, as: "mark", required: false, where: {
                                member_id: req.user.user.id
                            }
                        }],
                        where: {
                            id: req.params.content_id,
                            lks_section_id: req.params.section_id
                        }
                    })

                    if (content) {
                        return res.status(200).send(content)
                    } else {
                        return errorResponse(res, 400, 'Konten tidak ditemukan', [])
                    }

                } else {
                    return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
                }
            } else {
                return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
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

    async markClassLksContent(req, res, next) {
        try {

            var is_enrolled = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if (is_enrolled) {

                const kelas = await Class.findOne({
                    where: {
                        id: req.params.class_id,
                    },
                })

                if (kelas) {

                    var content = await LksContent.findOne({
                        // include: [{model: LksContent, as: "contents"}],
                        where: {
                            id: req.params.content_id,
                            lks_section_id: req.params.section_id
                        }
                    })

                    if (content) {

                        let mark = await ClassMarkContent.findOrCreate({
                            where: {
                                member_id: req.user.user.id,
                                class_id: req.params.class_id,
                                lks_content_id: req.params.content_id
                            }
                            , defaults: {
                                member_id: req.user.user.id,
                                class_id: req.params.class_id,
                                lks_content_id: req.params.content_id
                            }
                        }
                        )

                        return res.status(200).send({ message: "Kontent berhasil ditandai" })
                    } else {
                        return errorResponse(res, 400, 'Konten tidak ditemukan', [])
                    }

                } else {
                    return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
                }
            } else {
                return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
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
export default UserClassController