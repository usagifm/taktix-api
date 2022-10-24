import { errorResponse, errorMapper } from './../../../helpers/errorResponse'
import cloudinary from './../../../helpers/cloudinary'
import {SetMaster,Province} from './../../../db/models'
import DatauriParser from "datauri/parser";
const parser = new DatauriParser();
import path from 'path';

import { validationResult } from 'express-validator'

const GeneralController = {
    async uploadImage(req, res, next) {
       try{
        if (req.isFileValid == false){
            return errorResponse(res, 400, "File yang diupload hanya boleh berupa gambar dan tidak boleh lebih dari 1 MB", [])
        }

        if (!req.file){
            return errorResponse(res, 400, "Tidak ada gambar yang diupload", [])
        }
        console.log(req.file)

        if (!req.query.category){
            return errorResponse(res, 400, "Masukan kategori gambar", [])
        }
        
        // convert to base64 so can be uploaded to cloudinary
        const extName = path.extname(req.file.originalname).toString();
        let file64 = parser.format(extName, req.file.buffer);

        const result = await cloudinary.uploader.upload(
            file64.content,
            {
                folder: `${req.query.category}`,
                public_id: `${Date.now()}_${req.query.category}_${Math.floor(Math.random() * 696969)}`,
                quality: 60,
            }
        )
    
        return res
        .status(200)
        .json({ image: result.secure_url })

       }catch (error){

            console.log(error)
        // return errorResponse(res, 400, error, [])

       }
    },

    async getSetMasters(req, res, next) {

        if (!req.query.category || req.query.category =="" ){
            return errorResponse(res, 400, 'Masukan kategori set master', [])
        }

        try {
            const setMaster = await SetMaster.findAll({
                
                where: {
                    category: req.query.category,
                },
            })

            if (setMaster.length > 0) {
                return res.status(200).send(setMaster)
            } else {
                return errorResponse(res, 400, 'Data set master untuk kategori '+ req.query.category +" tidak ditemukan", [])
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
    async getProvinces(req, res, next) {


        try {
            const provinces = await Province.findAll({
                attributes: ['id','name']
            })
                return res.status(200).send(provinces)
    
        } catch (error) {
            console.log(error)

            let errStacks = []

            if (error.errors) {
                errStacks = errorMapper(error.errors)
            }
            return errorResponse(res, 400, error.message, errStacks)
        }
    }

}


export default GeneralController
