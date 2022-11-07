const adminModel=require('../model/admin.model');
const loggedInUserModel = require('../model/user.model');
const blogModel = require('../model/blog.model');
const faqModel = require('../model/faq.model');
const feedBackModel = require('../model/feedback.model');
const contactModel = require('../model/contact.model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const feedbackModel = require('../model/feedback.model');

class AdminController{



    /**
      * @method userAuth
      * @description To authenticate users
      */
     async userAuth(req, res, next) {
        try {
            let user = req.user;
            console.log(user);
            if (user) {
                
                next();
            } else {
                res.redirect('/admin/login');
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * 
     * @method: showIndexPAge 
     * @desc: Rendering login page
     */
    async showIndexPage(req,res){
    try {
        res.render('admin/login',{
            title: 'Sb Admin Panel login',
            user: req.user
        })
        } catch (error) {
        console.log(error);
        throw(error)
        }
    }

    


    /**
     * @method: showAdminTemplate
     * @desc: to render admin template
     */

    async showAdminTemplate(req,res){
        try {
            let fetchUserDetails = await loggedInUserModel.find({isDeleted:false});
            console.log('58==>',fetchUserDetails);
            res.render('admin/template',{
                title:'Admin-template',
                userData: fetchUserDetails,
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * @method: showRegistrationPage
     * @desc: to render regsitration page
     */
    async showRegistrationPage(req,res){
        try {
            res.render('admin/register',{
                title: 'Registration'
            })
        } catch (error) {
            console.log(error);
        }
    }

     /**
     * @method: submitRegistrationpage
     * @desc: to submit regsitration page
     */

    async submitRegistrationpage(req,res){
        try {
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();
      
            //Checking if the fields are blank or not
            if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
             console.log('message 103=>', "Field Should Not Be Empty!!");
              res.redirect('/admin/register');
            }
      
            //Checking if email already exists
            let isEmailExists = await adminModel.find({ email: req.body.email });
      
            if (!isEmailExists.length) {
                req.body.image = req.file.filename
              req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      
              let Data = await adminModel.create(req.body);
              req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
      
              //Checking to see if Data is Saved
              if (Data && Data._id) {
                console.log('message', 'Registration Successful!!');
                res.redirect('/admin/login');
              } else {
                console.log('message', 'Registration Not Successful!!');
                res.redirect('/admin/register');
              }
              console.log(Data);
            } else {
              console.log('message', 'Email Already Exists!!');
              res.redirect('/admin/register');
            }
      
          } catch (err) {
            throw err;
          }
        
    }




     /**
     * @method: signInAdmin
     * @desc: to signIn to dashboard page
     */

      async signInAdmin(req,res){
        
        
        try {
            
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();

            console.log('req.user===>',req.user);

            let isUserExists = await adminModel.findOne({
                email:req.body.email
            });
            console.log('160=>',isUserExists);

            if (!req.body.password && !req.body.email) {
                res.redirect('/admin/login');
            } else {
                if (isUserExists && isUserExists.role === 'Admin') {
                    const hashPassword = isUserExists.password;
                    if (bcrypt.compareSync(req.body.password, hashPassword)) {
                        // token creation
                        const token = jwt.sign({
                            id: isUserExists._id,
                            email: isUserExists.email,
                            fullName: isUserExists.fullName,
                            image: isUserExists.image,
                            

                        }, 'MREW333SGYTY', { expiresIn: '24h' });

                        // req.user.token = token;
                        res.cookie('usertokken', token); // Set your cookie
                        console.log('Logged In...');

                        
                        res.redirect('/admin/dashboard');
                    } else {
                        
                        res.redirect('/admin/login');
                    }
                } else {
                    req.flash('message', 'Email does not exist!');
                    res.redirect('/admin/login');
                }
                console.log('isUserExists====>',isUserExists);
            }
        } catch (err) {
            throw err;
        }
    }
    



    /**
     * 
     * @method: showDashBoardPAge 
     * @desc: Rendering dashboard page
     */

     async showDashBoardPage(req,res){
        try {
            
            console.log('1',req.user);
            res.render('admin/dashboard',{
                title: 'Dashboard',
                user: req.user
              
            })
        } catch (error) {
            console.log(error);
        }
    }

     
    /**
     * @method: getLogout
     * @desc: to logout from the dashboard page
     */

    async getLogout(req,res){
        try {
            console.log('Cookies======>' + req.cookies);
        res.clearCookie('usertokken');
        console.log('Cookie Cleared!');
        res.redirect('/admin/login');
        } catch (error) {
            console.log(error);
        }
    }


    

    /**
     * @method: postUserDetails
     * @desc: to post user details from the user form
     */

    async postUserFormDetails(req,res){
        try {
            // console.log(req.body);
            // console.log(req.file);
            req.body.image = req.file.filename;
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            if(!req.body.firstName && !req.body.lastName) {
                console.log('Field Should Not Be Empty');
                res.redirect('/admin/user-form')
            }
            let isEmailExists = await loggedInUserModel.find({email: req.body.email, isDeleted:false});
            if(!isEmailExists.length){
                console.log(req.body);
                req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
                let saveUserData = await loggedInUserModel.create(req.body);
                    console.log(saveUserData);
                    if(saveUserData && saveUserData._id) {
                        console.log("Data Added Successfully");
                        res.redirect('/admin/template')
    
                }else {
                    console.log('Phone No Already Exists');
                    res.redirect('/admin/user-form')
                }
            }else {
                console.log("Email Already exists");
                res.redirect('/admin/user-form');
            }
        }catch (err) {
            console.log(err);
            throw err;
    
        }
    }

     /**
     * @method: showLoggedInUser
     * @desc: to show loggedin User form after submit has been done
     */

     async showLoggedInUser(req,res){
        try {
            res.render('admin/loggedin-user-form',{
                title:'User-Form-Logged-In',
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
     }

    /**
     * @method: editUserDetails
     * @desc: to edit user details page from the edit form
     */

    async editUserEditDetails(req,res){
        try {
            let editUserData = await loggedInUserModel.find({_id: req.params.id});
            
             console.log('294',editUserData[0]);
             
            res.render('admin/edit-user-form', {
                title: 'Edit || UserDetails',
                response: editUserData[0],
                user: req.user
                
            })
        }catch (err) {
            throw err;
        }
    }

    /**
     * @method: editUserDetails
     * @desc: to edit user details page
     */
    
    async postEditUserEditDetails(req,res){
        try {
            let data = await loggedInUserModel.find({_id: req.body.id});
            console.log('304',data);
            console.log('305',req.file);
            let isEmailExists = await loggedInUserModel.find({email: req.body.email, _id: {$ne: req.body.id}});
            console.log('314',isEmailExists);
            if(!isEmailExists.length) {
                req.body.image = req.file.filename;
                req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
                let findUserDetailsAndUpdate = await loggedInUserModel.findByIdAndUpdate(req.body.id, req.body);
                
                console.log('findUserInfo==>', findUserDetailsAndUpdate);
                fs.unlinkSync(`./public/uploads/${data[0].image}`);
                if(findUserDetailsAndUpdate && findUserDetailsAndUpdate._id) {
                    
                    console.log('loggedInUserModel Updated');
                    res.redirect('/admin/template')
                }else {
                    console.log('Something Went Wrong');
                    res.redirect('/admin/user-form')
                }
            }else {
                console.log('Email Already Exists');
                res.redirect('/admin/dashboard')
            }
        }catch (err) {
            throw err;
        }
    }

    /**
   * @method: userDelete
   * @description: Soft Deleting the Users
   */
  async userDelete(req, res) {
    try {
      let dataUpdate = await loggedInUserModel.findByIdAndUpdate(req.params.id, {
        isDeleted: true
      });
      if (dataUpdate && dataUpdate._id) {
        console.log('Data Deleted!!');
        res.redirect('/admin/template')
      } else {
        console.log('Data Not Deleted!');
        res.redirect('/admin/template')
      }
    } catch (err) {
      throw err;
    }
  }



    // Blog Part
    /**
     * @method: showBlogPage
     * @desc: to show blog page
     */

    async showBlogPage(req,res){
        try {
            res.render('admin/blog-page',{
                title: 'Blog',
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @method: showBlogForm
     * @desc: to show submitted blog data
     */

    async showBlogPageDetails(req,res){
        try {
            
            let blogData = await blogModel.find({isDeleted:false})
            console.log('354', blogData);
            res.render('admin/blog-form-details',{
                title:'Blog-Form',
                blogData,
                user:req.user
            })
        } catch (error) {
            console.log(error);
        }
    }

    
    /**
     * @method: showBlogForm
     * @desc: to show blog form
     */

    async submitBlogForm(req,res){
        try {
            console.log('412',req.file);

            if(req.file && req.file.filename){
                req.body.image = req.file.filename

            }
            let submitBlogBody = await blogModel.create(req.body)
            console.log(req.body);
            if(submitBlogBody && submitBlogBody._id){
                console.log('BLog Submitted');
                res.redirect('/admin/blog-page')
            }else{
                console.log('Blog not submitted');
                res.redirect('/admin/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    }


     /**
     * @method: showBlogEditForm
     * @desc: to show blog edit form
     */

     async showBlogEditForm(req,res){
        try {
            let showBlogData = await blogModel.find({_id: req.params.id});
            console.log('435==>',showBlogData[0]);
            res.render('admin/blog-edit-page',{
                response: showBlogData[0],
                title:'Blog|| Edit',
                user: req.user
            })
            
        } catch (error) {
            console.log(error);
        }
     }


     /**
     * @method: showBlogEditForm
     * @desc: to update blog edit form
     */
     async postEditBlogForm(req,res){
        try {
            let postEditId = await blogModel.find({_id:req.body.id});
            console.log('461==>', postEditId);
            console.log('456==>',req.file);
            req.body.image = req.file.filename;
            let updateBlogData = await blogModel.findByIdAndUpdate(req.body.id, req.body);
            console.log('455==>', updateBlogData);
            if(updateBlogData && updateBlogData._id){
                console.log('Blog Updated');
                res.redirect('/admin/blog-form-details');
            }else{
                console.log('Blog Not Updated');
                res.redirect('/admin/dashboard');
            }
            
        } catch (error) {
            console.log(error);
        }
     }

     /**
     * @method: deleteBlogEditForm
     * @desc: to delete blog 
     */
     async deleteBlogEditForm(req,res){
        try {
            try {
                let dataUpdate = await blogModel.findByIdAndUpdate(req.params.id, {
                  isDeleted: true
                });
                if (dataUpdate && dataUpdate._id) {
                  console.log('Data Deleted!!');
                  res.redirect('/admin/blog-form-details')
                } else {
                  console.log('Data Not Deleted!');
                  res.redirect('/admin/template')
                }
              } catch (err) {
                throw err;
              }
            
        } catch (error) {
            console.log(error);
        }
     }

    
    
    
     /**
     * @method: showFaqPage
     * @desc: to show faq page
     */
    async showFaqPage(req,res){
        try {
            res.render('admin/faq',{
                title:'FAQ || Submit',
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
    }



    /**
     * @method: showFaqView
     * @desc: to show faq form page
     */
    async showFaqView(req,res){
        try {
            let viewFaqData = await faqModel.find({isDeleted:false});
            res.render('admin/faq-view',{
                title:'Faq || View',
                user: req.user,
                response: viewFaqData
            })
            
        } catch (error) {
            console.log(error);
        }
    }

    //showFaqEditPage
    /**
     * @method: showFaqEditPage
     * @desc: to show edit faq form page
     */

    async showFaqEditPage(req,res){
        try {
            let faqEditData = await faqModel.find({_id: req.params.id})
            res.render('admin/faq-edit',{
                title:"Faq || Edit",
                response:faqEditData[0],
                user:req.user

            }) 
            
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @method: postFaqEditPage
     * @desc: to show faq form page
     */
        async postFaqEditPage(req,res){
            try {
                let showHiddenData = await faqModel.find({_id:req.body.id});
                let postFaqData = await faqModel.findByIdAndUpdate(req.body.id, req.body);

                if(postFaqData && postFaqData._id){
                    console.log('data Updated');
                    res.redirect('/admin/faq-view')
                }else{
                    console.log('data not updated');
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                console.log(error);
            }
        }

        /**
         * method: deleteFaqEditPage
         * desc: to delete faq details from Table
         */

        async deleteFaqEditPage(req,res){
            try {
                let deleteFaqData = await faqModel.findByIdAndUpdate( req.params.id, {
                    isDeleted:true
                })
                if(deleteFaqData && deleteFaqData._id){
                    console.log('Faq Data deleted');
                    res.redirect('/admin/faq-view')
                }else{
                    console.log('Faq Data not deleted');
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }



    /**
     * @method: postFaqFormPage
     * @desc: to show faq form page
     */

    async postFaqFormPage(req,res){
        try {
            let submitFaqData= await faqModel.create(req.body);
            console.log('428',req.body, submitFaqData);
            if(submitFaqData && submitFaqData._id){
                console.log('Faq Added');
                res.redirect('/admin/faq')
            }else{
                console.log('Faq not added');
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    /**
     * @method: showFeedbackPage
     * @desc: to show feedback page
     */

    async showFeedbackPage(req,res){
        try {
            res.render('admin/feeback-page',{
                title:'FeedBack || Page',
                user: req.user
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    /**
     * method: postFeedbackPage
     * desc: postfeedback page
     */
    async postFeedbackPage(req,res){
        try {
            //console.log('641=>', req.body);
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.feedback = req.body.feedback.trim();
            let postFeedbackData = await feedBackModel.create(req.body);

            
                console.log('642=>', postFeedbackData);
                if(postFeedbackData && postFeedbackData._id){
                    console.log('Feedback Data Submitted');
                    res.redirect('/admin/feedback-page')
                }else{
                    console.log('Data Not Submitted');
                    res.redirect('/admin/feedback-page')
                }
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: showFeedbackPageDetails
     * desc: show feeback form submitted details in a table
     */

    async showFeedbackPageDetails(req,res){
        try {
            let showFeedbackdetails = await feedBackModel.find({isDeleted:false});
            res.render('admin/feedback-page-details',{
                title:'Feedback || Table',
                user: req.user,
                response : showFeedbackdetails
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: showEditFeedbackForm
     * desc: to show edit feedback form
     */

    async showEditFeedbackForm(req,res){
        try {

            let editFeedbackData = await feedBackModel.find({_id: req.params.id});
            
            
            res.render('admin/feedback-page-edit',{
                title: 'Feedback || Edit',
                response: editFeedbackData[0], 
                user: req.user
            })
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: postEditFeedbackForm
     * desc: to post edit feedback form
     */
        async postEditFeedbackPage(req,res){
            try {
                let getHiddenId = await feedbackModel.find({_id: req.body.id});
                let postEditFdDetails= await feedBackModel.findByIdAndUpdate(req.body.id, req.body);

                if(postEditFdDetails && postEditFdDetails._id){
                    console.log('Updated Data added');
                    res.redirect('/admin/feedback-page-details');
                }else{
                    console.log('Updated Data added');
                    res.redirect('/admin/faq')
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }



    /**
     * method: deleteEditFeedbackForm
     * desc: to delete feedback details
     */

        async deleteEditFeedbackForm(req,res){
            try {
                let deleteEditData= await feedBackModel.findByIdAndUpdate(req.params.id,{
                    isDeleted:true
                });
                if(deleteEditData && deleteEditData._id){
                    console.log('Feedback Data Deleted');
                    res.redirect('/admin/feedback-page-details')
                }else{
                    console.log('Feedback Data not deleted');
                    
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    
     /**
     * @method: showContactPage
     * @desc: to show feedback page
     */
    async showContactPage(req,res){
        res.render('admin/contact-page',{
            title: 'Contact || Page',
            user: req.user
        })
    }

    /**
     * method: showContactTable
     * desc: to show contact table
     */

    async showContactTable(req, res){
        try {
            let viewContactTable = await contactModel.find({isDeleted:false});
            res.render('admin/contact-page-table',{
                title:'Contact || Table',
                user :req.user,
                response: viewContactTable
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: postContactPage
     * desc: to post contatc form
     */

    async postContactPage(req,res){
        try {
            req.body.firstName = req.body.firstName.trim();
            req.body.lastName = req.body.lastName.trim();
            req.body.message = req.body.message.trim();
            if(!(req.body.firstName || req.body.lastName || req.body.message)){
                console.log('Fields should not be empty');
                res.redirect('/admin/contact-page-table');
            }
            let postContactDetails = await contactModel.create(req.body);
            if(postContactDetails && postContactDetails._id){
                console.log('Contact Data Added');
                res.redirect('/admin/contact-page-table');
            }else{
                console.log('Contact Data Not Added');
                res.redirect('/admin/contact-page')
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * method: showEditContactForm
     * desc: to show edit contact form
     */
    
    async showEditContactForm(req,res){
        try {
            let editContactForm = await contactModel.find({_id:req.params.id});
            res.render('admin/contact-page-edit',{
                title: 'Contact || Edit',
                response: editContactForm[0],
                user : req.user
            })
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

   
    /**
     * method: postContactEditPage
     * desc: to post edit contact form
     */

    async postContactEditPage(req,res){
        try {
            let hiddenIdContact = await contactModel.find({_id:req.body.id});
            let postEditDetails = await contactModel.findByIdAndUpdate(req.body.id, req.body);
            if(postEditDetails && postEditDetails._id){
                console.log('Data Updated');
                res.redirect('/admin/contact-page-table');
            }else{
                console.log('Data not Updated');
                res.redirect('/admin/contact-page');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    
    /**
     * method: deleteContactForm
     * desc: to delete contact form table data
     */

    async deleteContactForm(req,res){
        try {
            let deleteDataContact = await contactModel.findByIdAndUpdate(req.params.id,{
                isDeleted:true
            });
            if(deleteDataContact && deleteDataContact._id){
                console.log('Data Deleted');
                res.redirect('/admin/contact-page-table');
            }else{
                console.log('Data Not Deleted');
                res.redirect('/admin/contact-page-table');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new AdminController()