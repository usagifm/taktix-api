import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
const Op = Sequelize.Op

import { User,Exam,ExamEnrollments,ExamQuestions,ExamAttemptions,ExamAttemptionsAnswers,ExamRatings,SetMaster } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { body, validationResult } from 'express-validator'

const ExamAnswerController = {


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

            console.log("Check point 1")

            if(!examEnrollment){
                return errorResponse(res, 400, "Anda belum mendaftar untuk mengerjakan soal", [])
            }
        

            console.log("Check point 2")

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
 
       console.log("Check point 3")

       if(examAttemption){


        console.log("Check point 4")
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


        console.log("Check point 5")
        var examQuestion = await ExamQuestions.findOne({
            where: {
                id: req.body.question_id,
                exam_id: req.params.exam_id
            }
        })


        console.log("Check point 6")

        if(!examQuestion) {
            return errorResponse(res, 400, "Pertanyaan tidak ditemukan", [])
        }

        var isCorrect = 0
        var isCorrected = 0

        console.log("Check point 7")

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

            console.log("Check point 7")
            return res.status(200).send({message: "Pertanyaan berhasil dijawab"})
        }
        

        console.log("Check point 8")
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
        
        if (examQuestion.question_type == 6001){

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

export default ExamAnswerController
