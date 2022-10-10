import { errorResponse, errorMapper } from './../../../helpers/errorResponse'
import cloudinary from './../../../helpers/cloudinary'
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
}

export default GeneralController
