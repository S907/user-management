const router = require('express').Router();
const userController = require('../controller/user.controller');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
        //console.log(file);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now()+'myimg'+path.extname(file.originalname));
    }
})

const maxSize = 1*1024*1024;

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true)
        }else {
            cb(null, false);
            return cb(new Error('only jpg and png allowed'));
        }
    },
    limits: maxSize
})


router.get('/user-page', userController.showIndexPage);






module.exports=router;