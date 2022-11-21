import { errorResponse, errorMapper } from '../../../helpers/errorResponse'
const Sequelize = require('sequelize');
import { customAlphabet } from 'nanoid'
const Op = Sequelize.Op

import { Class, SetMaster, Lks, TutorLks, LksSection,LksContent,ClassMember,User } from '../../../db/models'
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

                if(kelas.member_total == kelas.limit){
                    return res.status(400).json({ message: 'Kelas sudah penuh' })
                } else {

                    const is_enrolled = await ClassMember.findOne({ where:{
                        class_id: kelas.id,
                        user_id: req.user.user.id 
                    }})

               

                    if (is_enrolled){
                        return res.status(400).json({ message: 'Sudah masuk ke dalam kelas' })
                 }else{
                    await ClassMember.create({
                        class_id: kelas.id,
                        user_id:  req.user.user.id,
                        joined_at: NOW
                    }, { fields: ["class_id", "user_id","joined_at"] }
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
                include: [{model: Class, as: "user_classes"}],
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

            if(is_enrolled){

            const kelas = await Class.findOne({
                include: [
                    { model: SetMaster, as: 'grade' },
                    { model: SetMaster, as: 'subject' },
                    { model: User, as: "tutor", attributes: ['id','name','email','photo_profile']},
                    { model: Lks, as: 'lks', include: {model: LksSection, as: "sections", include: {model: LksContent, as: "contents"}}},
                    { model: User, as: "class_members", attributes: ['id','name','email','photo_profile'] , include:[{model: SetMaster, as: "gender_type"}]}
                ],
                where: {
                    id: req.params.class_id,
                },
            })

            if (kelas) {
                return res.status(200).send(kelas)
            } else {
                return errorResponse(res, 400, 'Kelas tidak ditemukan', [])
            }
        }else {
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

            if(is_enrolled){

                const unenroll = await ClassMember.destroy({
                    where: {
                        class_id: req.params.class_id,
                        user_id: req.user.user.id
                    }
                })

                return res.status(200).send({message: "Berhasil keluar dari kelas"})

        }else {
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