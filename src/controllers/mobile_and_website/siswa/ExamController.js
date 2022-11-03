import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
const Op = Sequelize.Op

import { User,Exam,ExamEnrollments,ExamQuestions,ExamAttemptions,ExamAttemptionsAnswers,ExamRatings,SetMaster } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { body, validationResult } from 'express-validator'

const ExamController = {
    async getExams(req, res, next) {
        try {

            const where = {};
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const {exam_category_id, title,category_id} = req.query;
            if (exam_category_id) where.exam_category_id = { [Op.eq]: exam_category_id}
            if (category_id) where.category_id = { [Op.eq]: category_id}
            if (title) where.title = { [Op.like]: `%${title}%`}
            const offset = 0 + (req.query.page - 1) * per_page
            const { count, rows } = await Exam.findAndCountAll({
                include: [
                    { model: SetMaster, as: 'exam_category'},
                    { model: SetMaster, as: 'category' },
                ],
                // include: [{model: User}],
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
    async getExamDetail(req, res, next) {
        try {

            const NOW = new Date();

            const exam = await Exam.findOne({
                where: {
                    id: req.params.exam_id,
                },
                include: [
          
                      { model: SetMaster, as: 'exam_category'},
                      { model: SetMaster, as: 'category'},
                ]
            })


            if (exam) {

                var ratings = await ExamRatings.findAll({
                    include: [
          
                        { model: User, as: 'user',attributes:['name','photo_profile','gender']},
                  ],
                    where: {
                        exam_id: req.params.exam_id
                    },
                    limit: 5
                })

                exam.setDataValue('ratings', ratings);

                const examEnrollment = await ExamEnrollments.findOne({
                    where: {
                        user_id: req.user.user.id,
                        exam_id: req.params.exam_id
                    }
                })
                
                if(examEnrollment){

                    exam.setDataValue('is_enrolled', true);
                
    
                    var activeAttemption = await ExamAttemptions.findOne({
                        where:{
                            user_id: req.user.user.id,
                            exam_id: exam.id,
                            started_at:{
                                [Op.lt]: NOW,
                            },
                            finished_at:{
                                [Op.gt]: NOW,
                            }
                        },attributes:{exclude: ['total_correct','total_inccorect','total_empty','score']}
                        
                    })

                    exam.setDataValue('active_attemption', activeAttemption);
                    
                    var finishedAttemption = await ExamAttemptions.findAll({
                        where:{
                            user_id: req.user.user.id,
                            exam_id: exam.id,
                            started_at:{
                                [Op.lt]: NOW,
                            },
                            finished_at:{
                                [Op.lt]: NOW,
                            }
                        }
                    })
    
           

                    
                    exam.setDataValue('finished_attemption', finishedAttemption);

                    var userRating = await ExamRatings.findOne({
                        where: {
                            user_id: req.user.user.id,
                            exam_id: req.params.exam_id
                        }
                    })

                    exam.setDataValue('user_rating', userRating);
                    
                }else {
                    exam.setDataValue('is_enrolled', false);
                
                }
                
                return res.status(200).send(exam)
            } else {
                return errorResponse(res, 404, 'Soal Tidak Ditemukan', [])
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

    async assignExam(req, res, next) {
        try {

            const exam = await Exam.findOne({
                where: {
                    id: req.params.exam_id
                }
            })


            if (!exam) {
                return errorResponse(res, 404, 'Soal tidak ditemukan', [])
            }

            const examEnrollment = await ExamEnrollments.findOne({
                where: {
                    user_id: req.user.user.id,
                    exam_id: req.params.exam_id
                }
            })


            if (examEnrollment) {
                return errorResponse(res, 400, 'Sudah membeli soal', [])
            }else{

             const enroll = await ExamEnrollments.create(
                {
                    user_id: req.user.user.id,
                    exam_id: req.params.exam_id
                }, { fields: ["user_id", "exam_id"] }
            )

                return res.status(200).send({message:"Berhasil membeli soal"})  

            }

            // const [exam, created] = await ExamEnrollments.findOrCreate({
            //     where: {
            //         user_id: req.user.user.id,
            //         exam_id: req.params.exam_id
            //     },
            // })

            // if (!created) {
            //     return errorResponse(res, 400, 'Sudah membeli soal', [])
            // }else {

            //     return res.status(200).send({message:"Berhasil membeli soal"})                
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

    async getUserExamsPagination(req, res, next) {
        try {

            const userExam = await ExamEnrollments.findAll({
                where: {
                    user_id: req.user.user.id
                }
            })

        

            const where = {};
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const offset = 0 + (req.query.page - 1) * per_page
            const {exam_category_id, title,category_id} = req.query;
            if (exam_category_id) where.exam_category_id = { [Op.eq]: exam_category_id}
            if (category_id) where.category_id = { [Op.eq]: category_id}
            if (title) where.title = { [Op.like]: `%${title}%`}
          

            if (userExam.length > 0 ){

                var examId = userExam.map(function(item) {
                    return item['exam_id'];
                });

                where.id = examId
                var { count, rows } = await Exam.findAndCountAll({
                    include: [
                            { model: SetMaster, as: 'exam_category'},
                            { model: SetMaster, as: 'category'},
                    ],
                    where,
                    offset: offset,
                    limit: per_page,
                    order: [['created_at', 'DESC']],
                    distinct: true,                   
                })

                const result = pagination({
                    data: rows,
                    count,
                    page,
                    per_page
                });

                return res.status(200).send(result)

            }else {

                const result = pagination({
                    data: userExam,
                    count: userExam.length,
                    page,
                    per_page
                });

                return res.status(200).send(result)
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


    async getUserExams(req, res, next) {
        try {

            const user = await User.findOne({
                include: [
                    { model: Exam, as: 'user_exams',order: [['created_at', 'DESC']],include: [
          
                        { model: SetMaster, as: 'exam_category'},
                        { model: SetMaster, as: 'category'},
                  ] },
                ],
                where: {
                    id: req.user.user.id,
                },
            })
                return res.status(200).send(user.user_exams)


        } catch (error) {
            console.log(error)
            let errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    },

    async startExam(req, res, next) {
        try {

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            var examEnrollment = await ExamEnrollments.findOne({
           
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            console.log("Udah sampe ini !")
            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }
        
            const NOW = new Date();

            var examAttemption = await ExamAttemptions.findOne({
                include: [
                    {model: ExamAttemptionsAnswers, as: 'answers',attributes:{exclude: ['is_correct','is_corrected']}},
                    { model: Exam, as: 'exam', include:{ model: ExamQuestions, as: "questions",attributes:{exclude: ['answer']}} },
                ],
                where:{
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.gt]: NOW,
                    }
                }
            })
            
            if(examAttemption){

                return res.status(200).send(examAttemption)

            }else{


                var newDateObj = new Date(NOW.getTime() + exam.duration*60000);
                var newExamAttemption = await ExamAttemptions.create(
                    {
                        user_id: req.user.user.id,
                        exam_id: exam.id,
                        started_at: NOW,
                        finished_at: newDateObj,
                        score: 0
                    }
                )


                var createdExamAttemption = await ExamAttemptions.findOne({
                    include: [
                        {model: ExamAttemptionsAnswers, as: 'answers',attributes:{exclude: ['is_correct','is_corrected']}},
                   {  model: Exam, as: 'exam', include:{ model: ExamQuestions, as: "questions",attributes:{exclude: ['answer']}} }
               ],
               where:{
                   id: newExamAttemption.id,
                   user_id: req.user.user.id
               }
           })

                return res.status(200).send(createdExamAttemption)
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


    async insertAnswerExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var examEnrollment = await ExamEnrollments.findOne({
           
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }
        

            var examAttemption = await ExamAttemptions.findOne({
                where:{
                    id: req.body.attemption_id,
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.gt]: NOW,
                    }
                }
                
                

       })
 
       if(examAttemption){

        var isAnswered = await ExamAttemptionsAnswers.findOne({
            where:{
                attemption_id: req.body.attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id
            }
        })

        if(isAnswered){
            return errorResponse(res, 400, "Pertanyaan sudah pernah dijawab", [])
        }

        var examQuestion = await ExamQuestions.findOne({
            where: {
                id: req.body.question_id,
                exam_id: req.params.exam_id
            }
        })

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isCorrect = 0
        var isCorrected = 0

        if (examQuestion.question_type == 6001){

            if(req.body.answer == examQuestion.answer){
                isCorrect = 1
            }

            isCorrected = 1
  
            var questionAnswer = await ExamAttemptionsAnswers.create({
                answer: req.body.answer,
                attemption_id: req.body.attemption_id,
                question_id: examQuestion.id,
                user_id: req.user.user.id,
                is_correct: isCorrect,
                is_corrected: isCorrected
            })

            return res.status(200).send({message: "Pertanyaan berhasil dijawab"})
        }
        
       }else {

        return errorResponse(res, 400, "Attemtion sudah tidak aktif atau tidak ditemukan", [])

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


    async updateAnswerExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var examEnrollment = await ExamEnrollments.findOne({
           
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }
        

            var examAttemption = await ExamAttemptions.findOne({
                where:{
                    id: req.body.attemption_id,
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.gt]: NOW,
                    }
                }
                
                

         })
 
       if(examAttemption){



        var examQuestion = await ExamQuestions.findOne({
            where: {
                id: req.body.question_id,
                exam_id: req.params.exam_id
            }
        })

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isAnswered = await ExamAttemptionsAnswers.findOne({
            where:{
                attemption_id: req.body.attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id,
                id: req.body.answer_id
            }
        })

        if(!isAnswered){
            return errorResponse(res, 400, "Pertanyaan belum pernah dijawab / jawaban pertanyaan tidak ditemukan", [])
        }

        var isCorrect = 0
        
        if (examQuestion.question_type == 1){

            if(req.body.answer == examQuestion.answer){
                isCorrect = 1
            }  

            var newQuestionAnswer = await ExamAttemptionsAnswers.update(
                {
                    answer: req.body.answer,
                    is_correct: isCorrect
                },
                {
                    where: {
                        id: isAnswered.id,
                        attemption_id: isAnswered.attemption_id,
                        question_id: req.body.question_id,
                        user_id: req.user.user.id
                    },
                }
            )

            return res.status(200).send({message: "Jawaban pertanyaan berhasil diupdate"})
        }
        
        
       }else {

        return errorResponse(res, 400, "Attemtion sudah tidak aktif atau tidak ditemukan", [])

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



    async deleteAnswerExamQuestion(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            const NOW = new Date();

            var examEnrollment = await ExamEnrollments.findOne({
           
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }
        

            var examAttemption = await ExamAttemptions.findOne({
                where:{
                    id: req.body.attemption_id,
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.gt]: NOW,
                    }
                }
                
                

         })
 
       if(examAttemption){



        var examQuestion = await ExamQuestions.findOne({
            where: {
                id: req.body.question_id,
                exam_id: req.params.exam_id
            }
        })

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isAnswered = await ExamAttemptionsAnswers.findOne({
            where:{
                attemption_id: req.body.attemption_id,
                question_id: req.body.question_id,
                user_id: req.user.user.id,
                id: req.body.answer_id
            }
        })

        if(!isAnswered){
            return errorResponse(res, 400, "Pertanyaan belum pernah dijawab / jawaban pertanyaan tidak ditemukan", [])
        }
            
            var deleteAnswer = await ExamAttemptionsAnswers.destroy({
                where:{
                    attemption_id: req.body.attemption_id,
                    question_id: req.body.question_id,
                    user_id: req.user.user.id,
                    id: req.body.answer_id
                }
            })


            return res.status(200).send({message: "Jawaban pertanyaan berhasil dihapus"})
        
       }else {

        return errorResponse(res, 400, "Attemtion sudah tidak aktif atau tidak ditemukan", [])

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


    async finishExam(req, res, next) {
        try {

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            var examEnrollment = await ExamEnrollments.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk menyelesaikan soal", [])
            }
        
            const NOW = new Date();

            var examAttemption = await ExamAttemptions.findOne({
            where:{
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.gt]: NOW,
                    }
                }
            })
            
            if(examAttemption){


            var updatedExamAttemtions = await ExamAttemptions.update(
                {
                    finished_at: NOW,
                },
                {
                    where: {
                        id: examAttemption.id,
                        exam_id: examAttemption.exam_id,
                    },
                }
            )

                return res.status(200).send({message: "Pengerjaan Soal telah diselesaikan"})

            }else{
         
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


    async getExamAttemptionDetail(req, res, next) {
        try {

            const NOW = new Date();
            var examAttemption = await ExamAttemptions.findOne({
                include: [
                    {model: ExamAttemptionsAnswers, as: 'answers'},
                    { model: Exam, as: 'exam', include:{ model: ExamQuestions, as: "questions"} },
                ],
                where:{
                    exam_id: req.params.exam_id,
                    id: req.params.attemption_id,
                    user_id: req.user.user.id
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

    async rateExam(req, res, next) {
        try {

            const NOW = new Date();

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "Validation error", errors.array())
              }


            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            var examEnrollment = await ExamEnrollments.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }

            var examAttemption = await ExamAttemptions.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id,
                    started_at:{
                        [Op.lt]: NOW,
                    },
                    finished_at:{
                        [Op.lt]: NOW,
                    }
                }
            })

            if(!examAttemption){
                return errorResponse(res, 400, "Anda belum pernah menyelesaikan soal", [])
            }

            var examRating = await ExamRatings.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })



            if(examRating){
                return errorResponse(res, 400, "Anda sudah pernah memberikan rating sebelumnya", [])
            }else {

                await ExamRatings.create({
                    rate: req.body.rate,
                    feedback: req.body.feedback,
                    user_id: req.user.user.id,
                    exam_id: req.params.exam_id
                })

                return res.status(200).send({message: "Berhasil memberikan rating"})

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

    async checkEverRateExam(req, res, next) {
        try {

            var exam = await Exam.findByPk(req.params.exam_id)

            if(!exam){
                return errorResponse(res, 404, "Soal tidak ditemukan", [])
            }

            var examEnrollment = await ExamEnrollments.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }

            var examRating = await ExamRatings.findOne({
                where: {
                    exam_id: exam.id,
                    user_id: req.user.user.id
                }
            })

            if(examRating){
                return errorResponse(res, 400, "Sudah pernah memberikan rating", [])
            }else {
                return res.status(200).send({message: "Belum pernah memberikan rating"})
            }

        }catch (error) {
            console.log(error)
            let errStacks = []
            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }

    }








}

export default ExamController
