const router = require('express').Router();
const adminController = require('../controller/admin.controller');
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


router.get('/login',  adminController.showIndexPage);
router.get('/dashboard',adminController.userAuth, adminController.showDashBoardPage);
router.get('/logout',adminController.userAuth, adminController.getLogout)
router.get('/register', adminController.showRegistrationPage);


//user-form and crud operations
router.get('/template',adminController.userAuth, adminController.showAdminTemplate);
router.get('/logged-in-user',adminController.userAuth, adminController.showLoggedInUser)
router.get('/edit/:id',adminController.userAuth, adminController.editUserEditDetails);
router.get('/delete/:id',adminController.userAuth, adminController.userDelete);
router.post('/postuserdetails', upload.single('image'), adminController.postUserFormDetails)
router.post('/edituserdetails',upload.single('image'), adminController.postEditUserEditDetails)

//post-signin form register details part
router.post('/signin', upload.single('image'), adminController.submitRegistrationpage);
//login-part
router.post('/sign-in-admin', adminController.signInAdmin);

//blog part
router.get('/blog-Page',adminController.userAuth, adminController.showBlogPage);
router.get('/blog-form-details',adminController.userAuth, adminController.showBlogPageDetails);
router.post('/postblog',upload.single('image'), adminController.submitBlogForm);
//blog-edit and blog-delete
router.get('/blog-edit/:id',adminController.userAuth, adminController.showBlogEditForm);
router.get('/blog-delete/:id',adminController.userAuth, adminController.deleteBlogEditForm);
router.post('/edit-postblog',upload.single('image'), adminController.postEditBlogForm);

//Faq Part
router.get('/faq',adminController.userAuth, adminController.showFaqPage);
router.get('/faq-view',adminController.userAuth, adminController.showFaqView);
router.get('/faq-edit/:id',adminController.userAuth, adminController.showFaqEditPage);
router.get('/faq-delete/:id',adminController.userAuth, adminController.deleteFaqEditPage);
router.post('/post-edit-faq', adminController.postFaqEditPage)
router.post('/post-faq', adminController.postFaqFormPage);


//Feedback 
router.get('/feedback-page',adminController.userAuth, adminController.showFeedbackPage);
router.get('/feedback-page-details',adminController.userAuth,adminController.showFeedbackPageDetails )
router.get('/edit-feedback/:id',adminController.userAuth,adminController.showEditFeedbackForm)
router.get('/delete-feedback/:id',adminController.userAuth,adminController.deleteEditFeedbackForm)
router.post('/post-feedback-page', adminController.userAuth, adminController.postFeedbackPage);
router.post('/post-edit-feedback-page', adminController.userAuth, adminController.postEditFeedbackPage);
//Contact
router.get('/contact-page',adminController.userAuth, adminController.showContactPage);
router.get('/contact-page-table',adminController.userAuth, adminController.showContactTable);
router.get('/edit-contact/:id',adminController.userAuth, adminController.showEditContactForm);
router.get('/delete-contact/:id',adminController.userAuth, adminController.deleteContactForm);
router.post('/post-contact-page', adminController.userAuth, adminController.postContactPage);
router.post('/post-contact-edit-page', adminController.userAuth, adminController.postContactEditPage);

module.exports = router;