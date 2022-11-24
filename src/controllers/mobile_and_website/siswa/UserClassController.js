import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op

import { Class, SetMaster, Lks, LksSection, LksContent, ClassMember, User, ClassMarkContent, LksExamQuestion, LksExamAttemptions,LksExamAttemptionsAnswers, } from '../../../db/models'
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

                        if (content.lks_content_type_id == 8003) {
                            const NOW = new Date();

                            var activeAttemption = await LksExamAttemptions.findOne({
                                where: {
                                    user_id: req.user.user.id,
                                    lks_content_exam_id: content.id,
                                    started_at: {
                                        [Op.lt]: NOW,
                                    },
                                    finished_at: {
                                        [Op.gt]: NOW,
                                    }
                                }, attributes: { exclude: ['total_correct', 'total_incorrect', 'total_empty', 'score'] }

                            })

                            content.setDataValue('active_attemption', activeAttemption);

                            var finishedAttemption = await LksExamAttemptions.findOne({
                                where:{
                                    user_id: req.user.user.id,
                                    lks_content_exam_id: content.id,
                                    started_at:{
                                        [Op.lt]: NOW,
                                    },
                                    finished_at:{
                                        [Op.lt]: NOW,
                                    }
                                }
                            })
            
                
                            content.setDataValue('finished_attemption', finishedAttemption);
        
                        }

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

    async startClassLksContentExam(req, res, next) {
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
                        where: {
                            id: req.params.content_id,
                            lks_section_id: req.params.section_id
                        }
                    })

                    if (content) {

                        if (content.lks_content_type_id == 8003) {

                            const NOW = new Date();

                            var finishedAttemption = await LksExamAttemptions.findOne({
                                where:{
                                    lks_content_exam_id: content.id,
                                    user_id: req.user.user.id,
                                    class_id: kelas.id,
                                    started_at:{
                                        [Op.lt]: NOW,
                                    },
                                    finished_at:{
                                        [Op.lt]: NOW,
                                    }
                                }
                            })
        
                            if(finishedAttemption){
                                return errorResponse(res, 400, 'Soal sudah pernah dikerjakan', [])
                            }




                            var examAttemption = await LksExamAttemptions.findOne({
                                include: [
                                    { model: LksExamAttemptionsAnswers, as: 'answers', attributes: { exclude: ['is_correct', 'is_corrected'] } },
                                    { model: LksContent, as: 'lks_content', include: { model: LksExamQuestion, as: "questions", attributes: { exclude: ['answer'] } } },
                                ],
                                where: {
                                    lks_content_exam_id: content.id,
                                    user_id: req.user.user.id,
                                    class_id: kelas.id,
                                    started_at: {
                                        [Op.lt]: NOW,
                                    },
                                    finished_at: {
                                        [Op.gt]: NOW,
                                    }
                                },attributes:{exclude: ['total_correct','total_incorrect','total_empty','score']}
                            })

                            if (examAttemption) {

                                return res.status(200).send(examAttemption)

                            } else {

                                var newDateObj = new Date(NOW.getTime() + content.exam_duration * 60000);
                                var newExamAttemption = await LksExamAttemptions.create(
                                    {
                                        user_id: req.user.user.id,
                                        lks_content_exam_id: content.id,
                                        class_id: kelas.id,
                                        started_at: NOW,
                                        finished_at: newDateObj,
                                        score: 0
                                    }, { fields: ["user_id", "lks_content_exam_id", "class_id","started_at","finished_at","score"] }
                                )

                                console.log("Cp 1 : Oke")

                                var createdExamAttemption = await LksExamAttemptions.findOne({
                                    include: [
                                        { model: LksExamAttemptionsAnswers, as: 'answers', attributes: { exclude: ['is_correct', 'is_corrected'] } },
                                        { model: LksContent, as: 'lks_content', include: { model: LksExamQuestion, as: "questions", attributes: { exclude: ['answer'] } } }
                                    ],
                                    where: {
                                        id: newExamAttemption.id,
                                        user_id: req.user.user.id
                                    },attributes:{exclude: ['total_correct','total_incorrect','total_empty','score']}
                                })

                                return res.status(200).send(createdExamAttemption)
                            }
                        }else {
                            return errorResponse(res, 400, 'Konten bukan merupakan tipe soal', [])
                        }
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

    async insertAnswerLksExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var content = await LksContent.findByPk(req.params.content_id)

            if(!content){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var classMember = await ClassMember.findOne({
           
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if(!classMember){
                return errorResponse(res, 400, "Anda belum masuk ke dalam kelas untuk mengerjakan soal", [])
            }
        

            var examAttemption = await LksExamAttemptions.findOne({
                where: {
                    lks_content_exam_id: content.id,
                    user_id: req.user.user.id,
                    class_id: req.params.class_id,
                    started_at: {
                        [Op.lt]: NOW,
                    },
                    finished_at: {
                        [Op.gt]: NOW,
                    }
                }
            })
 
       if(examAttemption){

        var isAnswered = await LksExamAttemptionsAnswers.findOne({
            where:{
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id
            }
        })

        if(isAnswered){
            return errorResponse(res, 400, "Pertanyaan sudah pernah dijawab", [])
        }

        var examQuestion = await LksExamQuestion.findOne({
            where: {
                id: req.body.question_id,
                lks_content_id: content.id
            }
        })

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isCorrect = 0
        var isCorrected = 0

        if (examQuestion.question_type_id == 6001){

            if(req.body.answer == examQuestion.answer){
                isCorrect = 1
            }

            isCorrected = 1
  
            var questionAnswer = await LksExamAttemptionsAnswers.create({
                class_id: req.params.class_id,
                answer: req.body.answer,
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: examQuestion.id,
                user_id: req.user.user.id,
                is_correct: isCorrect,
                is_corrected: isCorrected,

            })
        }else {

            var attributes = { 
                class_id: 2,
                answer: req.body.answer,
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: examQuestion.id,
                user_id: req.user.user.id,
                is_correct: isCorrect,
                is_corrected: isCorrected
            }

            if(req.body.image_answer != undefined){
                attributes.image_answer = req.body.image_answer
                attributes.answer = "Dijawab dengan gambar"
            }


            var questionAnswer = await LksExamAttemptionsAnswers.create(
                attributes
            )
            
        }

                delete questionAnswer.dataValues.is_correct
                delete questionAnswer.dataValues.is_corrected
                
                return res.status(200).send({message: "Pertanyaan berhasil dijawab", data: questionAnswer})
     
        
       }else {

        return errorResponse(res, 400, "Attemption sudah tidak aktif atau tidak ditemukan", [])

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

    async updateAnswerLksExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var content = await LksContent.findByPk(req.params.content_id)

            if(!content){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var classMember = await ClassMember.findOne({
           
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if(!classMember){
                return errorResponse(res, 400, "Anda belum masuk ke dalam kelas untuk mengerjakan soal", [])
            }
        

            var examAttemption = await LksExamAttemptions.findOne({
                where: {
                    lks_content_exam_id: content.id,
                    user_id: req.user.user.id,
                    class_id: req.params.class_id,
                    started_at: {
                        [Op.lt]: NOW,
                    },
                    finished_at: {
                        [Op.gt]: NOW,
                    }
                }
            })
 
       if(examAttemption){

        var isAnswered = await LksExamAttemptionsAnswers.findOne({
            where:{
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id,
                id: req.body.answer_id
            }
        })

        if(!isAnswered){
            return errorResponse(res, 400, "Pertanyaan belum pernah dijawab / jawaban pertanyaan tidak ditemukan", [])
        }

        var examQuestion = await LksExamQuestion.findOne({
            where: {
                id: req.body.question_id,
                lks_content_id: content.id
            }
        })

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isCorrect = 0
        var isCorrected = 0

        if (examQuestion.question_type_id == 6001){

            if(req.body.answer == examQuestion.answer){
                isCorrect = 1
            }

            isCorrected = 1
  
            var questionAnswer = await LksExamAttemptionsAnswers.update({
                answer: req.body.answer,
                is_correct: isCorrect,
                is_corrected: isCorrected,

            },{
                where: {
                    id: isAnswered.id,
                    lks_attemption_id: isAnswered.lks_attemption_id,
                    question_id: req.body.question_id,
                    user_id: req.user.user.id
                },
            })

            return res.status(200).send({message: "Jawaban berhasil di update"})
        }else {

            var attributes = { 
                answer: req.body.answer,
                is_correct: isCorrect,
                is_corrected: isCorrected
            }

            if(req.body.image_answer != null || req.body.image_answer != "" || req.body.image_answer != undefined){

                attributes.image_answer = req.body.image_answer
                attributes.answer = "Dijawab dengan gambar"
            }

            var questionAnswer = await LksExamAttemptionsAnswers.update({
                answer: req.body.answer,
                is_correct: isCorrect,
                is_corrected: isCorrected,

            },{
                where: {
                    id: isAnswered.id,
                    lks_attemption_id: isAnswered.lks_attemption_id,
                    question_id: req.body.question_id,
                    user_id: req.user.user.id
                },
            })
            return res.status(200).send({message: "Jawaban berhasil di update"})
        }
        
       }else {

        return errorResponse(res, 400, "Attemption sudah tidak aktif atau tidak ditemukan", [])

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

    async deleteAnswerLksExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var content = await LksContent.findByPk(req.params.content_id)

            if(!content){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var classMember = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if(!classMember){
                return errorResponse(res, 400, "Anda belum masuk ke dalam kelas untuk mengerjakan soal", [])
            }
        

            var examAttemption = await LksExamAttemptions.findOne({
                where: {
                    lks_content_exam_id: content.id,
                    user_id: req.user.user.id,
                    class_id: req.params.class_id,
                    started_at: {
                        [Op.lt]: NOW,
                    },
                    finished_at: {
                        [Op.gt]: NOW,
                    }
                }
            })
 
       if(examAttemption){

        var isAnswered = await LksExamAttemptionsAnswers.findOne({
            where:{
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id,
                id: req.body.answer_id
            }
        })

        if(!isAnswered){
            return errorResponse(res, 400, "Pertanyaan belum pernah dijawab / jawaban pertanyaan tidak ditemukan", [])
        }

             
        var deleteAnswer = await LksExamAttemptionsAnswers.destroy({
            where:{
                lks_attemption_id: req.body.lks_attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id,
                id: req.body.answer_id
            }
        })

        return res.status(200).send({message: "Jawaban berhasil di hapus"})
        
       }else {

        return errorResponse(res, 400, "Attemption sudah tidak aktif atau tidak ditemukan", [])

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

    async finishAnswerLksExam(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var content = await LksContent.findByPk(req.params.content_id)

            if(!content){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var classMember = await ClassMember.findOne({
                where: {
                    class_id: req.params.class_id,
                    user_id: req.user.user.id
                }
            })

            if(!classMember){
                return errorResponse(res, 400, "Anda belum masuk ke dalam kelas untuk mengerjakan soal", [])
            }
        

            var examAttemption = await LksExamAttemptions.findOne({
                where: {
                    lks_content_exam_id: content.id,
                    user_id: req.user.user.id,
                    class_id: req.params.class_id,
                    started_at: {
                        [Op.lt]: NOW,
                    },
                    finished_at: {
                        [Op.gt]: NOW,
                    }
                }
            })
 
       if(examAttemption){

  
        var updatedExamAttemptions = await LksExamAttemptions.update(
            {
                finished_at: NOW,
            },
            {   where: {
                    id: examAttemption.id,
                    user_id: req.user.user.id,
                    lks_content_exam_id: content.id,
                },
            }
        )

            return res.status(200).send({message: "Pengerjaan Soal telah diselesaikan"})
        
       }else {

        return errorResponse(res, 400, "Tidak ada pengerjaan soal yang sedang aktif", [])

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
                    user_id: req.user.user.id,
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

}
export default UserClassController