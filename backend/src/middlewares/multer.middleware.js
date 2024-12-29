
import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        const destinationPath = './public/files';
        cb(null,destinationPath);
    },
    filename:function (req,file,cb) {
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix + file.originalname);
    },
})

export const upload = multer({
    storage: storage
})
