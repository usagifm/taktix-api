import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op
import { Class, SetMaster, Lks, TutorLks, LksSection, LksContent, User, ClassMember,LksExamQuestion, LksExamAttemptions,LksExamAttemptionsAnswers } from '../../../db/models'
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

    async unsetClassLks(req, res, next) {
        try {
            const kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                },
            })

            if (kelas) {
                await Class.update(
                {
                    lks_id: null
                },
                {
                    where: {
                        id: req.params.class_id,
                        creator_id: req.user.user.id
                    },
                })
                return res
                    .status(200)
                    .json({ message: 'LKS berhasil dihapus dari kelas' })
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

    async deleteClassMember(req, res, next) {
        try {
            const siswa = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.params.member_id
                },
            })

            if (siswa) {
                await ClassMember.destroy({
                    where: {
                        class_id: req.params.class_id,
                        user_id: req.params.member_id
                    },
                })
                return res
                    .status(200)
                    .json({ message: 'Siswa berhasil dihapus dari kelas' })
            } else {
                return res.status(400).json({ message: 'Siswa tidak ditemukan' })
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

            var kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                }
            })

                if (kelas) {

                    var section = await LksSection.findOne({
                        include: [{
                            model: LksContent, as: "contents", include: [{ model: SetMaster, as: "lks_content_type" }]
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

            var kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                }
            })

                if (kelas) {

                    var section = await LksSection.findOne({
                        include: [{
                            model: LksContent, as: "contents", include: [{ model: SetMaster, as: "lks_content_type" }]
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

            var kelas = await Class.findOne({
                where: {
                    id: req.params.class_id,
                    creator_id: req.user.user.id
                }
            })

                if (kelas) {

                    var content = await LksContent.findOne({
                       include: [{ model: SetMaster, as: "lks_content_type" },{
                        model: LksExamQuestion,
                        as: 'questions',
                        include: {
                            model: SetMaster,
                            as: 'question_type',
                        },
                    }]
                        ,
                        where: {
                            lks_section_id: req.params.section_id,
                            id: req.params.content_id
                        }
                    })

                    if (content.lks_content_type_id == 8003){

                        var studentAttempts = await LksExamAttemptions.findAll({
                           include: [{model: User, as: "student",attributes: ['id','name','email','photo_profile','phone_number']},
                           { model: LksExamAttemptionsAnswers, as: 'not_yet_corrected', attributes: [[Sequelize.fn('count', Sequelize.col('is_corrected')), 'count']],
                           group : ['LksExamAttemptionsAnswers.is_corrected'],
                           raw: true,  separate : true ,required: false ,where: {
                            is_corrected: false
                           }}],
                            where:{
                                class_id: req.params.class_id,
                                lks_content_exam_id: content.id,
                            }
                        })

                        content.setDataValue("student_attemptions", studentAttempts)

                    }

                    if (content) {
                        return res.status(200).send(content)
                    } else {
                        return errorResponse(res, 400, 'Kontent tidak ditemukan', [])
                    }

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


    async getLksExamAttemptionDetail(req, res, next) {
        try {

            const NOW = new Date();
            var examAttemption = await LksExamAttemptions.findOne({
                include: [
                    { model: LksExamAttemptionsAnswers, as: 'answers' },
                    { model: LksContent, as: 'lks_content', include: { model: LksExamQuestion, as: "questions" } }
                ],
                where:{
                    lks_content_exam_id: req.params.content_id,
                    class_id: req.params.class_id,
                    id: req.params.lks_attemption_id
                }
            })

            if(examAttemption){

                if (examAttemption.started_at <= NOW && examAttemption.finished_at >= NOW){
                    return errorResponse(res, 400,"Data pengerjaan tidak dapat di tampilkan saat pengerjaan sedang berlangsung", [])
                }

                return res.status(200).send(examAttemption)


            }else {
                return errorResponse(res, 400,"Data pengerjaan soal tidak ditemukan", [])
            }
            


        }catch (error) {
            console.log(error)
            let errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }


    },

    async correctedClassLksExamAnswer(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return errorResponse(res, 400, 'Validation error', errors.array())
        }

        try {

            const NOW = new Date();
            var examAttemption = await LksExamAttemptions.findOne({
                include: [
                    { model: LksExamAttemptionsAnswers, as: 'answers' },
                    { model: LksContent, as: 'lks_content', include: { model: LksExamQuestion, as: "questions" } }
                ],
                where:{
                    lks_content_exam_id: req.params.content_id,
                    class_id: req.params.class_id,
                    id: req.params.lks_attemption_id
                }
            })

            if(examAttemption){

                if (examAttemption.started_at <= NOW && examAttemption.finished_at >= NOW){
                    return errorResponse(res, 400,"Data pengerjaan tidak dapat di koreksi saat pengerjaan sedang berlangsung", [])
                }

                var checkAnswer = await LksExamAttemptionsAnswers.findOne(
                {
                    where: {
                        id: req.params.answer_id,
                        class_id: req.params.class_id,
                        lks_attemption_id: req.params.lks_attemption_id
                    },
                })

                if(!checkAnswer){
                    return errorResponse(res, 400,"Data penjawaban tidak ditemukan", [])
                }


                var correction = await LksExamAttemptionsAnswers.update({
                    is_correct: req.body.is_correct,
                    is_corrected: true
                },
                {
                    where: {
                        id: req.params.answer_id,
                        class_id: req.params.class_id,
                        lks_attemption_id: req.params.lks_attemption_id
                    },
                })

                return res.status(200).send({message: "Berhasil mengoreksi jawaban"})


            }else {
                return errorResponse(res, 400,"Data pengerjaan soal tidak ditemukan", [])
            }
            


        }catch (error) {
            console.log(error)
            let errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }


    },


    // async getClassLksContentDetail(req, res, next) {
    //     try {

    //         var is_enrolled = await ClassMember.findOne({
    //             where: {
    //                 class_id: req.params.class_id,
    //                 user_id: req.user.user.id
    //             }
    //         })

    //         if (is_enrolled) {

    //             const kelas = await Class.findOne({
    //                 where: {
    //                     id: req.params.class_id,
    //                 },
    //             })

    //             if (kelas) {

    //                 var content = await LksContent.findOne({
    //                     include: [{ model: SetMaster, as: "lks_content_type" }, {
    //                         model: LksExamQuestion,
    //                         as: 'questions',
    //                         include: {
    //                             model: SetMaster,
    //                             as: 'question_type',
    //                         },
    //                     }, {
    //                         model: ClassMarkContent, as: "mark", required: false, where: {
    //                             member_id: req.user.user.id
    //                         }
    //                     }],
    //                     where: {
    //                         id: req.params.content_id,
    //                         lks_section_id: req.params.section_id
    //                     }
    //                 })

    //                 if (content) {

    //                     if (content.lks_content_type_id == 8003) {
    //                         const NOW = new Date();

    //                         var activeAttemption = await LksExamAttemptions.findOne({
    //                             where: {
    //                                 user_id: req.user.user.id,
    //                                 lks_content_exam_id: content.id,
    //                                 started_at: {
    //                                     [Op.lt]: NOW,
    //                                 },
    //                                 finished_at: {
    //                                     [Op.gt]: NOW,
    //                                 }
    //                             }, attributes: { exclude: ['total_correct', 'total_incorrect', 'total_empty', 'score'] }

    //                         })

    //                         content.setDataValue('active_attemption', activeAttemption);

    //                         var finishedAttemption = await LksExamAttemptions.findAll({
    //                             where:{
    //                                 user_id: req.user.user.id,
    //                                 lks_content_exam_id: content.id,
    //                                 started_at:{
    //                                     [Op.lt]: NOW,
    //                                 },
    //                                 finished_at:{
    //                                     [Op.lt]: NOW,
    //                                 }
    //                             }
    //                         })
            
                
    //                         content.setDataValue('finished_attemption', finishedAttemption);
        
    //                     }

    //                     return res.status(200).send(content)
    //                 } else {
    //                     return errorResponse(res, 400, 'Konten tidak ditemukan', [])
    //                 }

    //             } else {
    //                 return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
    //             }
    //         } else {
    //             return errorResponse(res, 400, 'Kelas tidak temukan atau anda belum terdaftar dalam kelas', [])
    //         }

    //     } catch (error) {
    //         console.log(error)

    //         let errStacks = []

    //         if (error.errors) {
    //             errStacks = errorMapper(error.errors)
    //         }
    //         return errorResponse(res, 400, error.message, errStacks)
    //     }
    // },

}
export default TutorClassController