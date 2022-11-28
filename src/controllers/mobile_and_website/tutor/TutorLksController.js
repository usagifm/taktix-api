import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op
import { Class, SetMaster,Lks,TutorLks,User,LksSection,LksContent } from '../../../db/models'
import { pagination } from '../../../helpers/pagination';
import { body, validationResult } from 'express-validator'

const TutorLksController = {

    async buyLks(req, res, next) {
        try {

            const lks = await Lks.findOne({
                where: {
                    id: req.params.lks_id
                }
            })


            if (!lks) {
                return errorResponse(res, 404, 'LKS tidak ditemukan', [])
            }

            const tutorLks = await TutorLks.findOne({
                where: {
                    tutor_id: req.user.user.id,
                    lk_id: req.params.lks_id
                }
            })


            if (tutorLks) {
                return errorResponse(res, 400, 'Sudah membeli LKS', [])
            }else{

             const buy = await TutorLks.create(
                {
                    tutor_id: req.user.user.id,
                    lk_id: req.params.lks_id
                }, { fields: ["tutor_id", "lk_id"] }
            )

                return res.status(200).send({message:"Berhasil membeli LKS"})  

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

    async getLks(req, res, next) {
        try {


            var tutorLkses = await TutorLks.findAll({
                where:{
                    tutor_id: req.user.user.id
                }
            })

            const where = {};

            if (tutorLkses.length > 0) {

            var LksId = tutorLkses.map(function(item) {
                return item['lk_id'];
            });
            
            where.id = {
                [Op.ne]: LksId
              }
        }
           
 
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const { subject_id, title, grade_id } = req.query;
            if (subject_id) where.subject_id = { [Op.eq]: subject_id }
            if (grade_id) where.grade_id = { [Op.eq]: grade_id }
            if (title) where.title = { [Op.like]: `%${title}%` }
            const offset = 0 + (req.query.page - 1) * per_page
            var { count, rows } = await Lks.findAndCountAll({
                include: [
                    { model: SetMaster, as: 'grade' },
                    { model: SetMaster, as: 'subject' },
                    { model: LksSection, as: 'sections' },
                ],
                where,
                offset: offset,
                limit: per_page,


            });

            rows = rows.map(function(item) {

                    item.setDataValue('is_owned', false);
         
                return item

            });

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

    // async getLks(req, res, next) {
    //     try {
    //         const where = {};
    //         const page = req.query.page ? parseInt(req.query.page) : 1;
    //         const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
    //         const { subject_id, title, grade_id } = req.query;
    //         where.creator_id = req.user.user.id
    //         if (subject_id) where.subject_id = { [Op.eq]: subject_id }
    //         if (grade_id) where.grade_id = { [Op.eq]: grade_id }
    //         if (title) where.title = { [Op.like]: `%${title}%` }
    //         const offset = 0 + (req.query.page - 1) * per_page
    //         const { count, rows } = await Class.findAndCountAll({
    //             include: [
    //                 { model: SetMaster, as: 'grade' },
    //                 { model: SetMaster, as: 'subject' },
    //                 { model: Lks, as: 'lks' },
    //                 { model: Lks, as: 'tutor_lks', where:{
    //                     tutor_id: req.user.user.id
    //                 }}
    //             ],
    //             where,
    //             offset: offset,
    //             limit: per_page,


    //         });
    //         console.log(pagination)
    //         const result = pagination({
    //             data: rows,
    //             count,
    //             page,
    //             per_page
    //         });


    //         return res.status(200).send(result)

    //     } catch (error) {
    //         console.log(error)
    //         let errStacks = []
    //         if (error.errors) {
    //             errStacks = errorMapper(error.errors)
    //         }
    //         return errorResponse(res, 400, error.message, errStacks)
    //     }
    // },

    async getTutorLksPagination(req, res, next) {
        try {

            const tutorLks = await TutorLks.findAll({
                where: {
                    tutor_id: req.user.user.id
                }
            })

            const where = {};
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const per_page = req.query.page ? parseInt(req.query.per_page) : 1;
            const offset = 0 + (req.query.page - 1) * per_page
            const {subject_id, title,grade_id} = req.query;
            if (subject_id) where.subject_id = { [Op.eq]: subject_id}
            if (grade_id) where.grade_id = { [Op.eq]: grade_id}
            if (title) where.title = { [Op.like]: `%${title}%`}
          

            if (tutorLks.length > 0 ){

                var LksId = tutorLks.map(function(item) {
                    return item['lk_id'];
                });

                where.id = LksId
                var { count, rows } = await Lks.findAndCountAll({
                    include: [
                            { model: SetMaster, as: 'grade'},
                            { model: SetMaster, as: 'subject'},
                            { model: LksSection, as: 'sections' },
                    ],
                    where, 
                    offset: offset,
                    limit: per_page,
                    order: [['created_at', 'DESC']],
                    distinct: true,                   
                })

                var newRows = rows.map(function(item) {

                    item.setDataValue('is_owned', true);

                    return item
                });

                const result = pagination({
                    data: newRows,
                    count,
                    page,
                    per_page
                });

                return res.status(200).send(result)

            }else {

                const result = pagination({
                    data: tutorLks,
                    count: tutorLks.length,
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

    async getTutorLks(req, res, next) {
        try {

            const where = {};
            const {subject_id, title,grade_id} = req.query;
            if (subject_id) where.subject_id = { [Op.eq]: subject_id}
            if (grade_id) where.grade_id = { [Op.eq]: grade_id}
            if (title) where.title = { [Op.like]: `%${title}%`}

            const tutor = await User.findOne({
                include: [
                    { model: Lks, as: 'tutor_lks', where: where, required: false ,order: [['created_at', 'DESC']],include: [
                        { model: SetMaster, as: 'grade'},
                        { model: SetMaster, as: 'subject'},
                        { model: LksSection, as: 'sections' },
                  ] },
                ],
                where: {
                    id: req.user.user.id,
                },
            })

            if (tutor){

                if(tutor.tutor_lks.length > 0){

                tutor.tutor_lks = tutor.tutor_lks.map(function(item) {

                    item.setDataValue('is_owned', true);

                    return item
                });

            }

                return res.status(200).send(tutor.tutor_lks)
            }else {

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

    async getLksById(req, res, next) {
        try {

            const is_owned = await TutorLks.findOne({
                where:{
                    lk_id: req.params.lks_id,
                    tutor_id: req.user.user.id
                }
            })

            var include

            if(is_owned){ 
                include = {model: LksSection, as: "sections", include: {model: LksContent, as: "contents"}}
            }else {
                include = {model: LksSection, as: "sections",  include: {model: LksContent, as: "contents",attributes: ['content_name'] }}
            }

            const lks = await Lks.findOne({
                include: [
                    { model: SetMaster, as: 'grade' },
                    { model: SetMaster, as: 'subject' },
                    include
                ],
                where: {
                    id: req.params.lks_id,
                },
            })


            if (lks) {

                if(is_owned){ 
                    lks.setDataValue('is_owned', true);
                }else {
                    lks.setDataValue('is_owned', false);
                }

                return res.status(200).send(lks)
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

}
export default TutorLksController