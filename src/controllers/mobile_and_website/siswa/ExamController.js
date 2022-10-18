import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import { User,Exam,ExamEnrollments } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { validationResult } from 'express-validator'

const ExamController = {
    async getExams(req, res, next) {
        try {

            const where = {};
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const {exam_category_id, title} = req.query;
            if (exam_category_id) where.exam_category_id = { [Op.eq]: exam_category_id}
            if (title) where.title = { [Op.like]: `%${title}%`}
            const offset = 0 + (req.query.page - 1) * per_page
            const { count, rows } = await Exam.findAndCountAll({
                // include: [{model: User}],
                where,
                offset: offset,
                limit: per_page,
                distinct: true,
                
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

            const exam = await Exam.findOne({
                // include: [
                //     { model: SetMaster, as: 'category' },
                //     { model: SetMaster, as: 'exam_category' },
                //     { model: SetMaster, as: 'grade' },
                // ],
                where: {
                    id: req.params.exam_id,
                },
            })

            if (exam) {
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
            return errorResponse(res, 400, error.message, error)
        }
    },

    async getUserExams(req, res, next) {
        try {

            const user = await User.findOne({
                include: [
                    { model: Exam, as: 'user_exams' },
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



}

export default ExamController
